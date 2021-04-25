import debounce from "awesome-debounce-promise";
import React, { ChangeEvent, FormEvent, useEffect } from "react";
import { useAsync } from "react-async-hook";
import { useTranslation } from "react-i18next";
import useConstant from "use-constant";
import { useQueryParams } from "use-query-params";

import { ButtonVariant } from "../components/Button";
import Concept from "../components/Concept";
import Error from "../components/Error";
import Form from "../components/Form";
import Header from "../components/Header";
import Loading, { LoadingSize } from "../components/Loading";
import config, { SnomedSearchConfig } from "../config";
import { DEBOUNCE_WAIT_MS, QUERY_PARAMS_CONFIG } from "../constants";
import { ConceptResponse, fetchBranches, searchConcepts } from "../store";
import { Concept as ConceptInterface } from "../store/ConceptStore";
import {
  addRefsetMember,
  getRefsetMembers,
  removeRefsetMember,
} from "../store/RefsetStore";

const useSearch = (config: SnomedSearchConfig) => {
  // Handle the input text state
  const [queryParams, setQueryParams] = useQueryParams(QUERY_PARAMS_CONFIG);
  const { q: query, h: hostname, b: branch, rs: referenceSet } = queryParams;

  const hostConfig =
    config.hosts.find((h) => h.hostname === hostname) || config.hosts[0];

  // Debounce the original search async function
  const debouncedSearch = useConstant(() =>
    debounce(searchConcepts, DEBOUNCE_WAIT_MS)
  );

  const searchRequest = useAsync(async () => {
    if (hostname && branch && query) {
      return debouncedSearch(hostConfig, branch, query, referenceSet);
    }
    return ([{}, {}] as unknown) as ConceptResponse[];
  }, [query, branch, referenceSet]); // Ensure a new request is made everytime the text changes (even if it's debounced)

  // Return everything needed for the hook consumer
  return {
    hostname,
    branch,
    query,
    referenceSet,
    searchRequest,
    setQueryParams,
    hostConfig,
  };
};

const Search: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const {
    hostname,
    branch,
    query,
    referenceSet,
    setQueryParams,
    searchRequest,
    hostConfig,
  } = useSearch(config);
  const branchRequest = useAsync(fetchBranches, [hostConfig]);

  useEffect(() => {
    if (branchRequest.result && !branch) {
      const { path } =
        branchRequest.result.find(
          (b) => b.path === hostConfig?.defaultBranch
        ) || {};
      if (path) {
        setQueryParams({ b: path });
      }
    }
  }, [branch, branchRequest, hostConfig, setQueryParams]);

  useEffect(() => {
    if (!hostname) {
      setQueryParams({ h: config.hosts[0].hostname });
    }
  }, [hostname, setQueryParams]);

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    setQueryParams({
      [name]: value,
    });
  };

  const branches = branchRequest.result || [];
  const [refsetResult, suggestionsResult] = searchRequest.result || [];
  const { totalElements = 0, items = [] } = refsetResult || {};
  const { totalElements: totalSuggestions = 0, items: suggestions = [] } =
    suggestionsResult || {};
  const hostnames = config.hosts.map((h) => h.hostname);

  const addToRefset = async (conceptId: string): Promise<void> => {
    await addRefsetMember(hostConfig, branch, conceptId, referenceSet);
    await searchRequest.execute();
  };
  const removeFromRefset = async (conceptId: string): Promise<void> => {
    const response = await getRefsetMembers(
      hostConfig,
      branch,
      conceptId,
      referenceSet
    );
    await Promise.all(
      response.items.map((member) =>
        removeRefsetMember(hostConfig, branch, member.memberId)
      )
    );
    await searchRequest.execute();
  };
  const hideRefsetMember = (concept: ConceptInterface) =>
    !items.map((i) => i.concept.conceptId).includes(concept.conceptId);

  return (
    <div className="container">
      <Header />
      <div className="row mb-5">
        <div className="col">
          {branchRequest.error && <Error>{branchRequest.error.message}</Error>}
          {!branchRequest.loading && !branchRequest.error && (
            <Form
              handleFormSubmit={handleFormSubmit}
              handleInputChange={handleInputChange}
              hostnames={hostnames}
              referenceSets={hostConfig.referenceSets}
              branches={branches}
              referenceSet={referenceSet}
              query={query}
              hostname={hostname}
              branch={branch}
            />
          )}
        </div>
      </div>
      <div className="row">
        <div className="col">
          {searchRequest.loading && <Loading size={LoadingSize.Large} />}
          {searchRequest.error && <Error>{searchRequest.error.message}</Error>}
          {query && !searchRequest.loading && (
            <section aria-labelledby="results">
              <h1 className="h5 mt-5" id="results">
                {referenceSet
                  ? t("results.refsetLabel", {
                      title: hostConfig.referenceSets?.find(
                        (r) => r.id === referenceSet
                      )?.title,
                    })
                  : t("results.label")}
              </h1>
              <p aria-live="polite">
                {t("results.hitWithCount", { count: totalElements })}
              </p>
              <ol className="list-unstyled">
                {items.map(({ concept }) => (
                  <li
                    key={concept.conceptId}
                    className="card p-3 mb-3"
                    aria-labelledby={`${concept.conceptId}-pt`}
                  >
                    <Concept
                      hostConfig={hostConfig}
                      branch={branch}
                      concept={concept}
                      handle={referenceSet ? removeFromRefset : undefined}
                      buttonText={t("button.remove")}
                      buttonVariant={ButtonVariant.Danger}
                    />
                  </li>
                ))}
              </ol>
            </section>
          )}

          {referenceSet && query && !searchRequest.loading && (
            <section aria-labelledby="suggestions">
              <h1 className="h5 mt-5" id="suggestions">
                {t("results.suggestionsLabel")}
              </h1>
              <p aria-live="polite">
                {t("results.hitWithCount", { count: totalSuggestions })}
              </p>
              <ol className="list-unstyled">
                {suggestions
                  .filter(({ concept }) => hideRefsetMember(concept))
                  .map(({ concept }) => (
                    <li
                      key={concept.conceptId}
                      className="card p-3 mb-3"
                      aria-labelledby={`${concept.conceptId}-pt`}
                    >
                      <Concept
                        hostConfig={hostConfig}
                        branch={branch}
                        concept={concept}
                        handle={referenceSet ? addToRefset : undefined}
                        buttonText={t("button.add")}
                      />
                    </li>
                  ))}
              </ol>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;

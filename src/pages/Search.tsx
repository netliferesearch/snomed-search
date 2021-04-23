import debounce from "awesome-debounce-promise";
import React, { ChangeEvent, FormEvent, useEffect } from "react";
import { useAsync } from "react-async-hook";
import { useTranslation } from "react-i18next";
import useConstant from "use-constant";
import { useQueryParams } from "use-query-params";

import Concept from "../components/Concept";
import Error from "../components/Error";
import Form from "../components/Form";
import Header from "../components/Header";
import Loading from "../components/Loading";
import config, { SnomedSearchConfig } from "../config";
import { DEBOUNCE_WAIT_MS, QUERY_PARAMS_CONFIG } from "../constants";
import { ConceptResponse, fetchBranches, fetchConcepts } from "../store";

const useSearch = (config: SnomedSearchConfig) => {
  // Handle the input text state
  const [queryParams, setQueryParams] = useQueryParams(QUERY_PARAMS_CONFIG);
  const { q: query, h: hostname, b: branch, rs: referenceSet } = queryParams;

  const hostConfig =
    config.hosts.find((h) => h.hostname === hostname) || config.hosts[0];

  // Debounce the original search async function
  const debouncedSearch = useConstant(() =>
    debounce(fetchConcepts, DEBOUNCE_WAIT_MS)
  );

  const searchRequest = useAsync(async () => {
    if (hostname && branch && query) {
      return debouncedSearch(hostConfig, branch, query, referenceSet);
    }
    return ({} as unknown) as Readonly<ConceptResponse>;
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
  }, [branch, branchRequest, hostConfig?.defaultBranch, setQueryParams]);

  useEffect(() => {
    if (!hostname) {
      setQueryParams({ h: config.hosts[0].hostname });
    }
  }, [hostname, setQueryParams]);

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();
  };

  const handleHostChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setQueryParams({ h: event.target.value });
  };
  const handleBranchChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setQueryParams({ b: event.target.value });
  };

  const handleReferenceSetChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setQueryParams({ rs: event.target.value });
  };

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQueryParams({ q: event.target.value });
  };

  const branches = branchRequest.result || [];
  const { totalElements = 0, items = [] } = searchRequest.result || {};
  const hostnames = config.hosts.map((h) => h.hostname);

  return (
    <div className="container">
      <Header />
      <div className="row mb-5">
        <div className="col-9 col-md-10">
          {branchRequest.error && <Error>{branchRequest.error.message}</Error>}
          {!branchRequest.loading && !branchRequest.error && (
            <Form
              handleFormSubmit={handleFormSubmit}
              handleHostChange={handleHostChange}
              handleBranchChange={handleBranchChange}
              handleReferenceSetChange={handleReferenceSetChange}
              handleQueryChange={handleQueryChange}
              hosts={hostnames}
              referenceSets={hostConfig.referenceSets}
              branches={branches}
              referenceSet={referenceSet}
              query={query}
              hostname={hostname}
              branch={branch}
            />
          )}
        </div>
        <div className="col-3 col-md-2">
          <div className="d-flex h-100 align-items-center justify-content-center">
            {searchRequest.loading && <Loading />}
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          {searchRequest.error && <Error>{searchRequest.error.message}</Error>}
          {totalElements > 0 && (
            <p className="mb-1">
              {t("results.hitWithCount", { count: totalElements })}
            </p>
          )}
          <ul className="list-group">
            {items.map(
              ({
                concept: {
                  conceptId,
                  fsn: { term: fullySpecifiedName },
                  pt: { term: preferredTerm },
                },
              }) => (
                <li key={conceptId} className="list-group-item mb-3">
                  <Concept
                    hostConfig={hostConfig}
                    branch={branch}
                    preferredTerm={preferredTerm}
                    fullySpecifiedName={fullySpecifiedName}
                    conceptId={conceptId}
                  />
                </li>
              )
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Search;

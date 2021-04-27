import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useAsync } from "react-async-hook";
import { useTranslation } from "react-i18next";

import { ButtonVariant } from "../components/Button";
import Concept from "../components/Concept";
import Error from "../components/Error";
import Form from "../components/Form";
import Header from "../components/Header";
import Loading, { LoadingSize } from "../components/Loading";
import config from "../config";
import {
  addRefsetMember,
  fetchBranches,
  fetchRefsetMembers,
  RefsetContainsConceptError,
  removeRefsetMember,
} from "../store";
import { Concept as ConceptInterface } from "../store/ConceptStore";
import useSearch from "../utils/use-search";

const Search: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const [error, setError] = useState<string>();
  const {
    hostname,
    branch,
    query,
    refsetId,
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
  const [conceptResponse, suggestionResponse, refsetMemberResponse] =
    searchRequest.result || [];

  const hostnames = config.hosts.map((h) => h.hostname);

  const addToRefset = async (conceptId: string): Promise<void> => {
    try {
      await addRefsetMember(hostConfig, branch, conceptId, refsetId);
    } catch (error) {
      if (error instanceof RefsetContainsConceptError) {
        setError(t("error.refsetContainsConcept"));
      } else {
        setError(t("error.addToRefset"));
      }
    }
    await searchRequest.execute();
  };
  const removeFromRefset = async (conceptId: string): Promise<void> => {
    try {
      const response = await fetchRefsetMembers(
        hostConfig,
        branch,
        conceptId,
        refsetId
      );
      await Promise.all(
        response.items.map((member) =>
          removeRefsetMember(hostConfig, branch, member.memberId)
        )
      );
    } catch {
      setError(t("error.removeFromRefset"));
    }

    await searchRequest.execute();
  };
  const hideRefsetMember = (concept: ConceptInterface) =>
    !conceptResponse?.items
      .map((i) => i.concept.conceptId)
      .includes(concept.conceptId);

  const refset = hostConfig.referenceSets?.find((r) => r.id === refsetId);

  return (
    <div className="container">
      <Header />
      <div className="row mb-5">
        <div className="col">
          {branchRequest.error && <Error>{t("error.fetchBranches")}</Error>}
          {error && <Error>{error}</Error>}
          {!branchRequest.loading && !branchRequest.error && (
            <Form
              handleFormSubmit={handleFormSubmit}
              handleInputChange={handleInputChange}
              hostnameList={hostnames}
              refsetList={hostConfig.referenceSets}
              branchList={branches}
              refsetId={refsetId}
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
          {searchRequest.error && <Error>{t("error.fetchConcepts")}</Error>}
          {query && !searchRequest.loading && (
            <section aria-labelledby="results">
              <h1 className="h5 mt-5" id="results">
                {refsetId
                  ? t("results.refsetLabel", {
                      title: refset?.title,
                    })
                  : t("results.label")}
              </h1>
              <p aria-live="polite">
                {t("results.hitWithCount", {
                  count: conceptResponse?.totalElements ?? 0,
                })}
              </p>
              <ol className="list-unstyled">
                {conceptResponse?.items?.map(({ concept }) => (
                  <li
                    key={concept.conceptId}
                    className="card p-3 mb-3"
                    aria-labelledby={`${concept.conceptId}-pt`}
                  >
                    <Concept
                      hostConfig={hostConfig}
                      branch={branch}
                      concept={concept}
                      id={concept.conceptId}
                      handleRefsetChange={
                        refsetId ? removeFromRefset : undefined
                      }
                      buttonText={t("button.remove")}
                      buttonVariant={ButtonVariant.Danger}
                    />
                  </li>
                ))}
              </ol>
            </section>
          )}

          {!query && refsetId && !searchRequest.loading && (
            <section aria-labelledby="results">
              <h1 className="h5 mt-5" id="results">
                {t("results.refsetLabel", {
                  title: refset?.title,
                })}
              </h1>
              <p aria-live="polite">
                {t("results.hitWithCount", {
                  count: refsetMemberResponse?.total ?? 0,
                })}
              </p>
              <ol className="list-unstyled">
                {refsetMemberResponse?.items?.map((item) => (
                  <li
                    key={item.memberId}
                    className="card p-3 mb-3"
                    aria-labelledby={`${item.memberId}-pt`}
                  >
                    <Concept
                      hostConfig={hostConfig}
                      branch={branch}
                      concept={item.referencedComponent}
                      id={item.memberId}
                      handleRefsetChange={
                        refsetId ? removeFromRefset : undefined
                      }
                      buttonText={t("button.remove")}
                      buttonVariant={ButtonVariant.Danger}
                      disableSynonymList
                      disableCodeSystemList
                    />
                  </li>
                ))}
              </ol>
            </section>
          )}

          {query && refsetId && !searchRequest.loading && (
            <section aria-labelledby="suggestions">
              <h1 className="h5 mt-5" id="suggestions">
                {t("results.suggestionsLabel")}
              </h1>
              <p aria-live="polite">
                {t("results.hitWithCount", {
                  count: suggestionResponse?.totalElements ?? 0,
                })}
              </p>
              <ol className="list-unstyled">
                {suggestionResponse?.items
                  ?.filter(({ concept }) => hideRefsetMember(concept))
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
                        id={concept.conceptId}
                        handleRefsetChange={refsetId ? addToRefset : undefined}
                        buttonText={t("button.add")}
                        disableSynonymList
                        disableCodeSystemList
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

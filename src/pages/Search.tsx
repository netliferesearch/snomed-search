import debounce from "awesome-debounce-promise";
import React, { ChangeEvent, FormEvent, useEffect } from "react";
import { useAsync } from "react-async-hook";
import useConstant from "use-constant";
import { useQueryParams } from "use-query-params";

import Concept from "../components/Concept";
import Error from "../components/Error";
import Form from "../components/Form";
import Header from "../components/Header";
import Hits from "../components/HIts";
import Loading, { LoadingSize } from "../components/Loading";
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
    return ({} as unknown) as ConceptResponse;
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
  const { totalElements = 0, items = [] } = searchRequest.result || {};
  const hostnames = config.hosts.map((h) => h.hostname);

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
          {!searchRequest.loading && <Hits totalElements={totalElements} />}
          <ol className="list-unstyled">
            {items.map(({ concept }) => (
              <li key={concept.conceptId} className="card p-3 mb-3">
                <Concept
                  hostConfig={hostConfig}
                  branch={branch}
                  concept={concept}
                />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Search;

import debounce from "awesome-debounce-promise";
import React, { ChangeEvent, FormEvent, useEffect } from "react";
import { useAsync } from "react-async-hook";
import useConstant from "use-constant";
import { StringParam, useQueryParam } from "use-query-params";
import Concept from "../components/Concept";
import Error from "../components/Error";
import Form from "../components/Form";
import Header from "../components/Header";
import Loading from "../components/Loading";
import { defaultBranch, referenceSets, hosts } from "../config";
import { fetchBranches, fetchConcepts, IConceptResult } from "../store";

type SearchProps = {
  scope: string;
};

const useSearch = () => {
  // Handle the input text state
  const [query, setQuery] = useQueryParam("q", StringParam);
  const [host, setHost] = useQueryParam("h", StringParam);
  const [branch, setBranch] = useQueryParam("b", StringParam);
  const [referenceSet, setReferenceSet] = useQueryParam("rs", StringParam);

  // Debounce the original search async function
  const debouncedSearch = useConstant(() => debounce(fetchConcepts, 500));

  const searchRequest = useAsync(async () => {
    if (host && branch && query) {
      return debouncedSearch(host, branch, query, referenceSet || "");
    }
    return ({} as any) as Readonly<IConceptResult>;
  }, [query, branch, referenceSet]); // Ensure a new request is made everytime the text changes (even if it's debounced)

  // Return everything needed for the hook consumer
  return {
    host,
    branch,
    query,
    referenceSet,
    searchRequest,
    setBranch,
    setHost,
    setQuery,
    setReferenceSet,
  };
};

const Search = ({ scope }: SearchProps) => {
  const {
    query,
    setQuery,
    host,
    branch,
    referenceSet,
    setBranch,
    setHost,
    searchRequest,
    setReferenceSet,
  } = useSearch();
  const branchRequest = useAsync(fetchBranches, [host || hosts[0]]);

  useEffect(() => {
    if (branchRequest.result && !branch) {
      const { path } =
        branchRequest.result.find((b) => b.path === defaultBranch) || {};
      if (path) {
        setBranch(path);
      }
    }
  }, [branch, branchRequest, setBranch]);

  useEffect(() => {
    const { id } = referenceSets.find((set) => set.title === scope) || {};
    setReferenceSet(id);
    if (scope === "disorder") {
    } else if (scope === "audience") {
      setReferenceSet("1031000202104");
    } else if (scope === "symptom") {
      setReferenceSet("1051000202108");
    } else if (scope === "treatment") {
      setReferenceSet("1021000202101");
    } else {
      setReferenceSet("");
    }
  }, [setReferenceSet, scope]);

  useEffect(() => {
    if (!host) {
      setHost(hosts[0]);
    }
  }, [host, setHost]);

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();
  };

  const handleHostChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setHost(event.target.value);
  };
  const handleBranchChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setBranch(event.target.value);
  };

  const handleReferenceSetChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setReferenceSet(event.target.value);
  };

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const branches = branchRequest.result || [];
  const { totalElements = 0, items = [] } = searchRequest.result || {};

  return (
    <div className="container">
      <Header scope={scope} />
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
              hosts={hosts}
              branches={branches}
              referenceSet={referenceSet || ""}
              query={query || ""}
              scope={scope}
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
            <p className="mb-1">{`${totalElements} ${
              totalElements > 1 ? "hits" : "hit"
            }`}</p>
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
                    host={host || hosts[0]}
                    branch={branch || ""}
                    preferredTerm={preferredTerm}
                    fullySpecifiedName={fullySpecifiedName}
                    conceptId={conceptId}
                    scope={scope}
                  />
                </li>
              ),
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Search;

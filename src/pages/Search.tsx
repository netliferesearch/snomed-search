import debounce from "awesome-debounce-promise";
import React, { ChangeEvent, FormEvent, useEffect } from "react";
import { useQueryParam, StringParam } from "use-query-params";
import { useAsync } from "react-async-hook";
import useConstant from "use-constant";
import Concept from "../components/Concept";
import Error from "../components/Error";
import Form from "../components/Form";
import Header from "../components/Header";
import Loading from "../components/Loading";
import { defaultBranch } from "../config";
import { fetchBranches, ISearchResult, searchDescriptions } from "../store";

type SearchProps = {
  scope: string;
};

const useSearch = () => {
  // Handle the input text state
  const [query, setQuery] = useQueryParam("q", StringParam);
  const [branch, setBranch] = useQueryParam("b", StringParam);
  const [referenceSet, setReferenceSet] = useQueryParam("rs", StringParam);

  // Debounce the original search async function
  const debouncedSearch = useConstant(() => debounce(searchDescriptions, 500));

  const searchRequest = useAsync(async () => {
    if (query && branch) {
      return debouncedSearch(query, branch, referenceSet || "");
    }
    return ({} as any) as Readonly<ISearchResult>;
  }, [query, branch, referenceSet]); // Ensure a new request is made everytime the text changes (even if it's debounced)

  // Return everything needed for the hook consumer
  return {
    branch,
    query,
    referenceSet,
    searchRequest,
    setBranch,
    setQuery,
    setReferenceSet,
  };
};

const Search = ({ scope }: SearchProps) => {
  const {
    query,
    setQuery,
    branch,
    referenceSet,
    setBranch,
    searchRequest,
    setReferenceSet,
  } = useSearch();
  const branchRequest = useAsync(fetchBranches, []);

  if (branchRequest.result && !branch) {
    const { path } =
      branchRequest.result.find((b) => b.path === defaultBranch) || {};
    if (path) {
      setBranch(path);
    }
  }

  useEffect(() => {
    if (scope === "disorder") {
      setReferenceSet("1091000202103");
    } else if (scope === "audience") {
      setReferenceSet("1031000202104");
    } else {
      setReferenceSet("");
    }
  }, [setReferenceSet, scope]);

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();
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
          {branchRequest.error && (
            <Error message={branchRequest.error.message} />
          )}
          {!branchRequest.loading && !branchRequest.error && (
            <Form
              handleFormSubmit={handleFormSubmit}
              handleBranchChange={handleBranchChange}
              handleReferenceSetChange={handleReferenceSetChange}
              handleQueryChange={handleQueryChange}
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
          {searchRequest.error && (
            <Error message={searchRequest.error.message} />
          )}
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

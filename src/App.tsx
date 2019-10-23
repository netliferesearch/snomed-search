import debounce from "awesome-debounce-promise";
import React, {
  ChangeEvent,
  FormEvent,
  FunctionComponent,
  useState,
  useEffect,
} from "react";
import { useLocation } from "react-router-dom";
import { useAsync } from "react-async-hook";
import useConstant from "use-constant";
import { apiOptions, baseURL, handleResponse } from "./api";
import Concept from "./Concept";
import Error from "./Error";
import Loading from "./Loading";
import Form from "./Form";

const defaultBranch = "MAIN/TEST7/ICPC2";

export interface IBranch {
  path: string;
}

export interface ITerm {
  term: string;
}

export interface IConcept {
  conceptId: string;
  fsn: ITerm;
  pt: ITerm;
}

export interface IDescription {
  concept: IConcept;
}

export interface IResult {
  totalElements: number;
  items: IDescription[];
}

interface ISearchProps {
  scope: string;
}

const fetchBranches = () => {
  const url = new URL(`branches`, baseURL);
  return fetch(url.toString(), apiOptions)
    .then((response) => handleResponse<IBranch[]>(response))
    .then((branches: IBranch[]) => branches);
};

const searchDescriptions = (
  query: string,
  branch: string,
  referenceSet: string,
) => {
  const url = new URL(`browser/${branch}/descriptions`, baseURL);
  url.searchParams.set("limit", "10");
  url.searchParams.set("active", "true");
  url.searchParams.set("groupByConcept", "true");
  url.searchParams.set("language", "no");
  url.searchParams.append("language", "nb");
  url.searchParams.append("language", "nn");
  url.searchParams.append("language", "en");
  url.searchParams.set("conceptActive", "true");
  url.searchParams.set("conceptRefset", referenceSet);
  url.searchParams.set("term", query);
  return fetch(url.toString(), apiOptions).then((response) =>
    handleResponse<IResult>(response),
  );
};

const useSearch = () => {
  // Handle the input text state
  const [query, setQuery] = useState("");
  const [branch, setBranch] = useState("");
  const [referenceSet, setReferenceSet] = useState("");

  // Debounce the original search async function
  const debouncedSearch = useConstant(() => debounce(searchDescriptions, 500));

  const searchRequest = useAsync(async () => {
    if (query.length === 0) {
      return ({} as any) as IResult;
    }
    return debouncedSearch(query, branch, referenceSet);
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

export const useQueryParams = () => {
  return new URLSearchParams(useLocation().search);
};

const App: FunctionComponent = () => {
  const queryParams = useQueryParams();
  const scope = queryParams.get("scope") || "";
  return <Search scope={scope} />;
};

const Search: FunctionComponent<ISearchProps> = ({ scope }) => {
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
    const { path = "" } =
      branchRequest.result.find((b) => b.path === defaultBranch) || {};
    setBranch(path);
  }

  useEffect(() => {
    if (scope === "disorder") {
      setReferenceSet("1091000202103");
    } else if (scope === "audience") {
      setReferenceSet("1031000202104");
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
      <div className="row mb-5">
        <div className="col-9 col-lg-10">
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
              branch={branch}
              referenceSet={referenceSet}
              query={query}
              scope={scope}
            />
          )}
        </div>
        <div className="col-3 col-lg-2">
          {searchRequest.loading && <Loading />}
          {searchRequest.error && (
            <Error message={searchRequest.error.message} />
          )}
          {totalElements > 0 && (
            <p className="mb-1">{`${totalElements} ${
              totalElements > 1 ? "hits" : "hit"
            }`}</p>
          )}
        </div>
      </div>
      <div className="row">
        <div className="col">
          <ul className="list-group">
            {items.map(
              ({
                concept: {
                  conceptId: id,
                  fsn: { term: fullySpecifiedName },
                  pt: { term: preferredTerm },
                },
              }) => (
                <li key={id} className="list-group-item mb-3">
                  <Concept
                    preferredTerm={preferredTerm}
                    branch={branch}
                    fullySpecifiedName={fullySpecifiedName}
                    id={id}
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

export default App;

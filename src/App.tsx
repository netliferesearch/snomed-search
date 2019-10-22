import debounce from "awesome-debounce-promise";
import React, {
  ChangeEvent,
  FormEvent,
  FunctionComponent,
  useState,
} from "react";
import { useAsync } from "react-async-hook";
import useConstant from "use-constant";
import { apiOptions, baseURL, handleResponse } from "./api";
import Concept from "./Concept";
import Error from "./Error";
import Loading from "./Loading";

const defaultBranch = "MAIN/SNOMEDCT-NO/GPFPICPC2";

const referenceSets = [
  {
    id: "",
    title: "[Not specified]",
  },
  {
    id: "1031000202104",
    title: "Målgruppe",
  },
  {
    id: "1091000202103",
    title: "Sykdommer",
  },
];

interface IBranch {
  path: string;
}

interface ITerm {
  term: string;
}

interface IConcept {
  conceptId: string;
  fsn: ITerm;
  pt: ITerm;
}

interface IDescription {
  concept: IConcept;
}

interface IResult {
  totalElements: number;
  items: IDescription[];
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
    setReferenceSet,
    setQuery,
  };
};

const App: FunctionComponent = () => {
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
            <form onSubmit={handleFormSubmit}>
              <div className="form-row">
                <div className="col-sm-4">
                  <div className="form-group mb-md-0">
                    <label htmlFor="branch">Branch</label>
                    <select
                      id="branch"
                      className="form-control"
                      value={branch}
                      onChange={handleBranchChange}
                    >
                      {branches.map(({ path }) => (
                        <option value={path} key={path}>
                          {path}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-sm-4">
                  <div className="form-group mb-md-0">
                    <label htmlFor="referenceSet">Reference set</label>
                    <select
                      id="referenceSet"
                      className="form-control"
                      value={referenceSet}
                      onChange={handleReferenceSetChange}
                    >
                      {referenceSets.map(({ id, title }) => (
                        <option value={id} key={id}>
                          {title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-sm-4">
                  <div className="form-group mb-md-0">
                    <label htmlFor="query">Search</label>
                    <input
                      id="query"
                      className="form-control"
                      type="text"
                      value={query}
                      autoComplete="off"
                      onChange={handleQueryChange}
                    />
                    {searchRequest.error && (
                      <Error message={searchRequest.error.message} />
                    )}
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
        <div className="col-3 col-lg-2">
          {searchRequest.loading && <Loading />}
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

import React, {
  ChangeEvent,
  FormEvent,
  FunctionComponent,
  useContext,
} from "react";
import { referenceSets } from "../config";
import { BranchContext, IBranch } from "../store";

type FormProps = {
  handleFormSubmit: (event: FormEvent<HTMLFormElement>) => void;
  handleBranchChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleReferenceSetChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleQueryChange: (event: ChangeEvent<HTMLInputElement>) => void;
  branches: Array<Readonly<IBranch>>;
  referenceSet: string;
  query: string;
  scope: string;
};

const Form: FunctionComponent<FormProps> = ({
  handleFormSubmit,
  handleBranchChange,
  handleReferenceSetChange,
  handleQueryChange,
  branches,
  scope,
  referenceSet,
  query,
}) => {
  const branch = useContext(BranchContext);
  return (
    <form onSubmit={handleFormSubmit}>
      <div className="form-row">
        {!scope && (
          <>
            <div className="col-md-4">
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
            <div className="col-md-4">
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
          </>
        )}
        <div className="col">
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
          </div>
        </div>
      </div>
    </form>
  );
};

export default Form;

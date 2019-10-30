import React, { ChangeEvent, FormEvent, FunctionComponent } from "react";
import { IBranch } from "../pages/Search";

type ISubmitFunc = (event: FormEvent<HTMLFormElement>) => void;

type ISelectChangeFunc = (event: ChangeEvent<HTMLSelectElement>) => void;

type IQueryChangeFunc = (event: ChangeEvent<HTMLInputElement>) => void;

interface IFormProps {
  readonly handleFormSubmit: ISubmitFunc;
  readonly handleBranchChange: ISelectChangeFunc;
  readonly handleReferenceSetChange: ISelectChangeFunc;
  readonly handleQueryChange: IQueryChangeFunc;
  readonly branches: IBranch[];
  readonly branch: string;
  readonly referenceSet: string;
  readonly query: string;
  readonly scope: string;
}

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

const Form: FunctionComponent<IFormProps> = ({
  handleFormSubmit,
  handleBranchChange,
  handleReferenceSetChange,
  handleQueryChange,
  branches,
  branch,
  scope,
  referenceSet,
  query,
}) => {
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

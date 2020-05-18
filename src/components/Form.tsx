import React, { ChangeEvent, FormEvent } from "react";
import { StringParam, useQueryParam } from "use-query-params";
import { referenceSets } from "../config";
import { IBranch } from "../store";

type FormProps = {
  handleFormSubmit: (event: FormEvent<HTMLFormElement>) => void;
  handleHostChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleBranchChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleReferenceSetChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleQueryChange: (event: ChangeEvent<HTMLInputElement>) => void;
  hosts: string[];
  branches: IBranch[];
  referenceSet: string;
  query: string;
  scope: string;
};

const Form = ({
  handleFormSubmit,
  handleHostChange,
  handleBranchChange,
  handleReferenceSetChange,
  handleQueryChange,
  hosts,
  branches,
  scope,
  referenceSet,
  query,
}: FormProps) => {
  const [branch] = useQueryParam("b", StringParam);
  const [host] = useQueryParam("h", StringParam);
  return (
    <form onSubmit={handleFormSubmit}>
      <div className="form-row">
        {!scope && (
          <>
            <div className="col-12">
              <div className="form-group">
                <label htmlFor="host">Host</label>
                <select
                  id="host"
                  className="form-control"
                  value={host}
                  onChange={handleHostChange}
                >
                  {hosts.map((hostname) => (
                    <option value={hostname} key={hostname}>
                      {hostname}
                    </option>
                  ))}
                </select>
              </div>
            </div>
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

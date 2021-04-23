import React, { ChangeEvent, FormEvent } from "react";
import { useTranslation } from "react-i18next";

import { ReferenceSet } from "../config";
import { Branch } from "../store";

interface FormProps {
  handleFormSubmit: (event: FormEvent<HTMLFormElement>) => void;
  handleHostChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleBranchChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleReferenceSetChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleQueryChange: (event: ChangeEvent<HTMLInputElement>) => void;
  hostnames: string[];
  branches: Branch[];
  referenceSet: string;
  query: string;
  referenceSets?: ReferenceSet[];
  hostname: string;
  branch: string;
}

const Form: React.FunctionComponent<FormProps> = ({
  handleFormSubmit,
  handleHostChange,
  handleBranchChange,
  handleReferenceSetChange,
  handleQueryChange,
  hostnames,
  branches,
  referenceSet,
  query,
  referenceSets,
  hostname,
  branch,
}) => {
  const { t } = useTranslation();

  return (
    <form onSubmit={handleFormSubmit}>
      <div className="form-row">
        <>
          <div className="col-12">
            <div className="form-group">
              <label htmlFor="host">{t("form.host")}</label>
              <select
                id="host"
                className="form-control"
                value={hostname}
                onChange={handleHostChange}
              >
                {hostnames.map((hostname) => (
                  <option value={hostname} key={hostname}>
                    {hostname}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group mb-md-0">
              <label htmlFor="branch">{t("form.branch")}</label>
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
          {referenceSets && (
            <div className="col-md-4">
              <div className="form-group mb-md-0">
                <label htmlFor="referenceSet">{t("form.referenceset")}</label>
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
          )}
        </>
        <div className="col">
          <div className="form-group mb-md-0">
            <label htmlFor="query">{t("form.search")}</label>
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

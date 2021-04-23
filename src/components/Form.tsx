import React, { ChangeEvent, FormEvent } from "react";
import { useTranslation } from "react-i18next";

import { ReferenceSet } from "../config";
import { Branch } from "../store";

interface FormProps {
  handleFormSubmit: (event: FormEvent<HTMLFormElement>) => void;
  handleInputChange: (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
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
  handleInputChange,
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
        <div className="col-lg-6 col-xxl-3">
          <div className="form-group">
            <label htmlFor="host">{t("form.host")}</label>
            <select
              id="host"
              name="h"
              className="form-control"
              value={hostname}
              onChange={handleInputChange}
            >
              {hostnames.map((hostname) => (
                <option value={hostname} key={hostname}>
                  {hostname}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-lg-6 col-xxl-3">
          <div className="form-group mb-md-0">
            <label htmlFor="branch">{t("form.branch")}</label>
            <select
              id="branch"
              name="b"
              className="form-control"
              value={branch}
              onChange={handleInputChange}
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
          <div className="col-lg-6 col-xxl-3">
            <div className="form-group mb-md-0">
              <label htmlFor="referenceSet">{t("form.referenceset")}</label>
              <select
                id="referenceSet"
                name="rs"
                className="form-control"
                value={referenceSet}
                onChange={handleInputChange}
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
        <div className="col-lg-6 col-xxl-3">
          <div className="form-group mb-md-0">
            <label htmlFor="query">{t("form.search")}</label>
            <input
              id="query"
              name="q"
              className="form-control"
              type="text"
              value={query}
              autoComplete="off"
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default Form;

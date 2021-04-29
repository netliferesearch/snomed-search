import React, { ChangeEvent, FormEvent } from "react";
import { useTranslation } from "react-i18next";

import { ReferenceSet, SnowstormConfig } from "../config";
import { Branch } from "../store";

interface FormProps {
  handleFormSubmit: (event: FormEvent<HTMLFormElement>) => void;
  handleInputChange: (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  hostnameList: SnowstormConfig["hostname"][];
  branchList: Branch[];
  refsetId: ReferenceSet["id"];
  query: string;
  refsetList?: ReferenceSet[];
  hostname: SnowstormConfig["hostname"];
  branch: Branch["path"];
  disabled: boolean;
}

const Form: React.FunctionComponent<FormProps> = ({
  handleFormSubmit,
  handleInputChange,
  hostnameList,
  branchList,
  refsetId,
  query,
  refsetList,
  hostname,
  branch,
  disabled,
}) => {
  const { t } = useTranslation();

  return (
    <form onSubmit={handleFormSubmit} role="search">
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
              disabled={disabled}
            >
              {hostnameList.map((hostname) => (
                <option value={hostname} key={hostname}>
                  {hostname}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-lg-6 col-xxl-3">
          <div className="form-group">
            <label htmlFor="branch">{t("form.branch")}</label>
            <select
              id="branch"
              name="b"
              className="form-control"
              value={branch}
              onChange={handleInputChange}
              disabled={disabled}
            >
              {branchList.map(({ path }) => (
                <option value={path} key={path}>
                  {path}
                </option>
              ))}
            </select>
          </div>
        </div>
        {refsetList && (
          <div className="col-lg-6 col-xxl-3">
            <div className="form-group">
              <label htmlFor="referenceSet">{t("form.referenceset")}</label>
              <select
                id="referenceSet"
                name="rs"
                className="form-control"
                value={refsetId}
                onChange={handleInputChange}
                disabled={disabled}
              >
                <option value="">{t("form.notselected")}</option>
                {refsetList.map(({ id, title }) => (
                  <option value={id} key={id}>
                    {title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
        <div className="col-lg-6 col-xxl-3">
          <div className="form-group">
            <label htmlFor="query">{t("form.search")}</label>
            <input
              id="query"
              name="q"
              className="form-control"
              type="text"
              value={query}
              autoComplete="off"
              onChange={handleInputChange}
              disabled={disabled}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default Form;

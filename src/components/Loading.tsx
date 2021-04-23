import classnames from "classnames";
import React from "react";
import { useTranslation } from "react-i18next";

import styles from "./Loading.module.css";

const Loading: React.FunctionComponent = () => {
  const { t } = useTranslation();
  return (
    <div
      className={classnames("spinner-border", styles.loading, "text-secondary")}
      role="status"
    >
      <span className="sr-only">{t("status.loading")}</span>
    </div>
  );
};

export default Loading;

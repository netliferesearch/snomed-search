import classnames from "classnames";
import React from "react";
import { useTranslation } from "react-i18next";

import styles from "./Loading.module.scss";

export enum LoadingSize {
  Small,
  Medium,
  Large,
}

interface LoadingProps {
  size?: LoadingSize;
}

const Loading: React.FunctionComponent<LoadingProps> = ({
  size = LoadingSize.Medium,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={classnames("spinner-border", "text-secondary", {
        [styles["loading--sm"]]: size === LoadingSize.Small,
        [styles["loading--md"]]: size === LoadingSize.Medium,
        [styles["loading--lg"]]: size === LoadingSize.Large,
      })}
      role="status"
    >
      <span className="sr-only">{t("status.loading")}</span>
    </div>
  );
};

export default Loading;

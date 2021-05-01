import React from "react";
import { useTranslation } from "react-i18next";

interface ErrorProps {
  hits?: number;
  total?: number;
}

const Error: React.FunctionComponent<ErrorProps> = ({ hits, total }) => {
  const { t } = useTranslation();

  if (!hits && hits !== 0) {
    return null;
  }
  return (
    <p aria-live="polite">
      {t("results.hitWithCount", {
        count: hits,
        total: total ?? 0,
      })}
    </p>
  );
};

export default Error;

import React from "react";
import { useTranslation } from "react-i18next";

interface HitsProps {
  totalElements: number;
}

const Hits: React.FunctionComponent<HitsProps> = ({ totalElements }) => {
  const { t } = useTranslation();
  return (
    <h1 className="h5 mt-5 mb-3">
      {t("results.hitWithCount", { count: totalElements })}
    </h1>
  );
};

export default Hits;

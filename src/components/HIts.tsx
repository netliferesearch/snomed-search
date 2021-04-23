import React from "react";
import { useTranslation } from "react-i18next";

interface HitsProps {
  totalElements: number;
}

const Hits: React.FunctionComponent<HitsProps> = ({ totalElements }) => {
  const { t } = useTranslation();
  return (
    <p className="mb-1">
      {t("results.hitWithCount", { count: totalElements })}
    </p>
  );
};

export default Hits;

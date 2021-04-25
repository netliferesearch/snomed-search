import React from "react";
import { useAsync } from "react-async-hook";
import { useTranslation } from "react-i18next";

import { SnowstormConfig } from "../config";
import { SNOWSTORM_SYNONYM_TYPE } from "../constants";
import { fetchSynonyms } from "../store";
import Loading, { LoadingSize } from "./Loading";

interface SynonymProps {
  hostConfig: SnowstormConfig;
  branch: string;
  preferredTerm: string;
  conceptId: string;
}

const SynonymList: React.FunctionComponent<SynonymProps> = ({
  hostConfig,
  branch,
  preferredTerm,
  conceptId,
}) => {
  const { t } = useTranslation();
  const request = useAsync(fetchSynonyms, [hostConfig, branch, conceptId]);

  const { items: synonyms = [] } = request.result || {};

  return (
    <ul aria-label={t("results.synonyms")} className="list-unstyled">
      {request.loading && <Loading size={LoadingSize.Small} />}
      {synonyms
        .filter(({ type }) => type === SNOWSTORM_SYNONYM_TYPE)
        .filter(
          ({ lang }) =>
            !hostConfig.languages || hostConfig.languages.includes(lang)
        )
        .filter(({ term }) => term !== preferredTerm)
        .map(({ term, descriptionId: id }) => (
          <li key={id} className="mb-3">
            {term}
          </li>
        ))}
    </ul>
  );
};

export default SynonymList;

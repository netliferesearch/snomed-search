import React from "react";
import { useAsync } from "react-async-hook";
import { useTranslation } from "react-i18next";

import { SnowstormConfig } from "../config";
import { SNOWSTORM_SYNONYM_TYPE } from "../constants";
import { fetchSynonyms, Synonym } from "../store";
import Error from "./Error";
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

  const onlySynonyms = (synonym: Synonym) =>
    synonym.type === SNOWSTORM_SYNONYM_TYPE;

  const onlyLanguages = (synonym: Synonym) =>
    !hostConfig.languages || hostConfig.languages.includes(synonym.lang);

  const excludePreferredTerm = (synonym: Synonym) =>
    synonym.term !== preferredTerm;

  const filtered = synonyms
    .filter(onlySynonyms)
    .filter(onlyLanguages)
    .filter(excludePreferredTerm);

  return (
    <ul aria-label={t("results.synonyms")} className="list-unstyled">
      {request.loading && <Loading size={LoadingSize.Small} />}
      {request.error && <Error>{t("error.fetchSynonyms")}</Error>}
      {filtered.map(({ term, descriptionId }) => (
        <li key={descriptionId} className="mb-3">
          {term}
        </li>
      ))}
    </ul>
  );
};

export default SynonymList;

import React from "react";
import { useAsync } from "react-async-hook";
import { useTranslation } from "react-i18next";

import { SnowstormConfig } from "../config";
import { Branch, Concept, fetchSynonyms, Synonym, Term } from "../store";
import Error from "./Error";
import Loading, { LoadingSize } from "./Loading";

interface SynonymProps {
  hostConfig: SnowstormConfig;
  branch: Branch["path"];
  preferredTerm: Term["term"];
  conceptId: Concept["conceptId"];
}

const SynonymList: React.FunctionComponent<SynonymProps> = ({
  hostConfig,
  branch,
  preferredTerm,
  conceptId,
}) => {
  const { t } = useTranslation();
  const request = useAsync(fetchSynonyms, [hostConfig, branch, conceptId]);

  const synonymList = request.result || [];

  const excludePreferredTerm = (synonym: Synonym) =>
    synonym.term !== preferredTerm;

  const filtered = synonymList.filter(excludePreferredTerm);

  return (
    <>
      {request.loading && <Loading size={LoadingSize.Small} />}
      {request.error && <Error>{t("error.fetchSynonyms")}</Error>}
      <ul aria-label={t("results.synonyms")} className="list-unstyled">
        {filtered.map(({ term, descriptionId }) => (
          <li key={descriptionId} className="mb-3">
            {term}
          </li>
        ))}
      </ul>
    </>
  );
};

export default SynonymList;

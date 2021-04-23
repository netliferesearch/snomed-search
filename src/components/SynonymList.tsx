import React from "react";
import { useAsync } from "react-async-hook";

import { SnowstormConfig } from "../config";
import { SNOWSTORM_SYNONYM_TYPE } from "../constants";
import { fetchSynonyms } from "../store";

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
  const request = useAsync(fetchSynonyms, [hostConfig, branch, conceptId]);

  const { items: synonyms = [] } = request.result || {};

  return (
    <>
      {synonyms
        .filter(({ type }) => type === SNOWSTORM_SYNONYM_TYPE)
        .filter(
          ({ lang }) =>
            !hostConfig.languages || hostConfig.languages.includes(lang)
        )
        .filter(({ term }) => term !== preferredTerm)
        .map(({ term, descriptionId: id }) => (
          <p key={id}>{term}</p>
        ))}
    </>
  );
};

export default SynonymList;

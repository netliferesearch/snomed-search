import React from "react";
import { useAsync } from "react-async-hook";

import { languages } from "../config";
import { fetchSynonyms } from "../store";

type SynonymProps = {
  host: string;
  branch: string;
  preferredTerm: string;
  conceptId: string;
};

const Synonym: React.FunctionComponent<SynonymProps> = ({
  host,
  branch,
  preferredTerm,
  conceptId,
}) => {
  const request = useAsync(fetchSynonyms, [host, branch, conceptId]);

  const { items: synonyms = [] } = request.result || {};

  return (
    <>
      {synonyms
        .filter(({ type }) => type === "SYNONYM")
        .filter(({ lang }) => languages.includes(lang))
        .filter(({ term }) => term !== preferredTerm)
        .map(({ term, descriptionId: id }) => (
          <p key={id}>{term}</p>
        ))}
    </>
  );
};

export default Synonym;

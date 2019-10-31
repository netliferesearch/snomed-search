import React, { FunctionComponent } from "react";
import { useAsync } from "react-async-hook";
import { languages } from "../config";
import { fetchSynonyms } from "../store";

interface ISynonymProps {
  preferredTerm: string;
  branch: string;
  conceptId: string;
}

const Synonym: FunctionComponent<ISynonymProps> = ({
  preferredTerm,
  branch,
  conceptId,
}) => {
  const request = useAsync(fetchSynonyms, [branch, conceptId]);

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

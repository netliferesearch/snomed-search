import React, { useContext } from "react";
import { useAsync } from "react-async-hook";
import { languages } from "../config";
import { BranchContext, fetchSynonyms } from "../store";

type SynonymProps = {
  preferredTerm: string;
  conceptId: string;
};

const Synonym = ({ preferredTerm, conceptId }: SynonymProps) => {
  const branch = useContext(BranchContext);
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

import React from "react";
import { useQueryParam, StringParam } from "use-query-params";
import { useAsync } from "react-async-hook";
import { languages } from "../config";
import { fetchSynonyms } from "../store";

type SynonymProps = {
  preferredTerm: string;
  conceptId: string;
};

const Synonym = ({ preferredTerm, conceptId }: SynonymProps) => {
  const [branch] = useQueryParam("b", StringParam);
  const request = useAsync(fetchSynonyms, [branch || "", conceptId]);

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

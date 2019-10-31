import React, { FunctionComponent } from "react";
import { useAsync } from "react-async-hook";
import { fetchSynonyms } from "../store";

interface ISynonymProps {
  preferredTerm: string;
  branch: string;
  conceptId: string;
}

const Synonym: FunctionComponent<Readonly<ISynonymProps>> = ({
  preferredTerm,
  branch,
  conceptId,
}) => {
  const request = useAsync(fetchSynonyms, [branch, conceptId]);

  const { items = [] } = request.result || {};

  return (
    <>
      {items
        .filter(({ type }) => type === "SYNONYM")
        .filter(({ lang }) => ["nb", "nn", "no"].includes(lang))
        .filter(({ term }) => term !== preferredTerm)
        .map(({ term, descriptionId: id }) => (
          <p key={id}>{term}</p>
        ))}
    </>
  );
};

export default Synonym;

import React, { FunctionComponent } from "react";
import { useAsync } from "react-async-hook";
import { apiOptions, baseURL, handleResponse } from "../api";

interface ISynonymProps {
  readonly preferredTerm: string;
  readonly branch: string;
  readonly conceptId: string;
}

interface IDescription {
  readonly term: string;
  readonly type: string;
  readonly lang: string;
  readonly descriptionId: string;
}

interface IResult {
  readonly items: IDescription[];
}

const fetchSynonyms = (branch: string, conceptId: string) => {
  const url = new URL(`/${branch}/descriptions`, baseURL);
  url.searchParams.set("concept", conceptId);
  url.searchParams.set("offset", "0");
  url.searchParams.set("limit", "10");
  return fetch(url.toString(), apiOptions).then((response) =>
    handleResponse<IResult>(response),
  );
};

const Synonym: FunctionComponent<ISynonymProps> = ({
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

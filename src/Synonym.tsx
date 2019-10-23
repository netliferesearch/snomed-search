import React, { FunctionComponent } from "react";
import { useAsync } from "react-async-hook";
import { apiOptions, baseURL, handleResponse } from "./api";

interface ISynonymProps {
  preferredTerm: string;
  branch: string;
  id: string;
}

interface IDescription {
  term: string;
  type: string;
  lang: string;
  descriptionId: string;
}

interface IResult {
  items: IDescription[];
}

const fetchSynonyms = (branch: string, conceptId: string) => {
  const url = new URL(`/${branch}/descriptions`, baseURL);
  url.searchParams.set("concept", conceptId);
  url.searchParams.set("offset", "0");
  url.searchParams.set("limit", "50");
  return fetch(url.toString(), apiOptions).then((response) =>
    handleResponse<IResult>(response),
  );
};

const Synonym: FunctionComponent<ISynonymProps> = ({
  preferredTerm,
  branch,
  id,
}) => {
  const request = useAsync(fetchSynonyms, [branch, id]);

  const { items = [] } = request.result || {};

  return (
    <>
      {items
        .filter(({ lang }) => ["nb", "nn", "no"].includes(lang))
        .filter(({ term }) => term !== preferredTerm)
        .map(({ term, descriptionId: id }) => (
          <p key={id}>{term}</p>
        ))}
    </>
  );
};

export default Synonym;

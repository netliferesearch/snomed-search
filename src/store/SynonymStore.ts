import { apiOptions, handleResponse } from "../api";
import { limit } from "../config";

interface IDescription {
  term: string;
  type: string;
  lang: string;
  descriptionId: string;
}

interface ISynonymResult {
  items: IDescription[];
}

export const fetchSynonyms = (
  host: string,
  branch: string,
  conceptId: string,
) => {
  const url = new URL(`${branch}/descriptions`, host);
  url.searchParams.set("concept", conceptId);
  url.searchParams.set("offset", "0");
  url.searchParams.set("limit", limit);
  return fetch(url.toString(), apiOptions).then((response) =>
    handleResponse<ISynonymResult>(response),
  );
};

import { apiOptions, handleResponse } from "../api";
import { limit, snowstormUrl } from "../config";

interface IDescription {
  term: string;
  type: string;
  lang: string;
  descriptionId: string;
}

interface ISynonymResult {
  items: Array<Readonly<IDescription>>;
}

export const fetchSynonyms = (branch: string, conceptId: string) => {
  const url = new URL(`${branch}/descriptions`, snowstormUrl);
  url.searchParams.set("concept", conceptId);
  url.searchParams.set("offset", "0");
  url.searchParams.set("limit", limit);
  return fetch(url.toString(), apiOptions).then((response) =>
    handleResponse<Readonly<ISynonymResult>>(response),
  );
};

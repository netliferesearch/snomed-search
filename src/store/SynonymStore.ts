import { Language, SnowstormConfig } from "../config";
import { LIMIT } from "../constants";
import { createHeaders, handleResponse } from "../utils/api";

interface Description {
  term: string;
  type: string;
  lang: Language;
  descriptionId: string;
}

interface SynonymResponse {
  items: Description[];
}

export const fetchSynonyms = (
  hostConfig: SnowstormConfig,
  branch: string,
  conceptId: string,
  offset = "0",
  limit = LIMIT
): Promise<SynonymResponse> => {
  const url = new URL(`${branch}/descriptions`, hostConfig.hostname);
  url.searchParams.set("concept", conceptId);
  url.searchParams.set("offset", offset);
  url.searchParams.set("limit", limit);
  return fetch(url.toString(), {
    method: "GET",
    headers: createHeaders(hostConfig.languages),
  }).then((response) => handleResponse<SynonymResponse>(response));
};

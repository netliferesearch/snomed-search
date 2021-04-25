import { SnowstormConfig } from "../config";
import { Language, LIMIT } from "../constants";
import { createHeaders, handleJsonResponse } from "../utils/api";

interface Description {
  term: string;
  type: string;
  lang: Language;
  descriptionId: string;
}

interface SynonymResponse {
  items: Description[];
}

export const fetchSynonyms = async (
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
  const response = await fetch(url.toString(), {
    method: "GET",
    headers: createHeaders(hostConfig.languages),
  });

  return handleJsonResponse<SynonymResponse>(response);
};

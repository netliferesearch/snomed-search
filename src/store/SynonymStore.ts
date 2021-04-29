import { SnowstormConfig } from "../config";
import { Language, Limit } from "../constants";
import { createHeaders, handleJsonResponse } from "../utils/api";
import { Branch, Concept } from ".";

export interface Synonym {
  term: string;
  type: string;
  lang: Language;
  descriptionId: string;
  active: boolean;
}

interface SynonymResponse {
  items: Synonym[];
}

export const fetchSynonyms = async (
  hostConfig: SnowstormConfig,
  branch: Branch["path"],
  conceptId: Concept["conceptId"],
  offset = "0",
  limit = Limit.Default
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

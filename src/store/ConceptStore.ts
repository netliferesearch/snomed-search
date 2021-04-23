import { SnowstormConfig } from "../config";
import { LIMIT } from "../constants";
import { createHeaders, handleResponse } from "../utils/api";

interface Term {
  term: string;
}

interface Concept {
  conceptId: string;
  fsn: Readonly<Term>;
  pt: Readonly<Term>;
}

interface Description {
  concept: Readonly<Concept>;
}

export interface ConceptResponse {
  totalElements: number;
  items: Description[];
}

export const fetchConcepts = async (
  hostConfig: SnowstormConfig,
  branch: string,
  query: string,
  referenceSet = "",
  offset = "0",
  limit = LIMIT
): Promise<ConceptResponse> => {
  const url = new URL(`browser/${branch}/descriptions`, hostConfig.hostname);
  url.searchParams.set("offset", offset);
  url.searchParams.set("limit", limit);
  url.searchParams.set("active", "true");
  url.searchParams.set("groupByConcept", "true");
  if (hostConfig.languages) {
    url.searchParams.set("language", hostConfig.languages[0]);
    hostConfig.languages
      .slice(1)
      .forEach((language) => url.searchParams.append("language", language));
  }
  url.searchParams.set("conceptActive", "true");
  url.searchParams.set("conceptRefset", referenceSet);
  url.searchParams.set("term", query);
  const response = await fetch(url.toString(), {
    method: "GET",
    headers: createHeaders(hostConfig.languages),
  });

  return await handleResponse<ConceptResponse>(response);
};

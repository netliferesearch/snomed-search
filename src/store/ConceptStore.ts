import { SnowstormConfig } from "../config";
import { Limit } from "../constants";
import { createHeaders, handleJsonResponse } from "../utils/api";
import { Branch, fetchRefsetMembers, RefsetConceptResponse } from ".";

export interface Term {
  term: string;
}

export interface Concept {
  conceptId: string;
  fsn: Term;
  pt: Term;
}

export interface Description {
  concept: Concept;
}

export interface ConceptResponse {
  totalElements: number;
  items: Description[];
}

const fetchConcepts = async (
  hostConfig: SnowstormConfig,
  branch: Branch["path"],
  query: string,
  refsetId = "",
  offset = "0",
  limit = Limit.Default
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
  url.searchParams.set("conceptRefset", refsetId);
  url.searchParams.set("term", query);
  const response = await fetch(url.toString(), {
    method: "GET",
    headers: createHeaders(hostConfig.languages),
  });

  return handleJsonResponse<ConceptResponse>(response);
};

export type SearchResult = [
  conceptResponse: ConceptResponse,
  suggestionResponse: ConceptResponse,
  refsetConceptResponse: RefsetConceptResponse
];

export const searchConcepts = async (
  hostConfig: SnowstormConfig,
  branch: string,
  query = "",
  refsetId = "",
  offset = "0",
  limit = Limit.Default
): Promise<SearchResult> =>
  Promise.all([
    query
      ? fetchConcepts(hostConfig, branch, query, refsetId, offset, limit)
      : ({} as ConceptResponse),
    query
      ? fetchConcepts(hostConfig, branch, query, undefined, offset, limit)
      : ({} as ConceptResponse),
    refsetId
      ? fetchRefsetMembers(
          hostConfig,
          branch,
          undefined,
          refsetId,
          offset,
          Limit.High
        )
      : ({} as RefsetConceptResponse),
  ]);

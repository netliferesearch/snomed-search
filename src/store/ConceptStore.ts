import { apiOptions, snowstormUrl, handleResponse } from "../api";
import { limit } from "../config";

interface ITerm {
  term: string;
}

interface IConcept {
  conceptId: string;
  fsn: Readonly<ITerm>;
  pt: Readonly<ITerm>;
}

interface IDescription {
  concept: Readonly<IConcept>;
}

export interface IConceptResult {
  totalElements: number;
  items: Array<Readonly<IDescription>>;
}

export const fetchConcepts = (
  query: string,
  branch: string,
  referenceSet: string,
) => {
  const url = new URL(`browser/${branch}/descriptions`, snowstormUrl);
  url.searchParams.set("limit", limit);
  url.searchParams.set("active", "true");
  url.searchParams.set("groupByConcept", "true");
  url.searchParams.set("language", "no");
  url.searchParams.append("language", "nb");
  url.searchParams.append("language", "nn");
  url.searchParams.append("language", "en");
  url.searchParams.set("conceptActive", "true");
  url.searchParams.set("conceptRefset", referenceSet);
  url.searchParams.set("term", query);
  return fetch(url.toString(), apiOptions).then((response) =>
    handleResponse<Readonly<IConceptResult>>(response),
  );
};

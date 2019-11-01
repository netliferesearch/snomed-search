import { createContext } from "react";
import {
  apiOptions,
  clinicalTrialsUrl,
  episerverUrl,
  handleResponse,
  snowstormUrl,
} from "./api";
import { limit, referenceSets } from "./config";

interface IFields {
  mapAdvice: string;
  mapTarget: string;
}

interface IConcept {
  internalId: string;
  refsetId: string;
  additionalFields: Readonly<IFields>;
}

interface IConceptResult {
  items: Array<Readonly<IConcept>>;
}

export const fetchConcepts = (branch: string, conceptId: string) => {
  const url = new URL(`browser/${branch}/members`, snowstormUrl);
  url.searchParams.set("limit", limit);
  url.searchParams.set("active", "true");
  url.searchParams.set(
    "referenceSet",
    referenceSets.map(({ id }) => id).join(" OR "),
  );
  url.searchParams.set("referencedComponentId", conceptId);
  return fetch(url.toString(), apiOptions).then((response) =>
    handleResponse<Readonly<IConceptResult>>(response),
  );
};

interface ITrial {
  id: string;
  title: string;
  summary: string;
  status: string;
  link: string;
  conductedBy: string;
}

export const fetchTrials = (conceptId: string) => {
  const url = new URL(conceptId, clinicalTrialsUrl);
  return fetch(url.toString()).then((response) =>
    handleResponse<Array<Readonly<ITrial>>>(response),
  );
};

interface IHelsenorgePage {
  title: string;
  description: string;
  link: string;
}

export const fetchPages = (conceptId: string) => {
  const url = new URL(episerverUrl);
  url.searchParams.set("id", conceptId);
  return fetch(url.toString(), apiOptions).then((response) =>
    handleResponse<Array<Readonly<IHelsenorgePage>>>(response),
  );
};

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
  const url = new URL(`/${branch}/descriptions`, snowstormUrl);
  url.searchParams.set("concept", conceptId);
  url.searchParams.set("offset", "0");
  url.searchParams.set("limit", limit);
  return fetch(url.toString(), apiOptions).then((response) =>
    handleResponse<Readonly<ISynonymResult>>(response),
  );
};

export interface IBranch {
  path: string;
}

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

export interface ISearchResult {
  totalElements: number;
  items: Array<Readonly<IDescription>>;
}

export const fetchBranches = () => {
  const url = new URL(`branches`, snowstormUrl);
  return fetch(url.toString(), apiOptions)
    .then((response) => handleResponse<Array<Readonly<IBranch>>>(response))
    .then((branches: Array<Readonly<IBranch>>) => branches);
};

export const searchDescriptions = (
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
    handleResponse<Readonly<ISearchResult>>(response),
  );
};

export const BranchContext = createContext("");

import { apiOptions, baseURL, handleResponse } from "../api";
import { codeSystems, limit } from "../config";

interface IFields {
  mapAdvice: string;
  mapTarget: string;
}

interface ICodeSystem {
  internalId: string;
  refsetId: string;
  additionalFields: Readonly<IFields>;
}

interface ICodeSystemResult {
  items: Array<Readonly<ICodeSystem>>;
}

export const fetchCodeSystems = (branch: string, conceptId: string) => {
  const url = new URL(`browser/${branch}/members`, baseURL);
  url.searchParams.set("limit", limit);
  url.searchParams.set("active", "");
  url.searchParams.set(
    "referenceSet",
    codeSystems.map(({ id }) => id).join(" OR "),
  );
  url.searchParams.set("referencedComponentId", conceptId);
  return fetch(url.toString(), apiOptions).then((response) =>
    handleResponse<Readonly<ICodeSystemResult>>(response),
  );
};

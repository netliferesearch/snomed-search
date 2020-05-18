import { apiOptions, handleResponse } from "../api";
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
  items: ICodeSystem[];
}

export const fetchCodeSystems = (host: string, conceptId: string) =>
  Promise.all(
    codeSystems.map(({ id, branch }) => {
      const url = new URL(`browser/${branch}/members`, host);
      url.searchParams.set("limit", limit);
      url.searchParams.set("active", "true");
      url.searchParams.set("referenceSet", id);
      url.searchParams.set("referencedComponentId", conceptId);
      return fetch(url.toString(), apiOptions).then((response) =>
        handleResponse<ICodeSystemResult>(response),
      );
    }),
  );

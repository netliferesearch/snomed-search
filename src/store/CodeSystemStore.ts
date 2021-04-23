import { SnowstormConfig } from "../config";
import { createHeaders, handleResponse } from "../utils/api";

interface Fields {
  mapAdvice: string;
  mapTarget: string;
}

interface CodeSystem {
  internalId: string;
  refsetId: string;
  additionalFields: Readonly<Fields>;
}

interface CodeSystemResponse {
  items: CodeSystem[];
}

export const fetchCodeSystems = (
  hostConfig: SnowstormConfig,
  conceptId: string,
  limit = "10"
): Promise<CodeSystemResponse[]> => {
  if (hostConfig.codeSystems) {
    return Promise.all(
      hostConfig.codeSystems.map(async ({ id, branch }) => {
        const url = new URL(`browser/${branch}/members`, hostConfig.hostname);
        url.searchParams.set("limit", limit);
        url.searchParams.set("active", "true");
        url.searchParams.set("referenceSet", id);
        url.searchParams.set("referencedComponentId", conceptId);
        const response = await fetch(url.toString(), {
          method: "GET",
          headers: createHeaders(hostConfig.languages),
        });

        return await handleResponse<CodeSystemResponse>(response);
      })
    );
  }

  return Promise.reject("Host configuration must include codesystems");
};

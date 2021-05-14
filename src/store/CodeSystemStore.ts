import { SnowstormConfig } from '../config';
import { Limit } from '../constants';
import { createHeaders, handleJsonResponse } from '../utils/api';
import { Concept } from '.';

interface Fields {
  mapAdvice: string;
  mapTarget: string;
}

interface CodeSystem {
  internalId: string;
  refsetId: string;
  additionalFields: Fields;
}

interface CodeSystemResponse {
  items: CodeSystem[];
}

export const fetchCodeSystems = (
  hostConfig: SnowstormConfig,
  conceptId: Concept['conceptId'],
  limit = Limit.Default
): Promise<CodeSystemResponse[]> => {
  if (!hostConfig.codeSystems) {
    throw new Error('Host configuration must include codesystems');
  }
  return Promise.all(
    hostConfig.codeSystems.map(async ({ id, branch }) => {
      const url = new URL(`browser/${branch}/members`, hostConfig.hostname);
      url.searchParams.set('limit', limit);
      url.searchParams.set('active', 'true');
      url.searchParams.set('referenceSet', id);
      url.searchParams.set('referencedComponentId', conceptId);
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: createHeaders(hostConfig.languages),
      });

      return handleJsonResponse<CodeSystemResponse>(response);
    })
  );
};

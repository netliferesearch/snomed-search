import { ReferenceSet, SnowstormConfig } from '../config';
import { Limit } from '../constants';
import { createHeaders, handleJsonResponse, handleTextResponse } from '../utils/api';
import { Branch, Concept } from '.';

export class RefsetContainsConceptError extends Error {
  constructor(...params: string[]) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params);
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RefsetContainsConceptError);
    }
    this.name = 'RefsetContainsConceptError';
  }
}

interface AddResponse {}

export const addRefsetMember = async (
  hostConfig: SnowstormConfig,
  branch: Branch['path'],
  conceptId: Concept['conceptId'],
  refsetId: ReferenceSet['id']
): Promise<AddResponse> => {
  const refsetMembers = await fetchRefsetMembers(hostConfig, branch, conceptId, refsetId);
  if (refsetMembers.total > 0) {
    throw new RefsetContainsConceptError();
  }

  const url = new URL(`${branch}/members`, hostConfig.hostname);

  const data = {
    active: true,
    moduleId: hostConfig.moduleId,
    referencedComponentId: conceptId,
    refsetId: refsetId,
  };

  const response = await fetch(url.toString(), {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(data),
    headers: createHeaders(hostConfig.languages),
  });

  return handleJsonResponse<AddResponse>(response);
};

export interface ConceptMember {
  memberId: string;
  referencedComponent: Concept;
}

export interface UnknownMember {
  memberId: string;
  referencedComponent?: unknown;
}

export interface RefsetMemberResponse {
  total: number;
  items: (ConceptMember | UnknownMember)[];
}

export interface RefsetConceptResponse {
  total: number;
  items: ConceptMember[];
}

const memberIsConcept = (item: unknown): item is ConceptMember => (item as ConceptMember).referencedComponent?.fsn !== undefined;

export const fetchRefsetMembers = async (
  hostConfig: SnowstormConfig,
  branch: string,
  conceptId?: string,
  refsetId?: string,
  offset = '0',
  limit = Limit.Default
): Promise<RefsetConceptResponse> => {
  const url = new URL(`${branch}/members`, hostConfig.hostname);
  conceptId && url.searchParams.set('referencedComponentId', conceptId);
  refsetId && url.searchParams.set('referenceSet', refsetId);
  url.searchParams.set('offset', offset);
  url.searchParams.set('limit', limit);

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: createHeaders(hostConfig.languages),
  });

  const members = await handleJsonResponse<RefsetMemberResponse>(response);

  const concepts = members.items.filter<ConceptMember>(memberIsConcept);

  return { total: members.total, items: concepts };
};

export const removeRefsetMember = async (hostConfig: SnowstormConfig, branch: string, uuid: string): Promise<string> => {
  const url = new URL(`${branch}/members/${uuid}`, hostConfig.hostname);

  const response = await fetch(url.toString(), {
    method: 'DELETE',
    credentials: 'include',
    headers: createHeaders(hostConfig.languages),
  });

  return handleTextResponse(response);
};

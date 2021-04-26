import { SnowstormConfig } from "../config";
import {
  createHeaders,
  handleJsonResponse,
  handleTextResponse,
} from "../utils/api";

export class RefsetContainsConceptError extends Error {
  constructor(...params: string[]) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params);
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RefsetContainsConceptError);
    }
    this.name = "RefsetContainsConceptError";
  }
}

interface AddResponse {}

export const addRefsetMember = async (
  hostConfig: SnowstormConfig,
  branch: string,
  conceptId: string,
  refsetId: string
): Promise<AddResponse> => {
  const refsetMembers = await getRefsetMembers(
    hostConfig,
    branch,
    conceptId,
    refsetId
  );
  if (refsetMembers.total > 0) {
    throw new RefsetContainsConceptError();
  }

  const url = new URL(`${branch}/members`, hostConfig.hostname);

  const data = {
    active: true,
    referencedComponentId: conceptId,
    refsetId: refsetId,
  };

  const response = await fetch(url.toString(), {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(data),
    headers: createHeaders(hostConfig.languages),
  });

  return handleJsonResponse<AddResponse>(response);
};

export interface Member {
  memberId: string;
}

export interface RefsetMemberResponse {
  total: number;
  items: Member[];
}

export const getRefsetMembers = async (
  hostConfig: SnowstormConfig,
  branch: string,
  conceptId: string,
  refsetId: string
): Promise<RefsetMemberResponse> => {
  const url = new URL(`${branch}/members`, hostConfig.hostname);
  url.searchParams.set("referencedComponentId", conceptId);
  url.searchParams.set("referenceSet", refsetId);

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: createHeaders(hostConfig.languages),
  });

  return handleJsonResponse<RefsetMemberResponse>(response);
};

export const removeRefsetMember = async (
  hostConfig: SnowstormConfig,
  branch: string,
  uuid: string
): Promise<string> => {
  const url = new URL(`${branch}/members/${uuid}`, hostConfig.hostname);

  const response = await fetch(url.toString(), {
    method: "DELETE",
    credentials: "include",
    headers: createHeaders(hostConfig.languages),
  });

  return handleTextResponse(response);
};

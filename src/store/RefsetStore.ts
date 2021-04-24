import { SnowstormConfig } from "../config";
import {
  createHeaders,
  handleJsonResponse,
  handleTextResponse,
} from "../utils/api";

interface AddResponse {}

export const addRefsetMember = async (
  hostConfig: SnowstormConfig,
  branch: string,
  conceptId: string,
  refsetId: string
): Promise<AddResponse> => {
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

  return await handleJsonResponse<AddResponse>(response);
};

export interface Member {
  memberId: string;
}

export interface RefsetMemberResponse {
  totalElements: number;
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

  return await handleJsonResponse<RefsetMemberResponse>(response);
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

  return await handleTextResponse(response);
};

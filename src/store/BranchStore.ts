import { SnowstormConfig } from "../config";
import { createHeaders, handleJsonResponse } from "../utils/api";

export interface Branch {
  path: string;
  containsContent: boolean;
}

type BranchResponse = Branch[];

export const fetchBranches = async (
  hostConfig: SnowstormConfig
): Promise<Branch[]> => {
  const url = new URL("branches", hostConfig.hostname);
  const response = await fetch(url.toString(), {
    method: "GET",
    headers: createHeaders(hostConfig.languages),
  });
  const branchList = await handleJsonResponse<BranchResponse>(response);

  return branchList.filter(({ containsContent }) => containsContent);
};

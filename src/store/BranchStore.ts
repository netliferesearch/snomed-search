import { SnowstormConfig } from "../config";
import { createHeaders, handleResponse } from "../utils/api";

export interface Branch {
  path: string;
  containsContent: boolean;
}

type BranchResponse = Branch[];

export const fetchBranches = (
  hostConfig: SnowstormConfig
): Promise<Branch[]> => {
  const url = new URL(`branches`, hostConfig.hostname);
  return fetch(url.toString(), {
    method: "GET",
    headers: createHeaders(hostConfig.languages),
  })
    .then((response) => handleResponse<BranchResponse>(response))
    .then((branchList: BranchResponse) =>
      branchList.filter(({ containsContent }) => containsContent)
    );
};

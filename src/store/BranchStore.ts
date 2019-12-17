import { apiOptions, handleResponse } from "../api";
import { snowstormUrl } from "../config";

export interface IBranch {
  path: string;
  containsContent: boolean;
}

type Branches = IBranch[];

export const fetchBranches = () => {
  const url = new URL(`branches`, snowstormUrl);
  return fetch(url.toString(), apiOptions)
    .then((response) => handleResponse<Branches>(response))
    .then((branches: Branches) =>
      branches.filter(({ containsContent }) => containsContent),
    );
};

import { apiOptions, handleResponse } from "../api";

export interface IBranch {
  path: string;
  containsContent: boolean;
}

type Branches = IBranch[];

export const fetchBranches = (host: string) => {
  const url = new URL(`branches`, host);
  return fetch(url.toString(), apiOptions)
    .then((response) => handleResponse<Branches>(response))
    .then((branches: Branches) =>
      branches.filter(({ containsContent }) => containsContent),
    );
};

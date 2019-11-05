import { apiOptions, baseURL, handleResponse } from "../api";

export interface IBranch {
  path: string;
  containsContent: boolean;
}

type Branches = Array<Readonly<IBranch>>;

export const fetchBranches = () => {
  const url = new URL(`branches`, baseURL);
  return fetch(url.toString(), apiOptions)
    .then((response) => handleResponse<Branches>(response))
    .then((branches: Branches) =>
      branches.filter(({ containsContent }) => containsContent),
    );
};

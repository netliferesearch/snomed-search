import { apiOptions, handleResponse } from "../api";

interface IHelsenorgePage {
  title: string;
  description: string;
  link: string;
}

type Pages = IHelsenorgePage[];

export const fetchPages = (conceptId: string) => {
  const url = new URL("http://localhost:51338/sokeside/snomed");
  url.searchParams.set("id", conceptId);
  return fetch(url.toString(), apiOptions).then((response) =>
    handleResponse<Pages>(response),
  );
};

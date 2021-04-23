import { ACCEPT_LANGUAGE_SEPARATOR, DEFAULT_LANGUAGE } from "../constants";

const headers: Record<string, string> = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

export const createHeaders = (
  languageList = [DEFAULT_LANGUAGE]
): HeadersInit => {
  return {
    ...headers,
    "Accept-Language": languageList.join(ACCEPT_LANGUAGE_SEPARATOR),
  };
};

export const handleResponse = <T>(response: Response): Promise<T> =>
  response.ok
    ? (response.json() as Promise<T>)
    : Promise.reject(new Error("Failed to load data from server"));

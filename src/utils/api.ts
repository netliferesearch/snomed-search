import { ACCEPT_LANGUAGE_SEPARATOR, DEFAULT_LANGUAGE, QUALITY_SEPARATOR } from '../constants';

const headers: Record<string, string> = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

export const createHeaders = (languageList = [DEFAULT_LANGUAGE]): HeadersInit => {
  const initial = 0.9;
  const step = 0.1;
  return {
    ...headers,
    'Accept-Language': languageList.map((lang, i) => `${lang}${QUALITY_SEPARATOR}${initial - step * i}`).join(ACCEPT_LANGUAGE_SEPARATOR),
  };
};

export const handleJsonResponse = <T>(response: Response): Promise<T> =>
  response.ok ? (response.json() as Promise<T>) : Promise.reject(new Error('Failed to load data from server'));

export const handleTextResponse = (response: Response): Promise<string> =>
  response.ok ? response.text() : Promise.reject(new Error('Failed to load data from server'));

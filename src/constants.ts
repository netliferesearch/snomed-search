import { StringParam, withDefault } from "use-query-params";

export enum Language {
  Bokmål = "nb",
  Nynorsk = "nn",
  Norsk = "no",
  English = "en",
}

export enum Limit {
  Default = "10",
  High = "1000",
}

export const ACCEPT_LANGUAGE_SEPARATOR = ";";

export const DEFAULT_LANGUAGE = Language.English;

export const SNOWSTORM_SYNONYM_TYPE = "SYNONYM";

export const DEBOUNCE_WAIT_MS = 500;

export const QUERY_PARAMS_CONFIG = {
  q: withDefault(StringParam, ""),
  h: withDefault(StringParam, ""),
  b: withDefault(StringParam, ""),
  rs: withDefault(StringParam, ""),
};

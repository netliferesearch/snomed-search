import { StringParam, withDefault } from "use-query-params";

import { Language } from "./config";

export const LIMIT = "10";

export const ACCEPT_LANGUAGE_SEPARATOR = ";";

export const DEFAULT_LANGUAGE = Language.EnglishUs;

export const SNOWSTORM_SYNONYM_TYPE = "SYNONYM";

export const DEBOUNCE_WAIT_MS = 500;

export const QUERY_PARAMS_CONFIG = {
  q: withDefault(StringParam, ""),
  h: withDefault(StringParam, ""),
  b: withDefault(StringParam, ""),
  rs: withDefault(StringParam, ""),
};

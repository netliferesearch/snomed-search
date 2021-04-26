import debounce from "awesome-debounce-promise";
import { useAsync } from "react-async-hook";
import useConstant from "use-constant";
import { useQueryParams } from "use-query-params";

import { SnomedSearchConfig } from "../config";
import { DEBOUNCE_WAIT_MS, QUERY_PARAMS_CONFIG } from "../constants";
import { ConceptResponse, searchConcepts } from "../store";

const useSearch = (config: SnomedSearchConfig) => {
  // Handle the input text state
  const [queryParams, setQueryParams] = useQueryParams(QUERY_PARAMS_CONFIG);
  const { q: query, h: hostname, b: branch, rs: refsetId } = queryParams;

  const hostConfig =
    config.hosts.find((h) => h.hostname === hostname) || config.hosts[0];

  // Debounce the original search async function
  const debouncedSearch = useConstant(() =>
    debounce(searchConcepts, DEBOUNCE_WAIT_MS)
  );

  const searchRequest = useAsync(async () => {
    if (hostname && branch && query) {
      return debouncedSearch(hostConfig, branch, query, refsetId);
    }
    return ([{}, {}] as unknown) as ConceptResponse[];
  }, [query, branch, refsetId]); // Ensure a new request is made everytime the text changes (even if it's debounced)

  // Return everything needed for the hook consumer
  return {
    hostname,
    branch,
    query,
    refsetId,
    searchRequest,
    setQueryParams,
    hostConfig,
  };
};

export default useSearch;

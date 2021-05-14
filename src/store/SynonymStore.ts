import { SnowstormConfig } from '../config';
import { Language, Limit, SNOWSTORM_SYNONYM_TYPE } from '../constants';
import { createHeaders, handleJsonResponse } from '../utils/api';
import { Branch, Concept } from '.';

export interface Synonym {
  term: string;
  type: string;
  lang: Language;
  descriptionId: string;
  active: boolean;
}

interface SynonymResponse {
  items: Synonym[];
}

export const fetchSynonyms = async (
  hostConfig: SnowstormConfig,
  branch: Branch['path'],
  conceptId: Concept['conceptId'],
  offset = '0',
  limit = Limit.Default
): Promise<Synonym[]> => {
  const url = new URL(`${branch}/descriptions`, hostConfig.hostname);
  url.searchParams.set('concept', conceptId);
  url.searchParams.set('offset', offset);
  url.searchParams.set('limit', limit);
  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: createHeaders(hostConfig.languages),
  });

  const synonymResponse = await handleJsonResponse<SynonymResponse>(response);

  const onlySynonyms = (synonym: Synonym) => synonym.type === SNOWSTORM_SYNONYM_TYPE;

  const onlyLanguages = (synonym: Synonym) => !hostConfig.languages || hostConfig.languages.includes(synonym.lang);

  const excludeInactive = (synonym: Synonym) => synonym.active;

  return synonymResponse.items.filter(excludeInactive).filter(onlySynonyms).filter(onlyLanguages);
};

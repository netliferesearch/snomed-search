import { SnowstormConfig } from '../../config';
import { Language } from '../../constants';

export const hostConfig: SnowstormConfig = {
  hostname: 'https://snowstorm.rundberg.no',
  defaultBranch: 'MAIN',
  codeSystems: [
    {
      branch: 'MAIN/ICPC2',
      id: '450993002',
      title: 'ICPC-2',
    },
  ],
  referenceSets: [
    {
      id: '1991000202102',
      title: 'Sykdommer',
    },
  ],
  languages: [Language.Bokmål, Language.Nynorsk, Language.Norsk],
};

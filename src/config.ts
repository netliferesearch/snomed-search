export enum Language {
  Bokmål = "nb",
  Nynorsk = "nn",
  Norsk = "no",
  EnglishUs = "en-US",
  EnglishGb = "en-GB",
}
export interface ReferenceSet {
  id: string;
  title: string;
}
export interface CodeSystem {
  branch: string;
  id: string;
  title: string;
}

export interface SnowstormConfig {
  hostname: string;
  defaultBranch?: string;
  codeSystems?: CodeSystem[];
  referenceSets?: ReferenceSet[];
  languages?: Language[];
}

export interface SnomedSearchConfig {
  hosts: SnowstormConfig[];
}

const config: SnomedSearchConfig = {
  hosts: [
    {
      hostname: "https://snowstorm.rundberg.no",
      defaultBranch: "MAIN",
      codeSystems: [
        {
          branch: "MAIN",
          id: "447562003",
          title: "ICD-10",
        },
        {
          branch: "MAIN/ICPC2",
          id: "450993002",
          title: "ICPC-2",
        },
        {
          branch: "MAIN/MAP",
          id: "2041000202101",
          title: "ATC",
        },
      ],
      referenceSets: [
        {
          id: "",
          title: "[Not specified]",
        },
        {
          id: "1981000202104",
          title: "Målgruppe",
        },
        {
          id: "1991000202102",
          title: "Sykdommer",
        },
        {
          id: "1971000202101",
          title: "Behandlinger",
        },
        {
          id: "2001000202104",
          title: "Symptomer/plager",
        },
        {
          id: "1271000202107",
          title: "Råd for god helse",
        },
        {
          id: "1291000202106",
          title: "Infeksjonssykdommer følsomme for antibiotika",
        },
        {
          id: "1311000202107",
          title: "Virkestoff med antibakteriell eller antimykotisk effekt",
        },
      ],
      languages: [Language.Bokmål, Language.Nynorsk, Language.Norsk],
    },
    { hostname: "https://snowstorm.test.nhn.no" },
  ],
};

export default config;

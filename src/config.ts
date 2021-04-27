import { Language } from "./constants";
import { Branch } from "./store";

interface CodeSystem {
  branch: Branch["path"];
  id: string;
  title: string;
}

export interface ReferenceSet {
  id: string;
  title: string;
}

export interface SnowstormConfig {
  hostname: string;
  defaultBranch?: CodeSystem["branch"];
  moduleId?: string;
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
      moduleId: "51000202101",
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
        {
          id: "1301000202105",
          title: "Refset test",
        },
      ],
      languages: [
        Language.Bokmål,
        Language.Nynorsk,
        Language.Norsk,
        Language.English,
      ],
    },
    {
      hostname: "https://snowstorm.conteir.no",
      defaultBranch: "MAIN",
      moduleId: "51000202101",
      referenceSets: [
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
        {
          id: "1301000202105",
          title: "Refset test",
        },
      ],
      languages: [
        Language.Bokmål,
        Language.Nynorsk,
        Language.Norsk,
        Language.English,
      ],
    },
  ],
};

export default config;

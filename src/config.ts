export const snowstormUrl = "https://snowstorm.rundberg.no";

export const clinicalTrialsUrl =
  "https://functions-hnf2-1-02.int-hn.nhn.no/api/v1/kliniskestudier";

export const episerverUrl = "http://localhost:51338/sokeside/snomed";

export const defaultBranch = "MAIN/SNOMEDCT-NO-EXTENDED";

export const codeSystemBranch = "MAIN/ICPC2";

export const codeSystems = [
  {
    id: "450993002",
    title: "ICPC-2",
  },
  {
    id: "447562003",
    title: "ICD-10",
  },
];

export const referenceSets = [
  {
    id: "",
    title: "[Not specified]",
  },
  {
    id: "1031000202104",
    title: "Målgruppe",
  },
  {
    id: "1091000202103",
    title: "Sykdommer",
  },
  {
    id: "1291000202106",
    title: "Infeksjonssykdommer følsomme for antibiotika",
  },
  {
    id: "1311000202107",
    title: "Virkestoff med antibakteriell eller antimykotisk effekt",
  },
];

export const limit = "10";

export const languages = ["nb", "nn", "no"];

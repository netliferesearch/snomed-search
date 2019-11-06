import { handleResponse } from "../api";

interface ITrial {
  id: string;
  title: string;
  summary: string;
  status: string;
  link: string;
  conductedBy: string;
}

type Trials = Array<Readonly<ITrial>>;

export const fetchClinicalTrials = (conceptId: string) => {
  const url = new URL(
    conceptId,
    "https://functions-hnf2-1-02.int-hn.nhn.no/api/clinicaltrials/search/",
  );
  return fetch(url.toString()).then((response) =>
    handleResponse<Trials>(response),
  );
};

import { handleResponse } from "../api";
import { clinicalTrialsUrl } from "../config";

interface ITrial {
  id: string;
  tittel: string;
  sammendrag: string;
  status: string;
  lenke: string;
  utfort_av: string;
}

type Trials = ITrial[];

export const fetchClinicalTrials = (conceptId: string) => {
  const url = new URL(clinicalTrialsUrl);
  url.searchParams.append("sctid", conceptId);
  return fetch(url.toString()).then((response) =>
    handleResponse<Trials>(response),
  );
};

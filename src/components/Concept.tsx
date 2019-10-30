import React, { FunctionComponent } from "react";
import { useAsync } from "react-async-hook";
import { apiOptions, baseURL, handleResponse } from "../api";
import ClinicalTrial from "./ClinicalTrial";
import Helsenorge from "./Helsenorge";
import Loading from "./Loading";
import Synonym from "./Synonym";

const referenceSets = [
  {
    id: "450993002",
    title: "ICPC-2",
  },
  {
    id: "447562003",
    title: "ICD-10",
  },
];

interface IConceptProps {
  readonly branch: string;
  readonly preferredTerm: string;
  readonly fullySpecifiedName: string;
  readonly conceptId: string;
  readonly scope: string;
}

interface IFields {
  readonly mapAdvice: string;
  readonly mapTarget: string;
}

interface IConcept {
  readonly internalId: string;
  readonly refsetId: string;
  readonly additionalFields: IFields;
}

interface IResult {
  readonly items: IConcept[];
}

const fetchConcepts = (branch: string, conceptId: string) => {
  const url = new URL(`browser/${branch}/members`, baseURL);
  url.searchParams.set("limit", "10");
  url.searchParams.set("active", "true");
  url.searchParams.set(
    "referenceSet",
    referenceSets.map(({ id }) => id).join(" OR "),
  );
  url.searchParams.set("referencedComponentId", conceptId);
  return fetch(url.toString(), apiOptions).then((response) =>
    handleResponse<IResult>(response),
  );
};

const Concept: FunctionComponent<IConceptProps> = ({
  branch,
  preferredTerm,
  fullySpecifiedName,
  conceptId,
  scope,
}) => {
  const request = useAsync(fetchConcepts, [branch, conceptId]);

  const { items = [] } = request.result || {};

  return (
    <div className="d-md-flex justify-content-between">
      <div>
        <h2>{preferredTerm}</h2>
        <Synonym
          conceptId={conceptId}
          branch={branch}
          preferredTerm={preferredTerm}
        />
        <p className="mb-md-0">{fullySpecifiedName}</p>
        {scope === "trial" && <ClinicalTrial conceptId={conceptId} />}
        {scope === "helsenorge" && <Helsenorge conceptId={conceptId} />}
      </div>
      <dl className="mb-md-0 ml-md-5">
        <dt>Snomed CT</dt>
        <dd className="mb-md-0">{conceptId}</dd>
      </dl>
      {request.loading && <Loading />}
      {items.map(
        ({
          internalId,
          refsetId,
          additionalFields: { mapAdvice: advice, mapTarget: code },
        }) => {
          const { title } =
            referenceSets.find((set) => set.id === refsetId) || {};
          return (
            <dl key={internalId} className="mb-md-0 ml-md-5">
              <dt>{title}</dt>
              <dd className="mb-md-0" title={advice}>
                {code ? code : advice}
              </dd>
            </dl>
          );
        },
      )}
    </div>
  );
};

export default Concept;

import React, { FunctionComponent } from "react";
import { useAsync } from "react-async-hook";
import { apiOptions, baseURL, handleResponse } from "../api";
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
  branch: string;
  preferredTerm: string;
  fullySpecifiedName: string;
  id: string;
}

interface IFields {
  mapAdvice: string;
  mapTarget: string;
}

interface IConcept {
  internalId: string;
  refsetId: string;
  additionalFields: IFields;
}

interface IResult {
  items: IConcept[];
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
  id,
}) => {
  const request = useAsync(fetchConcepts, [branch, id]);

  const { items = [] } = request.result || {};

  return (
    <div className="d-md-flex justify-content-between align-items-center">
      <div>
        <h2>{preferredTerm}</h2>
        <Synonym id={id} branch={branch} preferredTerm={preferredTerm} />
        <p className="mb-md-0">{fullySpecifiedName}</p>
      </div>
      <dl className="mb-md-0">
        <dt>Snomed CT</dt>
        <dd className="mb-md-0">{id}</dd>
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
            <dl key={internalId} className="mb-md-0">
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

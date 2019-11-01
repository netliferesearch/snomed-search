import React, { FunctionComponent, useContext } from "react";
import { useAsync } from "react-async-hook";
import { codeSystems } from "../config";
import { BranchContext, fetchConcepts } from "../store";
import ClinicalTrial from "./ClinicalTrial";
import Helsenorge from "./Helsenorge";
import Loading from "./Loading";
import Synonym from "./Synonym";

type ConceptProps = {
  preferredTerm: string;
  fullySpecifiedName: string;
  conceptId: string;
  scope: string;
};

const Concept: FunctionComponent<ConceptProps> = ({
  preferredTerm,
  fullySpecifiedName,
  conceptId,
  scope,
}) => {
  const branch = useContext(BranchContext);
  const request = useAsync(fetchConcepts, [branch, conceptId]);

  const { items: concepts = [] } = request.result || {};

  return (
    <div className="d-md-flex justify-content-between">
      <div>
        <h2>{preferredTerm}</h2>
        <Synonym conceptId={conceptId} preferredTerm={preferredTerm} />
        <p className="mb-md-0">{fullySpecifiedName}</p>
        {scope === "trial" && <ClinicalTrial conceptId={conceptId} />}
        {scope === "helsenorge" && <Helsenorge conceptId={conceptId} />}
      </div>
      <dl className="mb-md-0 ml-md-5">
        <dt>Snomed CT</dt>
        <dd className="mb-md-0">{conceptId}</dd>
      </dl>
      {request.loading && <Loading />}
      {concepts.map(
        ({
          internalId,
          refsetId,
          additionalFields: { mapAdvice: advice, mapTarget: code },
        }) => {
          const { title } =
            codeSystems.find((set) => set.id === refsetId) || {};
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

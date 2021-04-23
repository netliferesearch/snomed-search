import React from "react";

import { SnowstormConfig } from "../config";
import CodeSystemList from "./CodeSystemList";
import SynonymList from "./SynonymList";

interface ConceptProps {
  hostConfig: SnowstormConfig;
  branch: string;
  preferredTerm: string;
  fullySpecifiedName: string;
  conceptId: string;
}

const Concept: React.FunctionComponent<ConceptProps> = ({
  hostConfig,
  branch,
  preferredTerm,
  fullySpecifiedName,
  conceptId,
}) => {
  return (
    <div className="d-md-flex justify-content-between">
      <div>
        <h2>{preferredTerm}</h2>
        <SynonymList
          hostConfig={hostConfig}
          branch={branch}
          conceptId={conceptId}
          preferredTerm={preferredTerm}
        />
        <p className="mb-md-0">{fullySpecifiedName}</p>
      </div>
      <dl className="mb-md-0 ml-md-5">
        <dt>Snomed CT</dt>
        <dd className="mb-md-0">{conceptId}</dd>
      </dl>
      {hostConfig.codeSystems && (
        <CodeSystemList hostConfig={hostConfig} conceptId={conceptId} />
      )}
    </div>
  );
};

export default Concept;

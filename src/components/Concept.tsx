import React from "react";
import { useTranslation } from "react-i18next";

import { SnowstormConfig } from "../config";
import { Concept as ConceptInterface } from "../store/ConceptStore";
import CodeSystemList from "./CodeSystemList";
import SynonymList from "./SynonymList";

interface ConceptProps {
  hostConfig: SnowstormConfig;
  branch: string;
  concept: ConceptInterface;
}

const Concept: React.FunctionComponent<ConceptProps> = ({
  hostConfig,
  branch,
  concept,
}) => {
  const { t } = useTranslation();

  return (
    <div className="d-md-flex justify-content-between">
      <div>
        <h2>{concept.pt.term}</h2>
        <SynonymList
          hostConfig={hostConfig}
          branch={branch}
          conceptId={concept.conceptId}
          preferredTerm={concept.pt.term}
        />
        <p className="mb-md-0">{concept.fsn.term}</p>
      </div>
      <dl className="mb-md-0 ml-md-5">
        <dt>{t("snomedct")}</dt>
        <dd className="mb-md-0">{concept.conceptId}</dd>
      </dl>
      {hostConfig.codeSystems && (
        <CodeSystemList hostConfig={hostConfig} conceptId={concept.conceptId} />
      )}
    </div>
  );
};

export default Concept;

import classNames from "classnames";
import React from "react";
import { useTranslation } from "react-i18next";

import { SnowstormConfig } from "../config";
import { Concept as ConceptInterface } from "../store/ConceptStore";
import CodeSystemList from "./CodeSystemList";
import styles from "./Definition.module.scss";
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
    <div className="row">
      <div className="col-lg-6">
        <h2 id={concept.conceptId}>{concept.pt.term}</h2>
        <SynonymList
          hostConfig={hostConfig}
          branch={branch}
          conceptId={concept.conceptId}
          preferredTerm={concept.pt.term}
        />
        <p>{concept.fsn.term}</p>
      </div>
      <div
        className={classNames(
          "col-12 col-sm-6 flex-lg-grow-1",
          styles.definition
        )}
      >
        <dl>
          <dt>{t("snomedct")}</dt>
          <dd>{concept.conceptId}</dd>
        </dl>
      </div>
      {hostConfig.codeSystems && (
        <CodeSystemList hostConfig={hostConfig} conceptId={concept.conceptId} />
      )}
    </div>
  );
};

export default Concept;

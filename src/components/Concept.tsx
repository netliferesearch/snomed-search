import classNames from "classnames";
import React from "react";
import { useTranslation } from "react-i18next";

import { SnowstormConfig } from "../config";
import { Branch } from "../store";
import { Concept as ConceptInterface } from "../store/ConceptStore";
import Button, { ButtonVariant } from "./Button";
import CodeSystemList from "./CodeSystemList";
import styles from "./Definition.module.scss";
import SynonymList from "./SynonymList";

interface ConceptProps {
  hostConfig: SnowstormConfig;
  branch: Branch["path"];
  concept: ConceptInterface;
  handleRefsetChange?: (conceptId: ConceptInterface["conceptId"]) => void;
  buttonText?: string;
  buttonVariant?: ButtonVariant;
}

const Concept: React.FunctionComponent<ConceptProps> = ({
  hostConfig,
  branch,
  concept,
  handleRefsetChange,
  buttonText,
  buttonVariant = ButtonVariant.Primary,
}) => {
  const { t } = useTranslation();

  return (
    <div className="row">
      <div className="col-lg-6">
        <h2
          id={`${concept.conceptId}-pt`}
          aria-describedby={`${concept.conceptId}-fsn`}
        >
          {concept.pt.term}
        </h2>
        <p id={`${concept.conceptId}-fsn`}>{concept.fsn.term}</p>
        <SynonymList
          hostConfig={hostConfig}
          branch={branch}
          conceptId={concept.conceptId}
          preferredTerm={concept.pt.term}
        />
      </div>

      <dl
        className={classNames(
          "col-12 col-sm-6 flex-lg-grow-1",
          styles.definition
        )}
      >
        <dt>{t("snomedct")}</dt>
        <dd>{concept.conceptId}</dd>
      </dl>
      {hostConfig.codeSystems && (
        <CodeSystemList hostConfig={hostConfig} conceptId={concept.conceptId} />
      )}
      {handleRefsetChange && buttonText && (
        <div className="col-12">
          <Button
            onClick={() => handleRefsetChange(concept.conceptId)}
            variant={buttonVariant}
          >
            {buttonText}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Concept;

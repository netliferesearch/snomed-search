import classNames from "classnames";
import React from "react";
import { useTranslation } from "react-i18next";

import { SnowstormConfig } from "../config";
import { Concept as ConceptInterface } from "../store/ConceptStore";
import CodeSystemList from "./CodeSystemList";
import styles from "./Definition.module.scss";
import SynonymList from "./SynonymList";

export enum ButtonVariant {
  Primary,
  Danger,
}

interface ConceptProps {
  hostConfig: SnowstormConfig;
  branch: string;
  concept: ConceptInterface;
  handle?: (conceptId: string) => void;
  buttonText?: string;
  buttonVariant?: ButtonVariant;
}

const Concept: React.FunctionComponent<ConceptProps> = ({
  hostConfig,
  branch,
  concept,
  handle,
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
      {handle && buttonText && (
        <div className="col-12">
          <button
            onClick={() => handle(concept.conceptId)}
            className={classNames("btn", {
              "btn-outline-primary": buttonVariant === ButtonVariant.Primary,
              "btn-outline-danger": buttonVariant === ButtonVariant.Danger,
            })}
          >
            {buttonText}
          </button>
        </div>
      )}
    </div>
  );
};

export default Concept;

import classNames from "classnames";
import React from "react";
import { useAsync } from "react-async-hook";
import { useTranslation } from "react-i18next";

import { SnowstormConfig } from "../config";
import { Concept, fetchCodeSystems } from "../store";
import styles from "./Definition.module.scss";
import Error from "./Error";
import Loading, { LoadingSize } from "./Loading";

interface CodeSystemProps {
  hostConfig: SnowstormConfig;
  conceptId: Concept["conceptId"];
}

const CodeSystemList: React.FunctionComponent<CodeSystemProps> = ({
  hostConfig,
  conceptId,
}) => {
  const { t } = useTranslation();
  const request = useAsync(fetchCodeSystems, [hostConfig, conceptId]);
  const codeSystemResultList = request.result || [];

  return (
    <>
      {request.loading && (
        <div className="col">
          <Loading size={LoadingSize.Medium} />
        </div>
      )}
      {request.error && <Error>{t("error.fetchCodeSystems")}</Error>}
      {codeSystemResultList.map((codeSystem) =>
        codeSystem.items.map(
          ({
            internalId,
            refsetId,
            additionalFields: { mapAdvice: advice, mapTarget: code },
          }) => {
            const { title = "" } =
              hostConfig.codeSystems?.find((set) => set.id === refsetId) ?? {};

            return (
              <dl
                className={classNames(
                  "col-12 col-sm-6 flex-lg-grow-1",
                  styles.definition
                )}
                key={internalId}
              >
                <dt>{title}</dt>
                <dd title={advice}>{code ? code : advice}</dd>
              </dl>
            );
          }
        )
      )}
    </>
  );
};

export default CodeSystemList;

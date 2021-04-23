import React from "react";
import { useAsync } from "react-async-hook";

import { SnowstormConfig } from "../config";
import { fetchCodeSystems } from "../store";
import Loading, { LoadingSize } from "./Loading";

interface CodeSystemProps {
  hostConfig: SnowstormConfig;
  conceptId: string;
}

const CodeSystemList: React.FunctionComponent<CodeSystemProps> = ({
  hostConfig,
  conceptId,
}) => {
  const request = useAsync(fetchCodeSystems, [hostConfig, conceptId]);
  const codeSystemResultList = request.result || [];

  return (
    <>
      {request.loading && <Loading size={LoadingSize.Medium} />}
      {codeSystemResultList.map((codeSystem) =>
        codeSystem.items.map(
          ({
            internalId,
            refsetId,
            additionalFields: { mapAdvice: advice, mapTarget: code },
          }) => {
            const { title } =
              hostConfig.codeSystems?.find((set) => set.id === refsetId) ?? {};
            if (!title) {
              throw new Error(`Missing title for codesystem "${refsetId}"`);
            }
            return (
              <dl key={internalId} className="mb-md-0 ml-md-5">
                <dt>{title}</dt>
                <dd className="mb-md-0" title={advice}>
                  {code ? code : advice}
                </dd>
              </dl>
            );
          }
        )
      )}
    </>
  );
};

export default CodeSystemList;

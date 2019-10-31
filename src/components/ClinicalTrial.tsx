import React, { FunctionComponent } from "react";
import { useAsync } from "react-async-hook";
import { fetchTrials } from "../store";

interface ITrialProps {
  conceptId: string;
}

const ClinicalTrial: FunctionComponent<Readonly<ITrialProps>> = ({
  conceptId,
}) => {
  const request = useAsync(fetchTrials, [conceptId]);

  const items = request.result || [];

  if (items.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="mt-3">Clinical trials</h3>
      {items.map(({ id, title, summary, link, conductedBy }) => (
        <div key={id}>
          <h4>
            <a href={link}>{title}</a>
          </h4>
          <p>{summary}</p>
          <dl>
            <dt>Ansvarlig</dt>
            <dd>{conductedBy}</dd>
          </dl>
        </div>
      ))}
    </div>
  );
};

export default ClinicalTrial;

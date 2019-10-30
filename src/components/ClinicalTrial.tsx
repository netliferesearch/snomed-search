import React, { FunctionComponent } from "react";
import { useAsync } from "react-async-hook";
import { handleResponse } from "../api";

interface ITrialProps {
  readonly conceptId: string;
}

interface ITrial {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly status: string;
  readonly link: string;
  readonly conductedBy: string;
}

const fetchTrials = (conceptId: string) => {
  const url = new URL(
    conceptId,
    "https://functions-hnf2-1-02.int-hn.nhn.no/api/clinicaltrials/search/",
  );
  return fetch(url.toString()).then((response) =>
    handleResponse<ITrial[]>(response),
  );
};

const ClinicalTrial: FunctionComponent<ITrialProps> = ({ conceptId }) => {
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

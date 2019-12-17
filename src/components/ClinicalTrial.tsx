import React from "react";
import { useAsync } from "react-async-hook";
import { fetchClinicalTrials } from "../store";

type ClinicalTrialProps = {
  conceptId: string;
};

const ClinicalTrial = ({ conceptId }: ClinicalTrialProps) => {
  const request = useAsync(fetchClinicalTrials, [conceptId]);

  const trials = request.result || [];

  if (trials.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="mt-3">Clinical trials</h3>
      {trials.map(
        ({
          id,
          tittel: title,
          sammendrag: summary,
          lenke: link,
          utfort_av: conductedBy,
        }) => (
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
        ),
      )}
    </div>
  );
};

export default ClinicalTrial;

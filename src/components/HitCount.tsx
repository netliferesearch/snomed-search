import React from 'react';
import { useTranslation } from 'react-i18next';

interface ErrorProps {
  hits?: number;
  total?: number;
}

const Error: React.FunctionComponent<ErrorProps> = ({ hits, total }) => {
  const { t } = useTranslation();

  if (!hits && hits !== 0) {
    return null;
  }
  return (
    <p aria-live="polite">
      {total
        ? t('results.totalHitsWithCount', {
            count: hits,
            total: total,
          })
        : t('results.hitsWithCount', {
            count: hits,
          })}
    </p>
  );
};

export default Error;

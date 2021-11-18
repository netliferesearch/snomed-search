import React from 'react';

interface ErrorProps {
  children: React.ReactNode;
}

const Error: React.FunctionComponent<ErrorProps> = ({ children }) => (
  <div className="alert alert-danger d-inline-block" role="alert">
    {children}
  </div>
);

export default Error;

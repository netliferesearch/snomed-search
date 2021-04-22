import React from "react";

type ErrorProps = {
  children: string;
};

const Error: React.FunctionComponent<ErrorProps> = ({ children }) => (
  <div className="alert alert-danger d-inline-block" role="alert">
    {children}
  </div>
);

export default Error;

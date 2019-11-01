import React, { FunctionComponent } from "react";

type ErrorProps = {
  message: string;
};

const Error: FunctionComponent<ErrorProps> = ({ message }) => (
  <div className="alert alert-danger d-inline-block" role="alert">
    {message}
  </div>
);

export default Error;

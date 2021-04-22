import "./Loading.css";

import React from "react";

const Loading: React.FunctionComponent = () => (
  <div className="spinner-border loading text-secondary" role="status">
    <span className="sr-only">Loading...</span>
  </div>
);

export default Loading;

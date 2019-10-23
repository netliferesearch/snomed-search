import React, { FunctionComponent } from "react";
import "./Loading.css";

const Loading: FunctionComponent = () => (
  <div className="spinner-border loading text-secondary" role="status">
    <span className="sr-only">Loading...</span>
  </div>
);

export default Loading;

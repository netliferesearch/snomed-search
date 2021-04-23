import classnames from "classnames";
import React from "react";

import styles from "./Loading.module.css";

const Loading: React.FunctionComponent = () => (
  <div
    className={classnames("spinner-border", styles.loading, "text-secondary")}
    role="status"
  >
    <span className="sr-only">Loading...</span>
  </div>
);

export default Loading;

import React, { FunctionComponent } from "react";
import { useLocation } from "react-router-dom";
import Search from "./Search";

export const useQueryParams = () => {
  return new URLSearchParams(useLocation().search);
};

const App: FunctionComponent = () => {
  const queryParams = useQueryParams();
  const scope = queryParams.get("scope") || "";
  return <Search scope={scope} />;
};

export default App;

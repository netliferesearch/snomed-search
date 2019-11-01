import React from "react";
import { useLocation } from "react-router-dom";
import Search from "./pages/Search";

export const useQueryParams = () => {
  return new URLSearchParams(useLocation().search);
};

const App = () => {
  const queryParams = useQueryParams();
  const scope = queryParams.get("scope") || "";
  return <Search scope={scope} />;
};

export default App;

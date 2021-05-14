import './i18n/config';

import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';

import Search from './pages/Search';

export const Wrapper: React.FunctionComponent = ({ children }) => (
  <Router>
    <QueryParamProvider ReactRouterRoute={Route}>{children}</QueryParamProvider>
  </Router>
);

const App: React.FunctionComponent = () => {
  return <Search />;
};

export default App;

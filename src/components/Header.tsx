import React from "react";
import { Link } from "react-router-dom";

const Header: React.FunctionComponent = () => {
  return (
    <header className="row">
      <div className="col">
        <nav className="navbar navbar-expand mb-3">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                All
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;

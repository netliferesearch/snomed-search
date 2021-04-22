import React from "react";
import { Link } from "react-router-dom";

type HeaderProps = {
  scope: string;
};

const Header: React.FunctionComponent<HeaderProps> = ({ scope }) => {
  const itemClassNames = (link: string) => {
    if (link === scope) {
      return "nav-item active";
    }
    return "nav-item";
  };
  return (
    <header className="row">
      <div className="col">
        <nav className="navbar navbar-expand mb-3">
          <ul className="navbar-nav mr-auto">
            <li className={itemClassNames("")}>
              <Link className="nav-link" to="/">
                All
              </Link>
            </li>
            <li className={itemClassNames("trial")}>
              <Link className="nav-link" to="/?scope=trial">
                Clinical Trials
              </Link>
            </li>
            {false && (
              <li className={itemClassNames("helsenorge")}>
                <Link className="nav-link" to="/?scope=helsenorge">
                  Helsenorge
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;

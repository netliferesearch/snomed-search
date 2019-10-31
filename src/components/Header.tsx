import React, { FunctionComponent } from "react";
import { Link } from "react-router-dom";

interface IHeaderProps {
  scope: string;
}

const Header: FunctionComponent<IHeaderProps> = ({ scope }) => {
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
            <li className={itemClassNames("disorder")}>
              <Link className="nav-link" to="/?scope=disorder">
                Disorder
              </Link>
            </li>
            <li className={itemClassNames("audience")}>
              <Link className="nav-link" to="/?scope=audience">
                Audience
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

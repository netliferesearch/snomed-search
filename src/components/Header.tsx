import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Header: React.FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <header className="row">
      <div className="col">
        <nav className="navbar navbar-expand mb-3">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                {t("navigation.all")}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;

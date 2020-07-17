import React from "react";
import { Link } from "react-router-dom";

export default function MenuBar() {
  return (
    <React.Fragment>
      <div style={{ height: "5rem" }}></div>
      <nav>
        <div className="container" style={{ display: "flex" }}>
          <div id="app-logo">
            <Link to="/">
              <span role="img" aria-label="image of a parrot">
                🦜
              </span>
              REPARRiT
            </Link>
          </div>

          <div className="nav-menu nav-menu-desktop">
            <Link to="/repairs">Repairs</Link>
            <Link to="/customers">Customers</Link>
            <Link to="/parts">Parts</Link>
            <Link to="/suppliers">Suppliers</Link>
          </div>

          <div
            className="nav-menu-desktop"
            style={{ flexGrow: 5, textAlign: "right" }}
          >
            <Link to="/logout">Log out</Link>
          </div>

          <div
            className="nav-menu-mobile"
            style={{ flexGrow: 5, textAlign: "right" }}
          >
            <Link>Menu</Link>
          </div>
        </div>
      </nav>
    </React.Fragment>
  );
}

import React from "react";
import { Link } from "react-router-dom";

export default function MenuBar() {
  return (
    <React.Fragment>
      <div style={{ height: "5rem" }}></div>
      <nav>
        <div className="container" style={{ display: "flex" }}>
          <div id="app-logo">
            <Link to="/repairs">
              <span
                role="img"
                aria-label="our logo"
                style={{
                  display: "inline-block",
                  width: "30px",
                  height: "22px",
                  background: 'no-repeat center/contain url("/logo.png")',
                }}
              ></span>
              REPARRiT
            </Link>
          </div>

          <div className="nav-menu nav-menu-desktop">
            <Link to="/customers">Customers</Link>
            <Link to="/parts">Parts</Link>
          </div>

          <div
            className="nav-menu-desktop"
            style={{ flexGrow: 5, textAlign: "right" }}
          >
            <a
              href="#"
              onClick={async () => {
                let response = await fetch("api/logout");
                window.location = "/login";
              }}
            >
              Log out
            </a>
          </div>

          <div
            className="nav-menu-mobile"
            style={{ flexGrow: 5, textAlign: "right" }}
          >
            <a
              onClick={() => {
                document
                  .getElementById("nav-mobile-options")
                  .classList.toggle("hidden");
              }}
            >
              Menu
            </a>
          </div>
        </div>
      </nav>

      <div id="nav-mobile-options" className="hidden">
        <Link to="/customers">Customers</Link>
        <br />
        <Link to="/parts">Parts</Link>
        <hr style={{ margin: "1.5rem", borderTop: "1px solid #ffffff59" }}></hr>
        <a
          href="#"
          onClick={async () => {
            let response = await fetch("api/logout");
            window.location = "/login";
          }}
        >
          Log out
        </a>
      </div>
    </React.Fragment>
  );
}

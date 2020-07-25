import React from "react";
import { Link } from "react-router-dom";

export default function CustomerMenuBar() {
  return (
    <React.Fragment>
      <div style={{ height: "5rem" }}></div>
      <nav style={{ backgroundColor: "rgb(175, 224, 187)" }}>
        <div className="container" style={{ display: "flex" }}>
          <div id="app-logo">
            <Link to="/myrepairs" style={{ color: "#346799" }}>
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

          <div style={{ flexGrow: 5, textAlign: "right" }}>
            <a
              href="#"
              onClick={async () => {
                let response = await fetch("api/logout");
                window.location = "/customerlogin";
              }}
            >
              Log out
            </a>
          </div>
        </div>
      </nav>
    </React.Fragment>
  );
}

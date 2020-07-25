import React from "react";
import { Link } from "react-router-dom";

export default function ButtonHeader({
  title,
  buttonText,
  buttonLink,
  subtitle,
}) {
  return (
    <React.Fragment>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem 3rem",
        }}
      >
        <div style={{ display: "inline-block", flexGrow: "25" }}>
          <h4>{title}</h4>
        </div>

        <Link
          to={buttonLink}
          className="button button-primary"
          style={{ flexGrow: "1" }}
        >
          {buttonText}
        </Link>
      </div>
      <h6 style={{ marginBottom: "7rem" }}>{subtitle ? subtitle : ""}</h6>
    </React.Fragment>
  );
}

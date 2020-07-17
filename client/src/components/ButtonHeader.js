import React from "react";
import { Link } from "react-router-dom";

export default function ButtonHeader({ title, buttonText, buttonLink }) {
  return (
    <div style={{ marginBottom: "8rem" }}>
      <h4 style={{ display: "inline-block", marginBottom: 0 }}>{title}</h4>
      <Link
        style={{ float: "right" }}
        to={buttonLink}
        className="button button-primary"
      >
        {buttonText}
      </Link>
    </div>
  );
}

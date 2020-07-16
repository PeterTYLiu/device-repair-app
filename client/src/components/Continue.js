import React from "react";
import { Link } from "react-router-dom";

export default function Continue({
  backLink,
  backText,
  nextLink,
  nextText,
  allowNext,
  onNext,
}) {
  return (
    <div
      style={{
        marginTop: "8rem",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Link to={backLink} className="button">
        {backText}
      </Link>
      <Link
        to={nextLink}
        onClick={onNext}
        className={`button button-primary ${
          allowNext ? "" : "button-disabled"
        }`}
      >
        {nextText}
      </Link>
    </div>
  );
}

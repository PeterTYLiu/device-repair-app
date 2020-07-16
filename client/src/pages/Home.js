import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <React.Fragment>
      <h4>Repair App</h4>
      <Link to="/newrepair/customer" className="button button-primary">
        New repair
      </Link>
    </React.Fragment>
  );
}

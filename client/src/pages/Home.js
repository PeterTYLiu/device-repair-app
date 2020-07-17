import React from "react";
import { Link } from "react-router-dom";
import MenuBar from "../components/MenuBar";

export default function Home() {
  return (
    <React.Fragment>
      <MenuBar />
      <div className="container">
        <h4>Dashboard</h4>
        <Link to="/newrepair/customer" className="button button-primary">
          New repair
        </Link>
        <br />
        <Link to="/newrepair/customer" className="button button-primary">
          New part
        </Link>
      </div>
    </React.Fragment>
  );
}

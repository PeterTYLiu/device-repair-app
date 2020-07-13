import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Repair() {
  const usedParts = [
    { id: 1604, name: "iPhone Xs LCD display", cost: 41.28 },
    { id: 103, name: "iPhone Xs back glass", cost: 7.98 },
    { id: 340, name: "iPhone Xs battery", cost: 22.05 },
  ];

  const [repairStatus, setRepairStatus] = useState("ongoing");
  const [parts, setParts] = useState(usedParts);
  const [costOfLabour, setCostOfLabour] = useState("");

  const partsTable = parts.map((part) => {
    return (
      <div className="part-row" key={part.id}>
        <div>
          <p className="part-name">
            <Link target="_blank" to="/somepage">
              {part.name}
            </Link>
            <span
              className="delete float-right"
              id={part.id}
              onClick={(e) => {
                setParts(
                  parts.filter((aPart) => aPart.id !== parseInt(e.target.id))
                );
              }}
            >
              ×
            </span>
            <span className="float-right">${part.cost}</span>
          </p>
        </div>
        <div>
          <p className="part-id">ID: {part.id}</p>
        </div>
      </div>
    );
  });

  return (
    <React.Fragment>
      <header>
        <h4>
          Repair #3610{" "}
          <span className={`status status-${repairStatus}`}>
            {repairStatus}
          </span>
        </h4>
        <h6>Joe Smith</h6>
        <h6>Apple iPhone Xs</h6>
        <h6>Started Jul. 6 2020</h6>
      </header>
      <hr></hr>
      <div className="row">
        <div className="eight columns">
          <h5>Parts</h5>
          {partsTable}
          <Link to="/part-page" className="button">
            Add part
          </Link>
        </div>
      </div>
      <hr></hr>
      <div className="row">
        <div className="six columns">
          <h5>Cost of labour</h5>
          <input
            type="number"
            className="u-full-width"
            id="labourCost"
            placeholder="Enter cost of labour"
            value={costOfLabour}
            onChange={(e) => setCostOfLabour(e.target.value)}
          ></input>
        </div>
      </div>
      <hr></hr>
      <div className="row">
        <div className="twelve columns">
          <h5>
            Total cost: $
            {parts
              .reduce(
                (total, part) => {
                  return total + part.cost;
                },
                costOfLabour ? parseFloat(costOfLabour) : 0
              )
              .toFixed(2)}
          </h5>
          <button className="button-primary">Complete Repair</button>
          <p>
            {repairStatus === "ongoing"
              ? "Customer will be alerted by email once the repair is completed"
              : "Customer has been alerted"}
          </p>
        </div>
      </div>
    </React.Fragment>
  );
}

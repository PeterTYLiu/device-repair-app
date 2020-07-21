import React, { useState } from "react";
import { Link } from "react-router-dom";
import MenuBar from "../components/MenuBar";

export default function Repair({ match }) {
  const usedParts = [
    {
      id: 1604,
      name: "iPhone Xs LCD display",
      cost: 41.28,
      replaced: true,
      dateAdded: 950,
    },
    {
      id: 103,
      name: "iPhone Xs back glass",
      cost: 7.98,
      replaced: false,
      dateAdded: 950,
    },
    {
      id: 340,
      name: "iPhone Xs battery",
      cost: 22.05,
      replaced: false,
      dateAdded: 1270,
    },
  ];

  const [repairStatus, setRepairStatus] = useState("ongoing");
  const [hasWarranty, setHasWarranty] = useState(false);
  const [warranty, setWarranty] = useState({
    dateAdded: 1000,
    dateExpired: 2000,
  });
  const [parts, setParts] = useState(usedParts);
  const [costOfLabour, setCostOfLabour] = useState("");
  const [costOfWarranty, setCostOfWarranty] = useState("");

  function calculateCostOfParts() {
    if (hasWarranty) {
      return parts
        .filter((part) => part.dateAdded < warranty.dateAdded)
        .reduce((total, part) => {
          return total + part.cost;
        }, 0);
    }
    return parts.reduce((total, part) => {
      return total + part.cost;
    }, 0);
  }

  const partsTable = parts.map((part) => {
    return (
      <div className="part-row" key={part.id}>
        <div>
          <p className="part-name">
            <Link target="_blank" to={`/part/${part.id}`}>
              {hasWarranty && part.replaced ? (
                <span>
                  <del>{part.name}</del> <em>Replaced</em>
                </span>
              ) : (
                part.name
              )}
            </Link>
            {repairStatus === "ongoing" ? (
              <span
                className={`delete float-right ${
                  hasWarranty && part.dateAdded < warranty.dateAdded
                    ? "delete-disabled"
                    : ""
                }`}
                id={part.id}
                onClick={(e) => {
                  setParts(
                    parts.filter((aPart) => aPart.id !== parseInt(e.target.id))
                  );
                }}
              >
                ×
              </span>
            ) : null}
            <span className="float-right">
              {!hasWarranty || part.dateAdded < warranty.dateAdded
                ? `$${part.cost}`
                : "no cost"}
            </span>
          </p>
        </div>
        <div>
          <p className="part-id">ID: {part.id}</p>
        </div>
      </div>
    );
  });

  let warrantySection;
  let mainButtonSection;

  let warrantySection1 = (
    <React.Fragment>
      <div className="row">
        <h5>Warranty</h5>
        <p>
          The warranty on this repair covers all parts listed below, effective
          until <b>June 21, 2021</b>.
        </p>
        <p>Warranty price: ${costOfWarranty}</p>
        {repairStatus === "delivered" ? (
          <Link
            className="button button-primary"
            to={`/repair/${match.params.id}/claimwarranty`}
          >
            Claim warranty
          </Link>
        ) : null}
      </div>
      <hr></hr>
    </React.Fragment>
  );
  let warrantySection2 = (
    <React.Fragment>
      <div className="row">
        <h5>This device is undergoing a warranty claim.</h5>
        <p>
          The warranty on this repair covers all parts listed below, effective
          until <b>June 21, 2021</b>.
        </p>
        <p>Warranty price: ${costOfWarranty}</p>
      </div>
      <hr></hr>
    </React.Fragment>
  );
  let warrantySection3 = (
    <React.Fragment>
      <div className="row">
        <h5>Warranty</h5>

        <Link
          className="button button-primary"
          to={`/repair/${match.params.id}/addwarranty`}
        >
          Add a Warranty
        </Link>
        <p>
          A warranty's duration begins when the device is delivered to the
          customer.
        </p>
      </div>
      <hr></hr>
    </React.Fragment>
  );

  let mainButtonSectionA = (
    <p>The device was repaired and delivered to the customer.</p>
  );
  let mainButtonSectionB = (
    <React.Fragment>
      <button
        className="button-primary"
        onClick={() => {
          setRepairStatus("complete");
          window.scrollTo(0, 0);
        }}
      >
        Complete repair
      </button>
      <p>The customer will be notified by email when the repair is completed</p>
    </React.Fragment>
  );
  let mainButtonSectionC = (
    <React.Fragment>
      <button
        className="button-primary"
        onClick={() => {
          setRepairStatus("delivered");
          window.scrollTo(0, 0);
        }}
      >
        Mark as delivered
      </button>
      <p>
        This will confirm that you have delivered the device to the customer
      </p>
    </React.Fragment>
  );

  if (repairStatus === "ongoing" && hasWarranty) {
    warrantySection = warrantySection2;
    mainButtonSection = mainButtonSectionB;
  } else if (repairStatus === "ongoing" && !hasWarranty) {
    warrantySection = null;
    mainButtonSection = mainButtonSectionB;
  } else if (repairStatus === "complete" && hasWarranty) {
    warrantySection = warrantySection1;
    mainButtonSection = mainButtonSectionC;
  } else if (repairStatus === "complete" && !hasWarranty) {
    warrantySection = warrantySection3;
    mainButtonSection = mainButtonSectionC;
  } else if (repairStatus === "delivered" && hasWarranty) {
    warrantySection = warrantySection1;
    mainButtonSection = mainButtonSectionA;
  } else {
    warrantySection = warrantySection3;
    mainButtonSection = mainButtonSectionA;
  }

  return (
    <React.Fragment>
      <MenuBar />
      <div className="container">
        <header>
          <button
            className="button"
            onClick={() => {
              setHasWarranty(!hasWarranty);
              setCostOfWarranty(costOfWarranty == "25.00" ? "0.00" : "25.00");
            }}
          >
            Toggle Warranty (FOR TESTING PURPOSES ONLY)
          </button>
          <h4>
            Repair #{match.params.id}{" "}
            <span className={`status status-${repairStatus}`}>
              {repairStatus}
            </span>
          </h4>
          <h6>
            <Link to="/customer/12">Joe Smith</Link>
          </h6>
          <h6>Apple iPhone Xs</h6>
          <h6>Started Jul. 6 2020</h6>
        </header>
        <hr></hr>
        {warrantySection}
        <div className="row">
          <div className="eight columns">
            <h5>Parts</h5>
            {partsTable}
            {repairStatus === "ongoing" ? (
              <Link to={`./${match.params.id}/selectpart`} className="button">
                Add part
              </Link>
            ) : null}
          </div>
        </div>
        <hr></hr>
        <div className="row">
          <div className="six columns">
            <h5>Notes</h5>
            <textarea
              className="u-full-width"
              placeholder="Enter some notes"
            ></textarea>
          </div>
        </div>
        <hr></hr>
        <div className="row">
          <div className="six columns">
            <h5>Cost of labour</h5>
            <input
              type="number"
              min="0"
              className="u-full-width"
              id="labourCost"
              placeholder="Enter cost of labour"
              value={costOfLabour}
              onChange={(e) => setCostOfLabour(e.target.value)}
              disabled
              {...(repairStatus === "ongoing" &&
                !hasWarranty && { disabled: false })}
            ></input>
          </div>
        </div>
        <hr></hr>
        <div className="row">
          <div className="twelve columns">
            <h5>
              Total cost: $
              {(
                calculateCostOfParts() +
                Number(costOfLabour) +
                Number(costOfWarranty)
              ).toFixed(2)}
            </h5>
            {mainButtonSection}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

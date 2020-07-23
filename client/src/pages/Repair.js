import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MenuBar from "../components/MenuBar";

export default function Repair({ match }) {
  const defaultRepair = {
    id: 0,
    startDate: "2020-07-23",
    endDate: null,
    totalPrice: "0.00",
    laborCost: "0.00",
    description: "",
    status: "Ongoing",
    createdAt: "2020-07-23T04:16:20.000Z",
    updatedAt: "2020-07-23T04:16:20.000Z",
    repairCustomerId: 3,
    repairShopId: 1,
    DeviceId: 4,
    Customer: {
      id: 3,
      email: "ismith@mailinator.com",
      name: "John Test",
      password: "$2a$10$zCkDS2It.55r8cdO2QrcBOrssSMiN4BUDhngziHAxrmKlXXfGK3pG",
      createdAt: "2020-07-23T03:42:54.000Z",
      updatedAt: "2020-07-23T03:42:54.000Z",
    },
    Parts: [],
    Device: {
      id: 0,
      model: "Test Phone",
      createdAt: "2020-07-23T04:05:59.000Z",
      updatedAt: "2020-07-23T04:05:59.000Z",
      ManufacturerId: 2,
    },
    Warranty: null,
  };

  const setRepairStatus = async (status) => {
    let response = await fetch(`/api/repairs/${repair.id}/updateStatus`, {
      method: "PATCH",
      body: JSON.stringify({
        status: status,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      window.scrollTo(0, 0);
      window.location.reload();
    }
  };

  const [repair, setRepair] = useState(defaultRepair);

  useEffect(() => {
    (async () => {
      let repairResponse = await fetch("/api/repairs/" + match.params.id);
      if (repairResponse.status === 401) return (window.location = "/login");
      if (repairResponse.status === 200) {
        let repairBody = await repairResponse.json();
        let repairData = repairBody.data;
        // Set state based on repair data
        setRepair(repairData);
      }
    })();
  }, []);

  function calculateCostOfParts() {
    if (repair.Warranty) {
      return repair.Parts.filter(
        (part) => part.dateAdded < repair.Warranty.dateAdded
      ).reduce((total, part) => {
        return total + part.cost;
      }, 0);
    }
    return repair.Parts.reduce((total, part) => {
      return total + part.cost;
    }, 0);
  }

  const partsTable = repair.Parts.map((part) => {
    return (
      <div className="part-row" key={part.id}>
        <div>
          <p className="part-name">
            <Link target="_blank" to={`/part/${part.id}`}>
              {repair.Warranty && part.replaced ? (
                <span>
                  <del>{part.name}</del> <em>Replaced</em>
                </span>
              ) : (
                part.name
              )}
            </Link>
            {repair.status.toLowerCase() === "ongoing" ? (
              <span
                className={`delete float-right ${
                  repair.Warranty && part.dateAdded < repair.Warranty.dateAdded
                    ? "delete-disabled"
                    : ""
                }`}
                id={part.id}
                onClick={(e) => {
                  // Remove part with id === e.target.id
                }}
              >
                ×
              </span>
            ) : null}
            <span className="float-right">
              {repair.Warranty || part.dateAdded < repair.Warranty.dateAdded
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
        <p>Warranty price: ${repair.Warranty ? repair.Warranty.cost : null}</p>
        {repair.status.toLowerCase() === "delivered" ? (
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
        <p>Warranty price: ${repair.Warranty ? repair.Warranty.cost : null}</p>
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
        }}
      >
        Mark as delivered
      </button>
      <p>
        This will confirm that you have delivered the device to the customer
      </p>
    </React.Fragment>
  );

  if (repair.status.toLowerCase() === "ongoing" && repair.Warranty) {
    warrantySection = warrantySection2;
    mainButtonSection = mainButtonSectionB;
  } else if (repair.status.toLowerCase() === "ongoing" && !repair.Warranty) {
    warrantySection = null;
    mainButtonSection = mainButtonSectionB;
  } else if (repair.status.toLowerCase() === "complete" && repair.Warranty) {
    warrantySection = warrantySection1;
    mainButtonSection = mainButtonSectionC;
  } else if (repair.status.toLowerCase() === "complete" && !repair.Warranty) {
    warrantySection = warrantySection3;
    mainButtonSection = mainButtonSectionC;
  } else if (repair.status.toLowerCase() === "delivered" && repair.Warranty) {
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
          <h4>
            Repair #{match.params.id}{" "}
            <span className={`status status-${repair.status.toLowerCase()}`}>
              {repair.status.toLowerCase()}
            </span>
          </h4>
          <h6>
            <Link to={`/customer/${repair.Customer.id}`}>
              {repair.Customer.name}
            </Link>
          </h6>
          <h6>{repair.Device.model}</h6>
          <h6>Started {repair.startDate}</h6>
        </header>
        <hr></hr>
        {warrantySection}
        <div className="row">
          <div className="eight columns">
            <h5>Parts</h5>
            {partsTable}
            {repair.status.toLowerCase() === "ongoing" ? (
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
              value={repair.laborCost}
              onChange={(e) => {
                //set the cost of labour with time lag
              }}
              disabled
              {...(repair.status.toLowerCase() === "ongoing" &&
                !repair.Warranty && { disabled: false })}
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
                Number(repair.laborCost) +
                Number(repair.Warranty ? repair.Warranty.cost : 0)
              ).toFixed(2)}
            </h5>
            {mainButtonSection}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CustomerMenuBar from "../components/CustomerMenuBar";

export default function MyRepair({ match }) {
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
    Shop: { name: "" },
    Warranty: { price: 12.5 },
  };

  const [repair, setRepair] = useState(defaultRepair);
  const [notes, setNotes] = useState("");
  const [costOfParts, setCostOfParts] = useState(0);

  let updateRepairFromApi = async () => {
    let repairResponse = await fetch(
      "/api/customers/repairs/" + match.params.id
    );
    if (repairResponse.status === 401)
      return (window.location = "/customerlogin");
    if (repairResponse.status === 200) {
      let repairBody = await repairResponse.json();
      let repairData = repairBody.data;
      // Set state based on repair data
      console.log(repairData);
      setRepair(repairData);
      setNotes(repairData.description);
    }
  };

  useEffect(() => {
    updateRepairFromApi();
  }, []);

  useEffect(() => {
    let newCostOfParts;

    if (repair.Warranty) {
      newCostOfParts = repair.Parts.filter((part) => {
        return (
          Date.parse(part.RepairParts.createdAt) <
          Date.parse(repair.Warranty.createdAt)
        );
      }).reduce((total, part) => total + parseFloat(part.price), 0);
    } else {
      newCostOfParts = repair.Parts.reduce(
        (total, part) => total + parseFloat(part.price),
        0
      );
    }

    console.log(newCostOfParts);
    setCostOfParts(Number(newCostOfParts));
  }, [repair]);

  const partsTable = repair.Parts.map((part) => {
    return (
      <div className="part-row" key={part.id}>
        <div>
          <p className="part-name">
            <span>
              {part.RepairParts.replaced ? (
                <span>
                  <del>{part.name}</del> <em>Replaced</em>
                </span>
              ) : (
                part.name
              )}
            </span>
            <span className="float-right">
              {!repair.Warranty ||
              Date.parse(part.RepairParts.createdAt) <
                Date.parse(repair.Warranty.createdAt)
                ? `$${part.price}`
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
          until <b>{repair.Warranty ? repair.Warranty.endDate : null}</b>.
        </p>
        <p>Warranty price: ${repair.Warranty ? repair.Warranty.price : null}</p>
        {repair.status.toLowerCase() === "delivered"
          ? "Bring your device to the repair store to claim your warranty"
          : null}
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
          until <b>{repair.Warranty ? repair.Warranty.endDate : null}</b>.
        </p>
        <p>Warranty price: ${repair.Warranty ? repair.Warranty.price : null}</p>
      </div>
      <hr></hr>
    </React.Fragment>
  );
  let warrantySection3 = (
    <React.Fragment>
      <div className="row">
        <h5>Warranty</h5>
        <p>Ask your shop about getting a warranty to protect your device.</p>
      </div>
      <hr></hr>
    </React.Fragment>
  );

  let mainButtonSectionA = (
    <p>The device was repaired and delivered to the you.</p>
  );
  let mainButtonSectionB = (
    <React.Fragment>
      <p>You will be notified by email when the repair is completed</p>
    </React.Fragment>
  );
  let mainButtonSectionC = (
    <React.Fragment>
      <p>Please go to your repair shop to pick up your repaired device</p>
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
      <CustomerMenuBar />
      <div className="container">
        <header>
          <h4>
            Repair #{match.params.id}{" "}
            <span className={`status status-${repair.status.toLowerCase()}`}>
              {repair.status.toLowerCase()}
            </span>
          </h4>
          {/* <h6>
            <Link to={`/myrepairs`}>{repair.Customer.name}</Link>
          </h6> */}
          <h6>{repair.Shop.name}</h6>
          <h6>{repair.Device.model}</h6>
          <h6>Started {repair.startDate}</h6>
        </header>
        <hr></hr>
        {warrantySection}
        <div className="row">
          <div className="eight columns">
            <h5>Parts</h5>
            {partsTable}
          </div>
        </div>
        <hr></hr>
        <div className="row">
          <div className="six columns">
            <h5>Notes</h5>
            <p>{notes ? notes : "None"}</p>
          </div>
        </div>
        <hr></hr>
        <div className="row">
          <div className="six columns">
            <h5>Cost of labour</h5>
            <p>${repair.laborCost}</p>
          </div>
        </div>
        <hr></hr>
        <div className="row">
          <div className="twelve columns">
            <h5>
              Total cost: $
              {(
                costOfParts +
                Number(repair.laborCost) +
                Number(repair.Warranty ? repair.Warranty.price : 0)
              ).toFixed(2)}
            </h5>
            {mainButtonSection}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

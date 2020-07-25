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
    Warranty: { price: 12.5 },
  };

  const [repair, setRepair] = useState(defaultRepair);
  const [notes, setNotes] = useState("");
  const [costOfParts, setCostOfParts] = useState(0);
  const [makeNotesApiCall, setMakeNotesApiCall] = useState(false);

  let updateRepairFromApi = async () => {
    let repairResponse = await fetch("/api/repairs/" + match.params.id);
    if (repairResponse.status === 401) return (window.location = "/login");
    if (repairResponse.status === 200) {
      let repairBody = await repairResponse.json();
      let repairData = repairBody.data;
      // Set state based on repair data
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

    // Set the total cost of the repair
    (async () => {
      let newTotalPrice = (
        newCostOfParts +
        Number(repair.laborCost) +
        Number(repair.Warranty ? repair.Warranty.price : 0)
      ).toFixed(2);
      let setTotalCostResponse = await fetch(
        `/api/repairs/${match.params.id}/updateTotalPrice`,
        {
          method: "PATCH",
          body: JSON.stringify({
            totalPrice: newTotalPrice,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (setTotalCostResponse.status === 200)
        console.log("Total price updated to " + newTotalPrice);
    })();
  }, [repair]);

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

  const handleRemovePart = async (e) => {
    let removingPartId = e.target.id;
    let response = await fetch(
      `/api/repairs/${repair.id}/removePart/${removingPartId}`,
      {
        method: "POST",
      }
    );
    if (response.status === 200) updateRepairFromApi();
  };

  const partsTable = repair.Parts.map((part) => {
    return (
      <div className="part-row" key={part.id}>
        <div>
          <p className="part-name">
            <Link target="_blank" to={`/part/${part.id}`}>
              {part.RepairParts.replaced ? (
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
                  repair.Warranty &&
                  Date.parse(part.RepairParts.createdAt) <
                    Date.parse(repair.Warranty.createdAt)
                    ? "delete-disabled"
                    : ""
                }`}
                id={part.id}
                onClick={handleRemovePart}
              >
                ×
              </span>
            ) : null}
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

  // Timer function for cost input
  let costTypingTimer;
  function handleCostChange(e) {
    clearTimeout(costTypingTimer);
    let newCost = e.target.value;
    costTypingTimer = setTimeout(async () => {
      let changeCostResponse = await fetch(
        `/api/repairs/${repair.id}/updateCost`,
        {
          method: "PATCH",
          body: JSON.stringify({
            laborCost: newCost,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (changeCostResponse.status === 200) {
        updateRepairFromApi();
      }
    }, 4000);
  }

  // Timer function for description input
  let notesTypingTimer;
  useEffect(() => {
    if (makeNotesApiCall) {
      setMakeNotesApiCall(false);
      (async () => {
        let changeNotesResponse = await fetch(
          `/api/repairs/${repair.id}/updateNotes`,
          {
            method: "PATCH",
            body: JSON.stringify({
              description: notes,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      })();
    }
  }, [makeNotesApiCall]);

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
              onChange={(e) => {
                let newNotes = e.target.value;
                setNotes(newNotes);
                clearTimeout(notesTypingTimer);
                notesTypingTimer = setTimeout(() => {
                  setMakeNotesApiCall(true);
                }, 3000);
              }}
              value={notes}
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
              placeholder={repair.laborCost}
              onChange={handleCostChange}
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

import React, { useState, useEffect } from "react";
import CustomerMenuBar from "../components/CustomerMenuBar";
import ButtonHeader from "../components/ButtonHeader";

export default function Customer() {
  const [repairs, setRepairs] = useState([
    { Customer: { name: "", id: "" }, Device: { model: "" } },
  ]);

  // Populate all repairs from this customer in my shop
  useEffect(() => {
    (async () => {
      let repairsResponse = await fetch(`/api/customers/repairs`);
      if (repairsResponse.status === 401)
        return (window.location = "/customerlogin");
      if (repairsResponse.status === 200) {
        let repairsBody = await repairsResponse.json();
        console.log(repairsBody.data);
        setRepairs(repairsBody.data);
      }
    })();
  }, []);

  let sortedRepairsTable = repairs
    .sort((a, b) => {
      if (a.startDate > b.startDate) return -1;
      return 1;
    })
    .map(({ totalPrice, id, Device, status, startDate }) => {
      return (
        <div
          className="repair-row"
          key={id}
          onClick={() => (window.location.href = `/myrepair/${id}`)}
        >
          <h5>
            {Device.model}
            <span className={`status status-${status}`}>{status}</span>
            <span style={{ color: "#999", float: "right" }}>#{id}</span>
          </h5>
          <p style={{ marginBottom: 0 }}>
            ${totalPrice}
            <span style={{ float: "right" }}>Started: {startDate}</span>
          </p>
        </div>
      );
    });

  return (
    <React.Fragment>
      <CustomerMenuBar />
      <div className="container">
        <div style={{ marginBottom: "8rem" }}>
          <div>
            <h4 style={{ display: "inline-block", marginBottom: 0 }}>
              {repairs[0].Customer.name}
            </h4>
          </div>
          {"Customer #" + repairs[0].Customer.id}
        </div>

        <h5>Repair history</h5>
        <div>{sortedRepairsTable}</div>
      </div>
    </React.Fragment>
  );
}

import React, { useState, useEffect } from "react";
import MenuBar from "../components/MenuBar";
import ButtonHeader from "../components/ButtonHeader";

export default function Customer({ match }) {
  const [customerName, setCustomerName] = useState("");
  const [repairs, setRepairs] = useState([]);

  // Populate all repairs from this customer in my shop
  useEffect(() => {
    (async () => {
      let repairsResponse = await fetch(
        `/api/repairs/customer/${match.params.id}`
      );
      if (repairsResponse.status === 401) return (window.location = "/login");
      if (repairsResponse.status === 200) {
        let repairsBody = await repairsResponse.json();
        setRepairs(repairsBody.data);
        setCustomerName(repairsBody.data[0].Customer.name);
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
          onClick={() => (window.location.href = `/repair/${id}`)}
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
      <MenuBar />
      <div className="container">
        <ButtonHeader
          title={customerName}
          buttonLink="/"
          buttonText="New repair"
          subtitle={"Customer #" + match.params.id}
        />
        <h5>Repair history</h5>
        <div>{sortedRepairsTable}</div>
      </div>
    </React.Fragment>
  );
}

import React from "react";
import MenuBar from "../components/MenuBar";
import ButtonHeader from "../components/ButtonHeader";
import customers from "../storeCustomers.json";

export default function Customer({ match }) {
  const customerRepairs = [
    {
      id: 157,
      device: "OnePlus 8 Pro",
      startDate: "2020-05-29T18:25:43-05:00",
      status: "ongoing",
      cost: 105.5,
    },
    {
      id: 98,
      device: "Blackberry Key2",
      startDate: "2019-04-12T18:25:43-05:00",
      status: "delivered",
      cost: 170.25,
    },
    {
      id: 34,
      device: "iPhone 5s",
      startDate: "2016-11-25T18:25:43-05:00",
      status: "delivered",
      cost: 85.9,
    },
  ];

  let sortedRepairsTable = customerRepairs
    .sort((a, b) => {
      if (a.startDate > b.startDate) return -1;
      return 1;
    })
    .map(({ cost, id, device, status, startDate }) => {
      return (
        <div
          className="repair-row"
          key={id}
          onClick={() => (window.location.href = `/repair/${id}`)}
        >
          <h5>
            {device}
            <span className={`status status-${status}`}>{status}</span>
            <span style={{ color: "#999", float: "right" }}>#{id}</span>
          </h5>
          <p style={{ marginBottom: 0 }}>
            ${cost.toFixed(2)}
            <span style={{ float: "right" }}>
              Started: {startDate.substr(0, 10)}
            </span>
          </p>
        </div>
      );
    });

  return (
    <React.Fragment>
      <MenuBar />
      <div className="container">
        <ButtonHeader
          title={customers[match.params.id].name}
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

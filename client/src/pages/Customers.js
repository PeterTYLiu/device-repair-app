import React from "react";
import MenuBar from "../components/MenuBar";
import ButtonHeader from "../components/ButtonHeader";
import customers from "../storeCustomers.json";

export default function Customers() {
  const unsortedCustomers = Object.values(customers);

  let sortedCustomersTable = unsortedCustomers.map(
    ({ id, name, status, repairs }) => {
      return (
        <div
          className="repair-row"
          key={id}
          onClick={() => (window.location.href = `/customer/${id}`)}
        >
          <h5>
            {name}
            <span style={{ color: "#999", float: "right" }}>#{id}</span>
          </h5>
          <p style={{ marginBottom: 0 }}>
            {repairs.length}
            {repairs.length > 1 ? " repairs" : " repair"}
            <span style={{ float: "right" }}>Added: 2019-08-08</span>
          </p>
        </div>
      );
    }
  );

  return (
    <React.Fragment>
      <MenuBar />
      <div className="container">
        <ButtonHeader
          title="Customers"
          buttonLink="/newrepair/customer"
          buttonText="New repair"
          subtitle={unsortedCustomers.length + " customers"}
        />

        <div>{sortedCustomersTable}</div>
      </div>
    </React.Fragment>
  );
}

import React, { useState, useEffect } from "react";
import MenuBar from "../components/MenuBar";
import ButtonHeader from "../components/ButtonHeader";

export default function Customers() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    (async () => {
      let customersResponse = await fetch(`/api/shops/customers/shop`);
      if (customersResponse.status === 401) return (window.location = "/login");
      if (customersResponse.status === 200) {
        let customersBody = await customersResponse.json();
        setCustomers(customersBody.data);
        console.log(customersBody.data);
      }
    })();
  }, []);

  let sortedCustomersTable = customers.map(({ id, name, email }) => {
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
          {email}
          {/* {repairs.length}
          {repairs.length > 1 ? " repairs" : " repair"}
          <span style={{ float: "right" }}>Added: 2019-08-08</span> */}
        </p>
      </div>
    );
  });

  return (
    <React.Fragment>
      <MenuBar />
      <div className="container">
        <ButtonHeader
          title="Customers"
          buttonLink="/newrepair/customer"
          buttonText="New repair"
          subtitle={customers.length + " customers"}
        />

        <div>{sortedCustomersTable}</div>
      </div>
    </React.Fragment>
  );
}

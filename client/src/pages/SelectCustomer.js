import React, { useEffect, useState } from "react";
import Continue from "../components/Continue";
import storeCustomers from "../storeCustomers.json";

export default function SelectCustomer() {
  const [customerId, setCustomerId] = useState("");
  const [myCustomers, setMyCustomers] = useState(Object.values(storeCustomers));
  const [newCustomer, setNewCustomer] = useState({ name: "", email: "" });

  useEffect(() => {
    (async () => {
      let myShopcustomers = await fetch("/api/shops/customers/shop");
      if (myShopcustomers.status === 200) {
        let responseBody = await myShopcustomers.json();
        setMyCustomers(await responseBody.data);
      }
    })();
  }, []);

  const handleSubmitCustomer = async () => {
    if (newCustomer.name && newCustomer.email) {
      let response = await fetch("/api/customers/signup", {
        method: "POST",
        body: JSON.stringify({
          name: newCustomer.name,
          email: newCustomer.email,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) return (window.location = "/login");

      if (response.status === 201) {
        let responseBody = await response.json();

        let associateNewCustomerWithShopResponse = await fetch(
          `/api/shops/customers/${responseBody.id}`,
          { method: "POST" }
        );

        if (associateNewCustomerWithShopResponse.status === 200)
          return (window.location =
            "/newrepair/device?customer=" + responseBody.id);
      }
    }

    window.location = "/newrepair/device?customer=" + customerId;
  };

  let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return (
    <div className="container">
      <div className="row">
        <div className="six columns">
          <h4>Select existing customer</h4>
          <select
            className="u-full-width"
            id="storeCustomer"
            onChange={(e) => {
              setCustomerId(e.target.value);
              if (newCustomer.name || newCustomer.email)
                setNewCustomer({ name: "", email: "" });
            }}
            value={customerId}
          >
            <option value="">---</option>
            {myCustomers.map((storeCustomer) => (
              <option value={storeCustomer.id} key={storeCustomer.id}>
                {storeCustomer.name}
              </option>
            ))}
          </select>
          {/* <p>{storeCustomers[customerId]}</p> */}
        </div>
      </div>
      <hr></hr>
      <div className="row">
        <div className="six columns">
          <h4>Create new customer</h4>
          <label htmlFor="newCustomerName">Name</label>
          <input
            type="text"
            className="u-full-width"
            id="newCustomerName"
            placeholder="Joe Smith"
            {...(customerId && {
              disabled: true,
            })}
            onChange={(e) => {
              setNewCustomer({ ...newCustomer, name: e.target.value });
            }}
            value={newCustomer.name}
          ></input>
          <label htmlFor="newCustomerEmail">Email</label>
          <input
            {...(customerId && {
              disabled: true,
            })}
            type="email"
            className="u-full-width"
            id="newCustomerEmail"
            placeholder="joe.smith@example.com"
            onChange={(e) => {
              setNewCustomer({ ...newCustomer, email: e.target.value });
            }}
            value={newCustomer.email}
          ></input>
        </div>
      </div>

      <Continue
        // nextLink={`/newrepair/device`}
        nextText="Continue"
        backText="Cancel"
        backLink="/repairs"
        allowNext={
          customerId ||
          (newCustomer.name && newCustomer.email.match(emailRegex))
        }
        onNext={handleSubmitCustomer}
      />
    </div>
  );
}

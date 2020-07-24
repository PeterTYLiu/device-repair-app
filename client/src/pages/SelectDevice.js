import React, { useEffect, useState } from "react";
import deviceList from "../deviceList.json";
import Continue from "../components/Continue";

export default function SelectDevice() {
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [manufacturers, setManufacturers] = useState([]);
  const [selectedManufacturerId, setSelectedManufacturerId] = useState("");
  const [devices, setDevices] = useState([]);
  const [customerId, setCustomerId] = useState("");

  useEffect(() => {
    // Set customer ID from URL
    let urlParams = new URLSearchParams(window.location.search);
    setCustomerId(urlParams.get("customer"));
  }, []);

  useEffect(() => {
    (async () => {
      // Populate all devices
      let allDevicesResponse = await fetch("/api/devices");
      if (allDevicesResponse.status === 401)
        return (window.location = "/login");
      if (allDevicesResponse.status === 200) {
        let data = await allDevicesResponse.json();
        console.log(Object.values(data.data));
        setDevices(Object.values(data.data));
      }
      // Populate all manufacturers
      let allManusResponse = await fetch("/api/devices/manufacturers/all");
      if (allManusResponse.status === 200) {
        let data = await allManusResponse.json();
        console.log(data.data);
        setManufacturers(data.data);
      }
    })();
  }, []);

  const createRepair = async () => {
    let response = await fetch("/api/repairs", {
      method: "POST",
      body: JSON.stringify({
        repairCustomerId: customerId,
        repairShopId: 1,
        DeviceId: selectedDeviceId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 401) return (window.location = "/login");

    if (response.status === 201) {
      let data = await response.json();
      return (window.location = "/repair/" + data.id);
    }
    alert("Failed to create a repair");
  };

  let deviceOptions = devices
    .filter(({ ManufacturerId }) => {
      if (selectedManufacturerId)
        return ManufacturerId == selectedManufacturerId;
      return ManufacturerId;
    })
    .map(({ model, id }) => (
      <option data-model={model} key={id} value={id}>
        {model}
      </option>
    ));

  let manufacturerOptions = manufacturers.map(({ name, id }) => (
    <option key={id} value={id}>
      {name}
    </option>
  ));

  return (
    <div className="container">
      <h4>Select a device</h4>

      <div className="row">
        <div className="six columns">
          <label htmlFor="manufacturer">Manufacturer</label>
          <select
            className="u-full-width"
            id="manufacturer"
            onChange={(e) => {
              setSelectedManufacturerId(e.target.value);
              setSelectedDeviceId("");
            }}
            value={selectedManufacturerId}
          >
            <option value="" disabled hidden>
              Choose a manufacturer
            </option>
            {manufacturerOptions}
          </select>
          <label htmlFor="model">Model</label>
          <select
            className="u-full-width"
            id="model"
            value={selectedDeviceId}
            {...(selectedManufacturerId === "" && { disabled: true })}
            onChange={(e) => {
              setSelectedDeviceId(e.target.value);
            }}
          >
            <option value="" disabled hidden>
              Choose a model
            </option>
            {deviceOptions}
          </select>
        </div>
      </div>

      <Continue
        nextText="Continue"
        backText="back"
        backLink="/newrepair/customer"
        allowNext={selectedDeviceId ? true : false}
        onNext={createRepair}
      />
    </div>
  );
}

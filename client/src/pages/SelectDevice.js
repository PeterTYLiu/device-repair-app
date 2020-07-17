import React, { useEffect, useState } from "react";
import deviceList from "../deviceList.json";
import Continue from "../components/Continue";

export default function SelectDevice() {
  const [device, setDevice] = useState({
    manufacturer: "",
    model: "",
    id: "",
  });

  useEffect(() => {
    console.log(device);
  }, [device]);

  let filteredDevices = Object.values(deviceList)
    .filter((myDevice) => myDevice.manufacturer === device.manufacturer)
    .sort()
    .map((aDevice) => (
      <option
        data-model={aDevice.model.toLowerCase().split(" ").join("-")}
        key={aDevice.id}
        value={aDevice.id}
      >
        {aDevice.model}
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
              setDevice({ manufacturer: e.target.value, model: "", id: "" });
            }}
            value={device.manufacturer}
          >
            <option value="" disabled hidden>
              Choose a manufacturer
            </option>
            <option value="apple">Apple</option>
            <option value="samsung">Samsung</option>
            <option value="lg">LG</option>
            <option value="motorola">Motorola</option>
            <option value="oneplus">OnePlus</option>
          </select>
        </div>
      </div>
      <div className="row">
        <div className="six columns">
          <label htmlFor="model">Model</label>
          <select
            className="u-full-width"
            id="model"
            value={device.id}
            {...(device.manufacturer === "" && { disabled: true })}
            onChange={(e) => {
              setDevice({
                ...device,
                id: e.target.value,
                model: Object.values(deviceList).find(
                  (aDevice) => aDevice.id === e.target.value
                ).model,
              });
            }}
          >
            <option value="" disabled hidden>
              Choose a model
            </option>
            {filteredDevices}
          </select>
        </div>
      </div>

      <Continue
        nextLink={`/repair/${device.id}`}
        nextText="Continue"
        backText="back"
        backLink="/newrepair/customer"
        allowNext={device.id ? true : false}
      />
    </div>
  );
}

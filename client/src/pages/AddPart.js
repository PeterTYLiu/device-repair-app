import React, { useEffect, useState } from "react";
import Continue from "../components/Continue";
import deviceList from "../deviceList.json";
import manufacturers from "../manufacturers.json";

export default function AddPart() {
  const [selectedDevice, setSelectedDevice] = useState({
    deviceId: "",
    manufacturerId: "",
  });
  const [existingPart, setExistingPart] = useState({ name: "", cost: "" });
  const [pageMode, setPageMode] = useState("New batch of existing part");
  const [newPart, setNewPart] = useState({
    name: "",
    supplier: "",
    cost: "",
  });

  function toggleStatusFilter({ target }) {
    if (pageMode !== target.innerText) {
      setNewPart({
        name: "",
        supplier: "",
        cost: "",
      });
      setExistingPart({ name: "", cost: "" });
    }

    setPageMode(target.innerText);
  }

  const addExisting = (
    <React.Fragment>
      <label>Part</label>
      <select
        className="u-full-width"
        id="part"
        value={existingPart.name}
        onChange={({ target }) => {
          setExistingPart({ ...existingPart, name: target.value });
        }}
      ></select>
      <label>Unit cost for this batch</label>
      <input
        type="number"
        className="u-full-width"
        id="unitcost"
        value={existingPart.cost}
        onChange={({ target }) => {
          setExistingPart({ ...existingPart, cost: target.value });
        }}
      />
    </React.Fragment>
  );

  const addNew = (
    <React.Fragment>
      <label>Part name (be descriptive!)</label>
      <input
        type="text"
        className="u-full-width"
        id="partname"
        value={newPart.name}
        onChange={({ target }) => {
          setNewPart({ ...newPart, name: target.value });
        }}
      />
      <label>Supplier name</label>
      <input
        type="text"
        className="u-full-width"
        id="manufacturername"
        value={newPart.supplier}
        onChange={({ target }) => {
          setNewPart({ ...newPart, supplier: target.value });
        }}
      />
      <label>Unit cost for this batch</label>
      <input
        type="number"
        className="u-full-width"
        id="unitcost"
        value={newPart.cost}
        onChange={({ target }) => {
          setNewPart({ ...newPart, cost: target.value });
        }}
      />
    </React.Fragment>
  );

  const handleCreatePart = async () => {
    console.log("foo");
  };

  return (
    <div className="container">
      <h4>Add part for a device</h4>
      <div className="row">
        <div className="six columns">
          <label>Manufacturer</label>
          <select
            className="u-full-width"
            id="manufacturer"
            onChange={(e) => {
              setSelectedDevice({
                deviceId: "",
                manufacturerId: e.target.value,
              });
            }}
            value={selectedDevice.manufacturer}
          >
            <option value="">---</option>
            {Object.values(manufacturers).map((manufacturer) => (
              <option value={manufacturer.id} key={manufacturer.id}>
                {manufacturer.name}
              </option>
            ))}
          </select>
          <label>Model</label>
          <select
            className="u-full-width"
            id="existingPartDevice"
            onChange={(e) => {
              setSelectedDevice({
                ...selectedDevice,
                deviceId: e.target.value,
              });
            }}
            value={selectedDevice.deviceId}
          >
            {Object.values(deviceList)
              .filter(
                (device) =>
                  device.manufacturerId ==
                  parseInt(selectedDevice.manufacturerId)
              )
              .map((device) => (
                <option value={device.id} key={device.id}>
                  {device.model}
                </option>
              ))}
          </select>

          <div className="radio-buttons">
            <div
              className={
                pageMode === "New batch of existing part" ? "active" : ""
              }
              onClick={toggleStatusFilter}
            >
              New batch of existing part
            </div>
            <div
              className={pageMode === "New part" ? "active" : ""}
              onClick={toggleStatusFilter}
            >
              New part
            </div>
          </div>
        </div>
      </div>
      <hr></hr>
      <div className="row">
        <div className="six columns">
          {pageMode === "New part" ? addNew : addExisting}
        </div>
      </div>

      <Continue
        nextLink="/parts"
        nextText="Add part"
        backText="Cancel"
        backLink="/"
        allowNext={
          (existingPart.name && existingPart.cost) ||
          (newPart.name && newPart.cost && newPart.supplier)
        }
        onNext={handleCreatePart}
      />
    </div>
  );
}

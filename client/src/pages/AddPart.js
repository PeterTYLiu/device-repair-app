import React, { useEffect, useState } from "react";
import Continue from "../components/Continue";
import deviceList from "../deviceList.json";
import manufacturers from "../manufacturers.json";

export default function AddPart() {
  const [manufacturers, setManufacturers] = useState([]);
  const [selectedManufacturerId, setSelectedManufacturerId] = useState("");
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");

  const [pageMode, setPageMode] = useState("New batch of existing part");

  const [partsForSelectedDevice, setPartsForSelectedDevice] = useState([]);
  const [partToAdd, setPartToAdd] = useState({
    name: "",
    supplier: "",
    cost: "",
  });

  function toggleMode({ target }) {
    if (pageMode !== target.innerText) {
      setPartToAdd({
        name: "",
        supplier: "",
        cost: "",
      });
    }

    setPageMode(target.innerText);
  }

  // Get devices and manufacturers on page load
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

  // Populate unique parts for the selected device
  useEffect(() => {
    if (selectedDeviceId) {
      (async () => {
        let devicePartsResponse = await fetch(
          `/api/parts/device/${selectedDeviceId}/partnames`
        );
        if (devicePartsResponse.status === 200) {
          let data = await devicePartsResponse.json();
          console.log(data.data);
          setPartsForSelectedDevice(Object.values(data.data));
        }
      })();
    } else {
      setPartsForSelectedDevice([]);
    }
  }, [selectedDeviceId]);

  // Create <option>s from devices
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

  // Create <option>s from manufacturers
  let manufacturerOptions = manufacturers.map(({ name, id }) => (
    <option key={id} value={id}>
      {name}
    </option>
  ));

  // Create <option>s from parts
  let existingPartOptions = partsForSelectedDevice.map(
    ({ partname, supplierName }) => (
      <option value={`${partname}+++${supplierName}`}>{partname}</option>
    )
  );

  const addExisting = (
    <React.Fragment>
      <label>Part</label>
      <select
        className="u-full-width"
        id="part"
        value={partToAdd.name}
        onChange={({ target }) => {
          let values = target.value.split("+++");
          setPartToAdd({
            ...partToAdd,
            name: values[0],
            supplier: values[1],
          });
        }}
      >
        <option value="" disabled hidden>
          Choose a part
        </option>
        {existingPartOptions}
      </select>
      <label>Unit cost for this batch</label>
      <input
        type="number"
        className="u-full-width"
        id="unitcost"
        value={partToAdd.cost}
        onChange={({ target }) => {
          setPartToAdd({ ...partToAdd, cost: target.value });
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
        value={partToAdd.name}
        onChange={({ target }) => {
          setPartToAdd({ ...partToAdd, name: target.value });
        }}
      />
      <label>Supplier name</label>
      <input
        type="text"
        className="u-full-width"
        id="manufacturername"
        value={partToAdd.supplier}
        onChange={({ target }) => {
          setPartToAdd({ ...partToAdd, supplier: target.value });
        }}
      />
      <label>Unit cost for this batch</label>
      <input
        type="number"
        className="u-full-width"
        id="unitcost"
        value={partToAdd.cost}
        onChange={({ target }) => {
          setPartToAdd({ ...partToAdd, cost: target.value });
        }}
      />
    </React.Fragment>
  );

  const handleCreatePart = async () => {
    let response = await fetch("/api/parts", {
      method: "POST",
      body: JSON.stringify({
        name: partToAdd.name,
        DeviceId: selectedDeviceId,
        supplierName: partToAdd.supplier,
        price: partToAdd.cost,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 201) return (window.location = "/parts");
  };

  return (
    <div className="container">
      <h4>Add part for a device</h4>
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
        </div>
      </div>
      <div className="row">
        <div className="six columns">
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

          <div className="radio-buttons">
            <div
              className={
                pageMode === "New batch of existing part" ? "active" : ""
              }
              onClick={toggleMode}
            >
              New batch of existing part
            </div>
            <div
              className={pageMode === "New part" ? "active" : ""}
              onClick={toggleMode}
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
        nextText="Add part"
        backText="Cancel"
        backLink="/"
        allowNext={partToAdd.name && partToAdd.cost && partToAdd.supplier}
        onNext={handleCreatePart}
      />
    </div>
  );
}

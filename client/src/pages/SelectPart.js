import React, { useEffect, useState } from "react";
import deviceList from "../deviceList.json";
import Continue from "../components/Continue";

export default function SelectPart({ match }) {
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [manufacturers, setManufacturers] = useState([]);
  const [selectedManufacturerId, setSelectedManufacturerId] = useState("");
  const [devices, setDevices] = useState([]);
  const [partId, setPartId] = useState("");
  const [partsForSelectedDevice, setPartsForSelectedDevice] = useState([]);

  // Populate all devices and manufacturers upon page load
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

  useEffect(() => {
    if (selectedDeviceId) {
      (async () => {
        let devicePartsResponse = await fetch(
          `/api/parts/device/${selectedDeviceId}`
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

  // Create <option>s from parts
  let filteredDeviceParts = partsForSelectedDevice.map(
    ({ name, id, createdAt }) => (
      <option key={id} value={id}>{`${name}, ${createdAt.substr(
        0,
        10
      )}`}</option>
    )
  );

  const addPartToRepair = async () => {
    let response = await fetch(
      `/api/repairs/${match.params.id}/addPart/${partId}`,
      {
        method: "POST",
      }
    );
    if (response.status === 201)
      return (window.location = `/repair/${match.params.id}`);
  };

  return (
    <div className="container">
      <h4>Add a part to repair #{match.params.id}</h4>

      <div className="row">
        <div className="six columns">
          <label htmlFor="manufacturer">Manufacturer</label>
          <select
            className="u-full-width"
            id="manufacturer"
            onChange={(e) => {
              setSelectedManufacturerId(e.target.value);
              setSelectedDeviceId("");
              setPartId("");
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
              setPartId("");
            }}
          >
            <option value="" disabled hidden>
              Choose a model
            </option>
            {deviceOptions}
          </select>

          <label htmlFor="model">Part</label>
          <select
            className="u-full-width"
            id="model"
            value={partId}
            {...(selectedDeviceId === "" && { disabled: true })}
            onChange={(e) => {
              setPartId(e.target.value);
            }}
          >
            <option value="" disabled hidden>
              Choose a part
            </option>
            {filteredDeviceParts}
          </select>
        </div>
      </div>

      <Continue
        onNext={addPartToRepair}
        nextText="Add to repair"
        backText="back"
        backLink={`/repair/${match.params.id}`}
        allowNext={partId ? true : false}
      />
    </div>
  );
}

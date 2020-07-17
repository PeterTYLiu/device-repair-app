import React, { useEffect, useState } from "react";
import deviceList from "../deviceList.json";
import Continue from "../components/Continue";

export default function SelectPart({ match }) {
  const [manufacturer, setManufacturer] = useState("");
  const [modelId, setModelId] = useState("");
  const [partId, setPartId] = useState("");

  let filteredDevices = Object.values(deviceList)
    .filter((myDevice) => myDevice.manufacturer === manufacturer)
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

  let filteredDeviceParts = ["part 1", "part 2", "part 3", "part 4"].map(
    (part) => (
      <option key={part} value={part}>
        {`device ID ${modelId}, ${part}`}
      </option>
    )
  );

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
              setManufacturer(e.target.value);
              setModelId("");
              setPartId("");
            }}
            value={manufacturer}
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
            value={modelId}
            {...(manufacturer === "" && { disabled: true })}
            onChange={(e) => {
              setModelId(e.target.value);
              setPartId("");
            }}
          >
            <option value="" disabled hidden>
              Choose a model
            </option>
            {filteredDevices}
          </select>
        </div>
      </div>
      <div className="row">
        <div className="six columns">
          <label htmlFor="model">Part</label>
          <select
            className="u-full-width"
            id="model"
            value={partId}
            {...(modelId === "" && { disabled: true })}
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
        nextLink={`/repair/${match.params.id}`}
        nextText="Continue"
        backText="back"
        backLink={`/repair/${match.params.id}`}
        allowNext={partId ? true : false}
      />
    </div>
  );
}

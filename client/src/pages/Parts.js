import React, { useState } from "react";
import MenuBar from "../components/MenuBar";
import ButtonHeader from "../components/ButtonHeader";

export default function Parts() {
  const unsortedParts = [
    {
      id: 1,
      name: "iPhone Xs LCD display",
      supplier: "Shenzhen Screen Inc.",
      cost: 41.28,
      device: "iPhone Xs",
      deviceId: 58,
      latestBatch: "2020-05-15T18:25:43-05:00",
      uses: 42,
      failedWithinAYear: 15,
    },
    {
      id: 2,
      name: "iPhone Xs back glass",
      supplier: "Pegatron Wholesale",
      cost: 7.98,
      device: "iPhone Xs",
      deviceId: 58,
      latestBatch: "2020-03-29T18:25:43-05:00",
      uses: 62,
      failedWithinAYear: 15,
    },
    {
      id: 3,
      name: "iPhone Xs battery",
      supplier: "GooParts Components Ltd.",
      cost: 65.36,
      device: "iPhone Xs",
      deviceId: 58,
      latestBatch: "2020-03-10T18:25:43-05:00",
      uses: 29,
      failedWithinAYear: 15,
    },
    {
      id: 4,
      name: "Moto G7 battery",
      supplier: "Motorola (OEM)",
      device: "Moto G7",
      deviceId: 235,
      cost: 22.05,
      latestBatch: "2020-01-09T18:25:43-05:00",
      uses: 38,
      failedWithinAYear: 15,
    },
  ];

  const [sortedParts, setsortedParts] = useState(unsortedParts);
  const [filters, setFilters] = useState({
    sortBy: "latestBatch",
  });

  let sortedPartsTable = sortedParts
    .sort((a, b) => {
      if (a[filters.sortBy] > b[filters.sortBy]) return -1;
      return 1;
    })
    .map(({ name, id, latestBatch, supplier, uses, cost }) => {
      return (
        <div
          className="repair-row"
          key={id}
          onClick={() => (window.location.href = `/part/${id}`)}
        >
          <h5>
            {name}
            <span style={{ color: "#999", float: "right" }}>#{id}</span>
          </h5>
          <div className="partDetails">
            <span>{supplier}</span>
            <span>${cost}</span>
            <span>{uses} uses</span>
            <span>Last ordered: {latestBatch.substr(0, 10)}</span>
          </div>
        </div>
      );
    });

  const emptyPartsTable = (
    <div className="repair-row empty-row">No parts found</div>
  );

  return (
    <React.Fragment>
      <MenuBar />
      <div className="container">
        <ButtonHeader
          title="Parts"
          buttonLink="/newpart"
          buttonText="Add part"
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "2rem 100px",
            marginBottom: "4rem",
          }}
        >
          <div className="sort-dropdown">
            <span style={{ display: "inline-block", width: "65px" }}>
              Sort by:{" "}
            </span>
            <select
              style={{
                width: "calc(100% - 66px)",
                maxWidth: "450px",
              }}
              onChange={(e) => {
                setFilters({ ...filters, sortBy: e.target.value });
              }}
              value={filters.sortBy}
            >
              <option value="" disabled hidden>
                ---
              </option>
              <option value="latestBatch">Last ordered</option>
              <option value="cost">Cost</option>
              <option value="uses">Uses</option>
              <option value="id">ID</option>
            </select>
          </div>
        </div>

        <div>
          {sortedPartsTable.length ? sortedPartsTable : emptyPartsTable}
        </div>
      </div>
    </React.Fragment>
  );
}

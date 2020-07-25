import React, { useState, useEffect } from "react";
import MenuBar from "../components/MenuBar";
import ButtonHeader from "../components/ButtonHeader";

export default function Parts() {
  const [sortedParts, setSortedParts] = useState([
    { id: "", name: "", createdAt: "", price: "", supplierName: "" },
  ]);
  const [filters, setFilters] = useState({
    sortBy: "createdAt",
  });

  useEffect(() => {
    (async () => {
      let partsResponse = await fetch(`/api/parts`);
      if (partsResponse.status === 401) return (window.location = "/login");
      if (partsResponse.status === 200) {
        let partsBody = await partsResponse.json();
        console.log(partsBody.data);
        // Create a new array with the data
        let partsBodyData = [...partsBody.data];
        // Create an empty array to store the parts
        let sortedPartsBodyData = [];
        // Sort the parts by most recent
        partsBodyData.sort((a, b) => {
          if (Date.parse(a.createdAt) > Date.parse(b.createdAt)) return -1;
          return 1;
        });
        // Push the first batch into the target array
        if (partsBodyData.length) sortedPartsBodyData.push(partsBodyData[0]);
        // For every batch, see if name exists in target array. If not, push it to the array.
        partsBodyData.forEach((batch) => {
          for (let i = 0; i < sortedPartsBodyData.length; i++) {
            if (sortedPartsBodyData[i].name === batch.name) return false;
          }
          sortedPartsBodyData.push(batch);
        });
        // See results
        console.log(sortedPartsBodyData);
        setSortedParts(sortedPartsBodyData);
      }
    })();
  }, []);

  let sortedPartsTable = sortedParts
    .sort((a, b) => {
      if (a[filters.sortBy] > b[filters.sortBy]) return -1;
      return 1;
    })
    .map(({ name, id, createdAt, supplierName, price }) => {
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
            <span>{supplierName}</span>
            <span>${price}</span>
            <span>Last ordered: {createdAt.substr(0, 10)}</span>
          </div>
        </div>
      );
    });

  const emptyPartsTable = (
    <div className="repair-row empty-row">No repairs found</div>
  );

  return (
    <React.Fragment>
      <MenuBar />
      <div className="container">
        <ButtonHeader
          title="Parts"
          buttonLink="/addpart"
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
              <option value="createdAt">Last ordered</option>
              <option value="name">Name</option>
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

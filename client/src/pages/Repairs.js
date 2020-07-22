import React, { useState, useEffect } from "react";
import MenuBar from "../components/MenuBar";
import ButtonHeader from "../components/ButtonHeader";
import repairs from "../repairs.json";

export default function Repairs() {
  const unsortedRepairs = Object.values(repairs);
  const [sortedRepairs, setSortedRepairs] = useState(unsortedRepairs);
  const [filters, setFilters] = useState({
    sortBy: "",
    complete: true,
    ongoing: true,
    delivered: false,
  });

  useEffect(() => {
    (async () => {
      let myShopRepairs = await fetch("/api/repairs");
      if (myShopRepairs.status === 200) {
        let responseBody = await myShopRepairs.json();
        setSortedRepairs(await responseBody.data);
      }
    })();
  }, []);

  function toggleStatusFilter(e) {
    setFilters({
      ...filters,
      [e.target.innerText]: !filters[e.target.innerText],
    });
    e.target.classList.toggle("active");
  }

  let sortedRepairsTable = sortedRepairs
    .filter(({ status }) => filters[status])
    .sort((a, b) => {
      if (a[filters.sortBy] < b[filters.sortBy]) return -1;
      return 1;
    })
    .map(({ customer, id, device, status, startDate }) => {
      return (
        <div
          className="repair-row"
          key={id}
          onClick={() => (window.location.href = `/repair/${id}`)}
        >
          <h5>
            {device}
            <span className={`status status-${status}`}>{status}</span>
            <span style={{ color: "#999", float: "right" }}>#{id}</span>
          </h5>
          <p style={{ marginBottom: 0 }}>
            {customer}
            <span style={{ float: "right" }}>
              Started: {startDate.substr(0, 10)}
            </span>
          </p>
        </div>
      );
    });

  const emptyRepairsTable = (
    <div className="repair-row empty-row">No repairs found</div>
  );

  return (
    <React.Fragment>
      <MenuBar />
      <div className="container">
        <ButtonHeader
          title="Repairs"
          buttonLink="/newrepair/customer"
          buttonText="New repair"
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
              }}
              onChange={(e) => {
                setFilters({ ...filters, sortBy: e.target.value });
              }}
              value={filters.sortBy}
            >
              <option value="" disabled hidden>
                ---
              </option>
              <option value="dateStarted">Date started</option>
              <option value="customer">Customer</option>
              <option value="device">Device</option>
              <option value="id">Repair ID #</option>
              <option value="status">Repair status</option>
            </select>
          </div>

          <div className="radio-buttons">
            <div className="active" onClick={toggleStatusFilter}>
              ongoing
            </div>
            <div className="active" onClick={toggleStatusFilter}>
              complete
            </div>
            <div onClick={toggleStatusFilter}>delivered</div>
          </div>
        </div>

        <div>
          {sortedRepairsTable.length ? sortedRepairsTable : emptyRepairsTable}
        </div>
      </div>
    </React.Fragment>
  );
}

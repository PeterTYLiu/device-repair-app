import React, { useState, useEffect } from "react";
import MenuBar from "../components/MenuBar";
import ButtonHeader from "../components/ButtonHeader";

export default function Repairs() {
  const defaultRepair = [
    {
      id: 0,
      startDate: "2000-00-00",
      status: "ongoing",
      Customer: {
        name: "",
      },
      Device: {
        model: "",
      },
    },
  ];

  const [sortedRepairs, setSortedRepairs] = useState(defaultRepair);
  const [filters, setFilters] = useState({
    sortBy: "",
    complete: true,
    ongoing: true,
    delivered: false,
  });

  useEffect(() => {
    (async () => {
      let myShopRepairs = await fetch("/api/repairs");
      if (myShopRepairs.status === 401) return (window.location = "/login");
      if (myShopRepairs.status === 200) {
        let responseBody = await myShopRepairs.json();
        let data = await responseBody.data;
        setSortedRepairs(await data);
        console.log(await data);
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
    .filter(({ status }) => filters[status.toLowerCase()])
    .sort((a, b) => {
      if (a[filters.sortBy] < b[filters.sortBy]) return -1;
      return 1;
    })
    .map((repair) => {
      return (
        <div
          className="repair-row"
          key={repair.id}
          onClick={() => (window.location.href = `/repair/${repair.id}`)}
        >
          <h5>
            {repair.Device.model}
            <span className={`status status-${repair.status}`}>
              {repair.status}
            </span>
            <span style={{ color: "#999", float: "right" }}>#{repair.id}</span>
          </h5>
          <p style={{ marginBottom: 0 }}>
            {repair.Customer.name}
            <span style={{ float: "right" }}>Started: {repair.startDate}</span>
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

import React, { useState } from "react";
import { Link } from "react-router-dom";
import MenuBar from "../components/MenuBar";
import ButtonHeader from "../components/ButtonHeader";
import repairs from "../repairs.json";

export default function Repairs() {
  const unsortedRepairs = Object.values(repairs);
  const [sortedRepairs, setSortedRepairs] = useState(unsortedRepairs);

  let sortedRepairsTable = sortedRepairs.map((sortedRepair) => {
    return (
      <div className="repair-row">
        <h5>
          {sortedRepair.device}
          <span className={`status status-${sortedRepair.status}`}>
            {sortedRepair.status}
          </span>
        </h5>
        <br /> #{sortedRepair.id}
      </div>
    );
  });

  return (
    <React.Fragment>
      <MenuBar />
      <div className="container">
        <ButtonHeader
          title="Repairs"
          buttonLink="/newrepair/customer"
          buttonText="New repair"
        />
        <div className="row">
          <div className="twelve columns">{sortedRepairsTable}</div>
        </div>
      </div>
    </React.Fragment>
  );
}

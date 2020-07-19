import React, { useState } from "react";
import Continue from "../components/Continue";
import { Link } from "react-router-dom";

export default function AddWarranty({ match }) {
  const [warrantyPrice, setWarrantyPrice] = useState("");
  const [warrantyDuration, setWarrantyDuration] = useState(12);

  return (
    <div className="container">
      <h4>Add a Warranty to Repair #{match.params.id}</h4>
      <div className="row">
        <div className="eight columns">
          <p>
            Based on the selected parts for this repair, the approximate
            warranty prices needed to break even are:
          </p>
          <div>
            <h5>
              6 months
              <span className="float-right">$17.25</span>
            </h5>
            <h5>
              12 months
              <span className="float-right">$26.92</span>
            </h5>
            <h5>
              18 months
              <span className="float-right">$38.01</span>
            </h5>
            <a
              href="https://www.xlstat.com/en/solutions/features/ordinary-least-squares-regression-ols"
              target="_blank"
            >
              How are these prices calculated?
            </a>
          </div>
        </div>
      </div>
      <hr></hr>
      <div className="row">
        <div className="six columns">
          <h5>Create warranty</h5>
          <input
            type="number"
            min="0"
            className="u-full-width"
            placeholder="Enter warranty price"
            value={warrantyPrice}
            onChange={(e) => setWarrantyPrice(e.target.value)}
          ></input>
          <div className="radio-buttons">
            <div
              className={warrantyDuration == 6 ? "active" : ""}
              onClick={() => setWarrantyDuration(6)}
            >
              6 months
            </div>
            <div
              className={warrantyDuration == 12 ? "active" : ""}
              onClick={() => setWarrantyDuration(12)}
            >
              12 months
            </div>
            <div
              className={warrantyDuration == 18 ? "active" : ""}
              onClick={() => setWarrantyDuration(18)}
            >
              18 months
            </div>
          </div>
        </div>
      </div>

      <Continue
        nextLink={`/repair/${match.params.id}`}
        nextText="Add warranty"
        backText="back"
        backLink={`/repair/${match.params.id}`}
        allowNext={warrantyPrice ? true : false}
      />
    </div>
  );
}

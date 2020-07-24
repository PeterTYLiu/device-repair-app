import React, { useState, useEffect } from "react";
import Continue from "../components/Continue";

export default function AddWarranty({ match }) {
  const [warrantyPrice, setWarrantyPrice] = useState("");
  const [warrantyDuration, setWarrantyDuration] = useState(12);
  const [repairPartsCost, setRepairPartsCost] = useState(0);

  // Get the part costs from the repair on page load
  useEffect(() => {
    (async () => {
      let repairResponse = await fetch("/api/repairs/" + match.params.id);
      if (repairResponse.status === 401) return (window.location = "/login");
      if (repairResponse.status === 200) {
        let repairBody = await repairResponse.json();
        let repairData = repairBody.data;
        // Set state based on repair data
        setRepairPartsCost(
          repairData.Parts.reduce((total, part) => {
            return total + Number(part.price);
          }, 0)
        );
      }
    })();
  }, []);

  const handleAddWarranty = async () => {
    let currentDate = new Date().getTime();
    let response = await fetch(`/api/repairs/${match.params.id}/addWarranty`, {
      method: "POST",
      body: JSON.stringify({
        endDate: currentDate + warrantyDuration * 2628000000,
        price: warrantyPrice,
        duration: warrantyDuration,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 201)
      return (window.location = `/repair/${match.params.id}`);
  };

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
              <span className="float-right">
                ${(repairPartsCost * 0.08).toFixed(2)}
              </span>
            </h5>
            <h5>
              12 months
              <span className="float-right">
                ${(repairPartsCost * 0.15).toFixed(2)}
              </span>
            </h5>
            <h5>
              18 months
              <span className="float-right">
                ${(repairPartsCost * 0.28).toFixed(2)}
              </span>
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
              className={warrantyDuration === 6 ? "active" : ""}
              onClick={() => setWarrantyDuration(6)}
            >
              6 months
            </div>
            <div
              className={warrantyDuration === 12 ? "active" : ""}
              onClick={() => setWarrantyDuration(12)}
            >
              12 months
            </div>
            <div
              className={warrantyDuration === 18 ? "active" : ""}
              onClick={() => setWarrantyDuration(18)}
            >
              18 months
            </div>
          </div>
        </div>
      </div>

      <Continue
        nextText="Add warranty"
        backText="back"
        backLink={`/repair/${match.params.id}`}
        allowNext={warrantyPrice ? true : false}
        onNext={handleAddWarranty}
      />
    </div>
  );
}

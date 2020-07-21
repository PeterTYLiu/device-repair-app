import React from "react";
import MenuBar from "../components/MenuBar";
import { Link } from "react-router-dom";

export default function Part({ match }) {
  const unsortedBatches = [
    {
      id: 157,
      name: "iPhone Xs display and digitizer (LCD)",
      manufacturer: "Shenzhen Wholesale Components ltd.",
      device: "iPhone Xs",
      deviceId: 48,
      dateAdded: "2020-05-29T18:25:43-05:00",
      cost: 32.15,
      failureRate: 8.5,
    },
    {
      id: 98,
      name: "iPhone Xs display and digitizer (LCD)",
      device: "iPhone Xs",
      deviceId: 48,
      dateAdded: "2019-04-12T18:25:43-05:00",
      manufacturer: "Shenzhen Wholesale Components ltd.",
      cost: 33.16,
      failureRate: 11.1,
    },
    {
      id: 34,
      name: "iPhone Xs display and digitizer (LCD)",
      device: "iPhone Xs",
      deviceId: 48,
      dateAdded: "2016-11-25T18:25:43-05:00",
      manufacturer: "Shenzhen Wholesale Components ltd.",
      cost: 32.48,
      failureRate: 14.2,
    },
  ];

  let batchesTable = unsortedBatches
    .sort((a, b) => {
      if (a.dateAdded > b.dateAdded) return -1;
      return 1;
    })
    .map(({ cost, dateAdded, failureRate, id }) => {
      return (
        <div className="table-row" key={id}>
          <h5>
            {dateAdded.substr(0, 10)}
            <span style={{ color: "#999", float: "right" }}>#{id}</span>
          </h5>
          <p style={{ marginBottom: 0 }}>
            ${cost} ea.
            <span style={{ float: "right" }}>
              {failureRate}% fail within one year
            </span>
          </p>
        </div>
      );
    });

  return (
    <React.Fragment>
      <MenuBar />
      <div className="container">
        <header>
          <h4>{unsortedBatches[0].name}</h4>
          <h6>{unsortedBatches[0].manufacturer}</h6>
          <h6>${unsortedBatches[0].cost} each (latest batch)</h6>
        </header>
        <hr></hr>
        <div className="row">
          <div className="eight columns">
            <div id="statistics">
              <div>
                <h4>78</h4>
                <h5>Uses</h5>
              </div>
              <div>
                <h4>29</h4>
                <h5>Failures</h5>
              </div>
              <div>
                <h4>17.3%</h4>
                <h5>Fail within one year</h5>
              </div>
            </div>
            <p>
              Based on these statistics and our predictive algorithm, the
              approximate warranty prices needed to break even are:
            </p>
            <div>
              <h5>
                6 months
                <span className="float-right">$3.25</span>
              </h5>
              <h5>
                12 months
                <span className="float-right">$5.57</span>
              </h5>
              <h5>
                18 months
                <span className="float-right">$9.21</span>
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
          <div className="eight columns">
            <div>
              <h5 style={{ display: "inline-block", marginBottom: "2rem" }}>
                Batches
              </h5>
              <Link
                style={{ float: "right" }}
                to="/addpart"
                className="button button-primary"
              >
                Add batch
              </Link>
            </div>
            <div>{batchesTable}</div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

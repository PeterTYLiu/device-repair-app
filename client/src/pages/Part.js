import React, { useEffect, useState } from "react";
import MenuBar from "../components/MenuBar";
import { Link } from "react-router-dom";

export default function Part({ match }) {
  const [batches, setBatches] = useState([]);
  const [part, setPart] = useState({ name: "", supplierName: "", price: 0 });
  const [stats, setStats] = useState({
    totalInstalls: 0,
    totalFailuresInLastYear: 0,
    percentFailureLastYear: 0,
  });

  // Get the part on page load
  useEffect(() => {
    (async () => {
      let partResponse = await fetch(`/api/parts/${match.params.id}`);
      if (partResponse.status === 401) return (window.location = "/login");
      if (partResponse.status === 200) {
        let partBody = await partResponse.json();
        setPart(partBody.data);
        console.log(partBody);
      }
    })();
  }, []);

  // Get the batches on part load
  useEffect(() => {
    (async () => {
      let batchesResponse = await fetch(`/api/parts/batches`, {
        method: "POST",
        body: JSON.stringify({
          partName: part.name,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (batchesResponse.status === 401) return (window.location = "/login");
      if (batchesResponse.status === 200) {
        let batchesBody = await batchesResponse.json();
        setBatches(batchesBody.data);
        setStats(batchesBody.stats);
        console.log(batchesBody);
      }
    })();
  }, [part]);

  let batchesTable = batches
    // .sort((a, b) => {
    //   if (Date.parse(a.createdAt) > Date.parse(b.createdAt)) return -1;
    //   return 1;
    // })
    .map(({ price, createdAt, id }) => {
      return (
        <div className="table-row" key={id}>
          <h5>
            {createdAt.substr(0, 10)}
            <span style={{ color: "#999", float: "right" }}>#{id}</span>
          </h5>
          <p style={{ marginBottom: 0 }}>${price} ea.</p>
        </div>
      );
    });

  return (
    <React.Fragment>
      <MenuBar />
      <div className="container">
        <header>
          <h4>{part.name}</h4>
          <h6>{part.supplierName}</h6>
          <h6>${part.price} each (latest batch)</h6>
        </header>
        <hr></hr>
        <div className="row">
          <div className="eight columns">
            <div id="statistics">
              <div>
                <h4>{stats.totalInstalls ? stats.totalInstalls : 0}</h4>
                <h5>Uses</h5>
              </div>
              <div>
                <h4>
                  {stats.totalFailuresInLastYear
                    ? stats.totalFailuresInLastYear
                    : 0}
                </h4>
                <h5>Failures in the past year</h5>
              </div>
              <div>
                <h4>
                  {stats.percentFailureLastYear
                    ? stats.percentFailureLastYear.toFixed(1)
                    : 0}
                  %
                </h4>
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
                <span className="float-right">
                  $
                  {(
                    (stats.percentFailureLastYear * part.price * 0.7) /
                    100
                  ).toFixed(2)}
                </span>
              </h5>
              <h5>
                12 months
                <span className="float-right">
                  $
                  {((stats.percentFailureLastYear * part.price) / 100).toFixed(
                    2
                  )}
                </span>
              </h5>
              <h5>
                18 months
                <span className="float-right">
                  $
                  {(
                    (stats.percentFailureLastYear * part.price * 1.5) /
                    100
                  ).toFixed(2)}
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

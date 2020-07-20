import React, { useState } from "react";
import Continue from "../components/Continue";

export default function ClaimWarranty({ match }) {
  const [claimedParts, setClaimedParts] = useState([]);

  function toggleFromClaimedParts(e) {
    let partId = e.target.value;
    let foo = [...claimedParts];

    if (foo.includes(partId)) {
      foo.splice(foo.indexOf(partId), 1);
    } else {
      foo.push(partId);
    }
    setClaimedParts(foo);
    console.log(claimedParts);
    console.log("length: " + claimedParts.length);
    console.log(claimedParts.length > 0 ? true : false);
  }

  return (
    <div className="container">
      <h4>Warranty Claim for Repair #{match.params.id}</h4>
      <div className="row">
        <div className="eight columns">
          <p>Select the component(s) that need to be replaced</p>
        </div>
      </div>
      <div className="checkbox-group">
        <div>
          <input type="checkbox" value="11" onClick={toggleFromClaimedParts} />
          <label className="checkbox-label">iPhone Xs LCD display</label>
        </div>
        <div>
          <input type="checkbox" value="22" onClick={toggleFromClaimedParts} />
          <label className="checkbox-label">iPhone Xs back glass</label>
        </div>
        <div>
          <input type="checkbox" value="33" onClick={toggleFromClaimedParts} />
          <label className="checkbox-label">iPhone Xs battery</label>
        </div>
      </div>

      <Continue
        nextLink={`/repair/${match.params.id}`}
        nextText="Initiate claim"
        backText="back"
        backLink={`/repair/${match.params.id}`}
        allowNext={claimedParts.length}
      />
    </div>
  );
}

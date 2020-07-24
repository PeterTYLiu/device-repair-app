import React, { useState, useEffect } from "react";
import Continue from "../components/Continue";

export default function ClaimWarranty({ match }) {
  const [claimedParts, setClaimedParts] = useState([]);
  const [repairParts, setRepairParts] = useState([]);

  useEffect(() => {
    (async () => {
      let repairResponse = await fetch("/api/repairs/" + match.params.id);
      if (repairResponse.status === 401) return (window.location = "/login");
      if (repairResponse.status === 200) {
        let repairBody = await repairResponse.json();
        let repairData = repairBody.data;
        // Set state based on repair data
        setRepairParts(repairData.Parts);
      }
    })();
  }, []);

  function toggleFromClaimedParts(e) {
    let partId = e.target.value;
    let foo = [...claimedParts];

    if (foo.includes(partId)) {
      foo.splice(foo.indexOf(partId), 1);
    } else {
      foo.push(partId);
    }
    setClaimedParts(foo);
  }

  // const handleClaimWarranty = async () => {
  //   let setToOngoingResponse = await fetch(
  //     `/api/repairs/${match.params.id}/updateStatus`,
  //     {
  //       method: "PATCH",
  //       body: JSON.stringify({
  //         status: "ongoing",
  //       }),
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     }
  //   );
  //   if (setToOngoingResponse.status === 200) {
  //     let setClaimedWarrantyResponse = await fetch(
  //       `/api/repairs/${match.params.id}/claimWarranty`,
  //       {
  //         method: "PATCH",
  //         body: JSON.stringify({
  //           partsToBeReplaced: claimedParts,
  //         }),
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     if (setClaimedWarrantyResponse.status === 200)
  //       return (window.location = `/repairs/${match.params.id}`);
  //     alert("Something went wrong!");
  //   }
  // };

  const handleClaimWarranty = async () => {
    let setClaimedWarrantyResponse = await fetch(
      `/api/repairs/${match.params.id}/claimWarranty`,
      {
        method: "PATCH",
        body: JSON.stringify({
          partsToBeReplaced: claimedParts,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (setClaimedWarrantyResponse.status === 200) {
      let setToOngoingResponse = await fetch(
        `/api/repairs/${match.params.id}/updateStatus`,
        {
          method: "PATCH",
          body: JSON.stringify({
            status: "ongoing",
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (setToOngoingResponse.status === 200)
        return (window.location = `/repair/${match.params.id}`);
      alert("Something went wrong!");
    }
  };

  let partsCheckboxes = repairParts.map((part) => {
    return (
      <div key={part.id}>
        <input
          type="checkbox"
          value={part.id}
          onClick={toggleFromClaimedParts}
        />
        <label className="checkbox-label">{part.name}</label>
      </div>
    );
  });

  return (
    <div className="container">
      <h4>Warranty Claim for Repair #{match.params.id}</h4>
      <div className="row">
        <div className="eight columns">
          <p>Select the component(s) that need to be replaced</p>
        </div>
      </div>
      <div className="checkbox-group">{partsCheckboxes}</div>

      <Continue
        nextText="Initiate claim"
        backText="back"
        backLink={`/repair/${match.params.id}`}
        allowNext={claimedParts.length}
        onNext={handleClaimWarranty}
      />
    </div>
  );
}

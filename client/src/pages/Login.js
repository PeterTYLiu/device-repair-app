import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Home({ match }) {
  const [mode, setMode] = useState(match.params.mode);
  console.log(mode);

  return (
    <div className="container">
      <div className="row">
        <div className="seven columns">
          <h1>Our app is great!</h1>
          <h3>This is a subtitle</h3>
        </div>
        <div className="five columns">
          <div className="row">
            <div className="two columns"></div>
            <div className="eight columns" id="login">
              This is the signup form
            </div>
            <div className="two columns"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

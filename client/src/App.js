import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SelectDevice from "./pages/SelectDevice";
import SelectCustomer from "./pages/SelectCustomer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Repair from "./pages/Repair";
import Customer from "./pages/Customer";
import Customers from "./pages/Customers";
import Repairs from "./pages/Repairs";
import SelectPart from "./pages/SelectPart";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/login/:mode" component={Login} />
        <Route exact path="/repairs" component={Repairs} />
        <Route exact path="/newrepair/customer" component={SelectCustomer} />
        <Route exact path="/newrepair/device" component={SelectDevice} />
        <Route exact path="/repair/:id" component={Repair} />
        <Route exact path="/customer/:id" component={Customer} />
        <Route exact path="/customers" component={Customers} />
        <Route exact path="/repair/:id/selectpart" component={SelectPart} />
      </Switch>
    </Router>
  );
}

export default App;

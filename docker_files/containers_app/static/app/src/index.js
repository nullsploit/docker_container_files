import React from "react";
import ReactDOM from "react-dom";
import "./i18n/config";
import ContainerApp from "./ContainerApp";

if (document.getElementById("container_app")) {
  ReactDOM.render(<ContainerApp />, document.getElementById("container_app"));
}
else {
  console.log("Could not load app, please contact support.");
}
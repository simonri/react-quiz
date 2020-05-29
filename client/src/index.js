import React from "react";
import ReactDOM from "react-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./index.scss";

import App from "./app";

const Root = () => <App />;

window.addEventListener("storage", (event) => {
  if (event.key === "logout") {
    window.location = "/login";
  }
});

ReactDOM.render(<Root />, document.getElementById("root"));

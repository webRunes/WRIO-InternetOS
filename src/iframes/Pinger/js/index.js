import React from "react";
import ReactDOM from "react-dom";
require("./iframeresize"); // require iframe resizer middleware

import Container from "./components/container.js";

ReactDOM.render(<Container />, document.getElementById("frame_container"));
document.getElementById("loadingInd").style = "display:none;";

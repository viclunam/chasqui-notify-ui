import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import GlobalContextProvider from "./context/GlobalContextProvider";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <GlobalContextProvider>
    <App />
  </GlobalContextProvider>
);

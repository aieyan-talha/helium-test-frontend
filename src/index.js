import React from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";

import "./index.scss";
import App from "./App";
import { AuthContextProvider } from "./context";

axios.defaults.baseURL = "http://localhost:4100";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </React.StrictMode>
);

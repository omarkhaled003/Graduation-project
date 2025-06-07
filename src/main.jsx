import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { UserInfoProvider } from "./Context/User/UserInfoContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserInfoProvider>
      <App />
    </UserInfoProvider>
  </React.StrictMode>
);

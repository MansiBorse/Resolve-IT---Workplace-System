import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // ✅ VERY IMPORTANT
import { GrievanceProvider } from "./context/GrievanceContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GrievanceProvider>
      <App />
    </GrievanceProvider>
  </React.StrictMode>,
);

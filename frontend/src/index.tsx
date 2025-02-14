import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";  // ここで Tailwind を適用
import App from "./App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

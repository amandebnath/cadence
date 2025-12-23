// src/main.jsx
// Entry point for the Vite + React app.
// - Imports global CSS (theme + transitions) so they apply app-wide.
// - Renders the <App /> component into the root DOM node.

import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// Import global styles (these files we created earlier)
import "./styles/globals.css";
import "./styles/transitions.css";

// Optional: import index.css if Vite created one; safe even if empty
import "./index.css";

// Mount the React app
const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

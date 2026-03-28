/**
 * Application Entry Point
 * OWNER: Muditha (Frontend Developer)
 *
 * TODO (Muditha):
 * 1. This is the React entry point. It wraps the entire app in:
 *    - BrowserRouter (for client-side routing)
 *    - AuthProvider (for authentication state)
 * 2. Consider adding an ErrorBoundary component around <App /> for graceful error handling
 * 3. Consider adding React.StrictMode in development for catching common bugs
 */
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

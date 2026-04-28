import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import API_context from "./context/provider/APIProvider.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")).render(
  <>
    <API_context>
      <GoogleOAuthProvider clientId="135828211132-a06rnbnc9h3elm8qehjr02pg8h9m20fh.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>
    </API_context>
  </>,
);

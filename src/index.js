import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { FrigadeProvider } from "@frigade/react";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <FrigadeProvider
      publicApiKey="api_public_R9LR2H8xvtKrYfbmWFKE6qeZo0ROTieHnY9yQVoRI0WmqV7rJqWhHEDp3IC21ia3"
      userId="user1"
      config={{
        defaultAppearance: {
          theme: {
            // colorText: "#3d3d3d",
            // colorTextSecondary: "#494949",
            // colorTextOnPrimaryBackground: "#fff",
            colorPrimary: "#4D61FF",
            // colorBorder: "#E2E2E2",
          },
        },
      }}
    >
      <App />
    </FrigadeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

import "@seed-design/css/base.css";
import "./styles.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { PostHogProvider } from "posthog-js/react";
import App from "./App";

const options = {
  api_host: import.meta.env.VITE_POSTHOG_HOST,
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PostHogProvider apiKey={import.meta.env.VITE_POSTHOG_API_KEY} options={options}>
      <App />
    </PostHogProvider>
  </React.StrictMode>,
);

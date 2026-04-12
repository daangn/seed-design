import "@seed-design/stylesheet/global.css";
import "@seed-design/css/all.css";
import { createRoot } from "react-dom/client";
import { App } from "./App";

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<App />);
}

import { SeedText } from "@seed-design/elements";

if (!customElements.get("seed-text")) {
  customElements.define("seed-text", SeedText);
}

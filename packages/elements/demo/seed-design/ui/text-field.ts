import { SeedTextField } from "@seed-design/elements";

if (!customElements.get("seed-text-field")) {
  customElements.define("seed-text-field", SeedTextField);
}

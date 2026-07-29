import { SeedSwitch } from "@seed-design/elements";

if (!customElements.get("seed-switch")) {
  customElements.define("seed-switch", SeedSwitch);
}

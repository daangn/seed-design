import { SeedSwitch } from "../components/Switch/SeedSwitch";

if (!customElements.get("seed-switch")) {
  customElements.define("seed-switch", SeedSwitch);
}

declare global {
  interface HTMLElementTagNameMap {
    "seed-switch": SeedSwitch;
  }
}

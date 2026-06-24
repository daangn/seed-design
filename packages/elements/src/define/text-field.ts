import { SeedTextField } from "../components/TextField/SeedTextField";

if (!customElements.get("seed-text-field")) {
  customElements.define("seed-text-field", SeedTextField);
}

declare global {
  interface HTMLElementTagNameMap {
    "seed-text-field": SeedTextField;
  }
}

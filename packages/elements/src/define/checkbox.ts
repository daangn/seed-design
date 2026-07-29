import { SeedCheckbox } from "../components/Checkbox/SeedCheckbox";

if (!customElements.get("seed-checkbox")) {
  customElements.define("seed-checkbox", SeedCheckbox);
}

declare global {
  interface HTMLElementTagNameMap {
    "seed-checkbox": SeedCheckbox;
  }
}

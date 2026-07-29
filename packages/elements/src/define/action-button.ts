import { SeedActionButton } from "../components/ActionButton/SeedActionButton";

if (!customElements.get("seed-action-button")) {
  customElements.define("seed-action-button", SeedActionButton);
}

declare global {
  interface HTMLElementTagNameMap {
    "seed-action-button": SeedActionButton;
  }
}

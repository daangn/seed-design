import { SeedText } from "../components/Text/SeedText";

if (!customElements.get("seed-text")) {
  customElements.define("seed-text", SeedText);
}

declare global {
  interface HTMLElementTagNameMap {
    "seed-text": SeedText;
  }
}

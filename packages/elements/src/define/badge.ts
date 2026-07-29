import { SeedBadge } from "../components/Badge/SeedBadge";

if (!customElements.get("seed-badge")) {
  customElements.define("seed-badge", SeedBadge);
}

declare global {
  interface HTMLElementTagNameMap {
    "seed-badge": SeedBadge;
  }
}

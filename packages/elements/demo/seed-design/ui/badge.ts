import { SeedBadge } from "@seed-design/elements";

if (!customElements.get("seed-badge")) {
  customElements.define("seed-badge", SeedBadge);
}

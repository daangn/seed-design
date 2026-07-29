import { SeedSkeleton } from "@seed-design/elements";

if (!customElements.get("seed-skeleton")) {
  customElements.define("seed-skeleton", SeedSkeleton);
}

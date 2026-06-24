import { SeedSkeleton } from "../components/Skeleton/SeedSkeleton";

if (!customElements.get("seed-skeleton")) {
  customElements.define("seed-skeleton", SeedSkeleton);
}

declare global {
  interface HTMLElementTagNameMap {
    "seed-skeleton": SeedSkeleton;
  }
}

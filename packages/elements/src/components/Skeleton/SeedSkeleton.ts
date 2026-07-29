import { skeleton } from "@seed-design/css/recipes/skeleton";
import type { SkeletonVariantProps } from "@seed-design/css/recipes/skeleton";
import { LightElement } from "../../internals/light-element";

type Radius = NonNullable<SkeletonVariantProps["radius"]>;
type Tone = NonNullable<SkeletonVariantProps["tone"]>;

/**
 * `<seed-skeleton>` — loading placeholder.
 *
 * Non-interactive presentational pattern: the `skeleton` recipe className is
 * applied to the host; author children (if any) are left untouched.
 */
export class SeedSkeleton extends LightElement {
  static properties = {
    radius: { type: String },
    tone: { type: String },
  };

  declare radius: Radius;
  declare tone: Tone;

  constructor() {
    super();
    this.radius = "8";
    this.tone = "neutral";
  }

  protected willUpdate() {
    this.setAttribute("class", skeleton({ radius: this.radius, tone: this.tone }));
  }
}

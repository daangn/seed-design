import { IconHandPointUpLine } from "@karrotmarket/react-monochrome-icon";
import { Icon, ScaleFeedback, Skeleton } from "@seed-design/react";
import { clsx } from "cn";

const SPECIMENS = [
  { label: "Scale", scope: "self", marginInset: false },
  { label: "Content Scale", scope: "content", marginInset: false },
  { label: "Content Scale + Margin Inset", scope: "content", marginInset: true },
] as const satisfies ReadonlyArray<{
  label: string;
  scope: "self" | "content";
  marginInset: boolean;
}>;

/**
 * Marks the region a box occupies, drawn as an overlay so it costs the box no layout. Both
 * boxes carry one, and they are what tells the specimens apart: Scale moves the outer marker
 * off the card wall, while Content Scale leaves it there and moves only the inner one.
 *
 * Square, so it never reads as the surface it sits over — a region is a rectangle, and only
 * the background has a radius.
 */
const REGION_CLASS =
  "pointer-events-none absolute inset-0 border border-dashed border-palette-gray-500";

/**
 * `bg.transparent-pressed`, the token List Item actually uses. At 3% black it is nearly
 * invisible at this size, which is why every specimen is shown twice: the left card is what a
 * user sees, the right one is the same card with its boxes marked.
 *
 * The radius is `10px` in all three — what the margin inset changes is where the surface sits,
 * not how it is drawn.
 */
const SURFACE_CLASS = clsx(
  "absolute inset-0 rounded-r2_5 bg-bg-transparent-pressed opacity-0 group-active:opacity-100",
  "transition-[opacity,inset-inline] duration-color-transition easing-easing",
);

/**
 * List Item's treatment: the surface pulls in by an authored `6px`. The card's `6px` vertical
 * padding makes that uniform on all four sides, and 6 + 10 is the card's own `16px` corner, so
 * the two curves share a centre. Scale opens a gap too — this is the same gap, designed.
 */
const MARGIN_INSET_CLASS = "group-active:inset-x-(--seed-dimension-x1_5)";

/**
 * The padding rides on the scaled box rather than on the row, so Content Scale shrinks the
 * content away from a surface that stays put — the order iOS gets from
 * `.padding().scaleEffect().background()`.
 */
const CONTENT_CLASS = "relative flex items-center justify-between gap-x3 p-x3";

const SCALE_CLASS = clsx(
  "[transition:var(--seed-feedback-scale-transition)]",
  "group-active:scale-(--seed-feedback-scale)",
);

/**
 * 200px wide against a 44px row, so `basis` is the width term (49.5) with room to spare — the
 * horizontal shrink stays at its 4px ceiling even if the row grows with font scaling, and 4px is
 * a larger share of the card than a wider one would give. Widening buys nothing here:
 * `width / (width / 4)` is 4 at every width, so only the share changes.
 */
function Card({
  scope,
  marginInset,
  annotated,
}: Omit<(typeof SPECIMENS)[number], "label"> & { annotated: boolean }) {
  return (
    <div className="w-[200px] shrink-0 rounded-r4 border border-stroke-neutral-muted bg-bg-layer-default py-x1_5">
      <ScaleFeedback>
        <div className={clsx("relative", scope === "self" && SCALE_CLASS)}>
          <div className={clsx(SURFACE_CLASS, marginInset && MARGIN_INSET_CLASS)} />

          <div className={clsx(CONTENT_CLASS, scope === "content" && SCALE_CLASS)}>
            {annotated && <div className={REGION_CLASS} />}
            <Skeleton radius="8" width="x16" height="x2" />
            <Icon svg={<IconHandPointUpLine />} size="x5" color="fg.neutralMuted" />
          </div>

          {annotated && <div className={REGION_CLASS} />}
        </div>
      </ScaleFeedback>

      <div className={CONTENT_CLASS}>
        <Skeleton radius="8" width="x16" height="x2" />
        <Skeleton radius="8" width="x5" height="x5" />
      </div>
    </div>
  );
}

function Specimen({ label, ...variant }: (typeof SPECIMENS)[number]) {
  return (
    <div className="flex flex-col gap-x2">
      <span className="t2-bold text-fg-neutral-subtle">{label}</span>

      <div className="flex gap-x4">
        <Card {...variant} annotated={false} />
        <Card {...variant} annotated />
      </div>
    </div>
  );
}

export default function ScaleFeedbackScaleVsContentScale() {
  return (
    <button type="button" className="group flex cursor-default flex-col gap-x6 text-left">
      {SPECIMENS.map((specimen) => (
        <Specimen key={specimen.label} {...specimen} />
      ))}
    </button>
  );
}

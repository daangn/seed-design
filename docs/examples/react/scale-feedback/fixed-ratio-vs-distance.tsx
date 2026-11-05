import { IconHandPointUpLine } from "@karrotmarket/react-monochrome-icon";
import { Icon, ScaleFeedback } from "@seed-design/react";
import clsx from "clsx";

const SPECIMENS = [
  { widthClass: "w-[80px]", label: "80 × 52" },
  { widthClass: "w-[160px]", label: "160 × 52" },
  { widthClass: "w-[343px]", label: "343 × 52" },
  { widthClass: "flex-1", label: "전체 폭 × 52" },
] as const satisfies ReadonlyArray<{ widthClass: string; label: string }>;

/**
 * Filled, so the band the plate uncovers as it shrinks is the visible thing rather than a
 * hairline gap. The dashed edge marks where the plate started.
 */
const ORIGINAL_BOUNDS_CLASS =
  "absolute inset-0 rounded-r2 border border-dashed border-palette-green-400 bg-palette-green-600";

/**
 * Plain plates rather than anything button-shaped: the top row of every pair is a
 * counter-example no SEED component implements, and a specimen that reads as Action
 * Button would put the rule itself in doubt.
 */
const PLATE_CLASS =
  "relative flex size-full items-center justify-center rounded-r2 bg-palette-green-200 [transition:var(--seed-feedback-scale-transition)]";

function Plate() {
  return <Icon svg={<IconHandPointUpLine />} size="x4_5" color="palette.green700" />;
}

export default function ScaleFeedbackFixedRatioVsDistance() {
  return (
    <div className="w-full">
      <div className="flex w-max min-w-full flex-col gap-x6">
        {SPECIMENS.map(({ widthClass, label }) => (
          <button
            key={label}
            type="button"
            className="group flex cursor-default flex-col items-start gap-x2"
          >
            <span className="t2-bold text-fg-neutral-subtle">{label}</span>

            <div className="flex w-full flex-col gap-x1_5">
              <div className="flex items-center gap-x3">
                <span className="w-x16 shrink-0 t2-regular text-fg-neutral-muted">고정 0.98</span>
                <div className={clsx("relative h-[52px]", widthClass)}>
                  <div className={ORIGINAL_BOUNDS_CLASS} />
                  <div className={clsx(PLATE_CLASS, "motion-safe:group-active:scale-[0.98]")}>
                    <Plate />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-x3">
                <span className="w-x16 shrink-0 t2-regular text-fg-neutral-muted">SEED</span>
                <div className={clsx("relative h-[52px]", widthClass)}>
                  <div className={ORIGINAL_BOUNDS_CLASS} />
                  <ScaleFeedback>
                    <div
                      className={clsx(PLATE_CLASS, "group-active:scale-(--seed-feedback-scale)")}
                    >
                      <Plate />
                    </div>
                  </ScaleFeedback>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

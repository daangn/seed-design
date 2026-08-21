import { VStack } from "@seed-design/react";
import { useActivityZIndexBase } from "@seed-design/stackflow";
import { type StaticActivityComponentType, useActivity, useFlow } from "@stackflow/react/future";
import * as React from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
} from "seed-design/ui/bottom-sheet";
import { TextField, TextFieldInput, TextFieldTextarea } from "seed-design/ui/text-field";

declare module "@stackflow/config" {
  interface Register {
    ActivityBottomSheetKeyboardPlayground: {};
  }
}

/**
 * Playground for the keyboard reposition logic in `useDrawer`. Every knob below maps to a branch
 * the reposition code takes, and the readout shows the numbers it derives its decisions from, so a
 * regression is visible on-device without attaching a debugger.
 *
 * Reading the panel:
 *
 * - `bottom` is the lift the drawer applies; it should settle at `innerH - vvH - vvTop`.
 * - `height` should stay at the sheet's natural height until the sheet no longer fits, then clamp.
 *   It must never grow past that, and it must come back when the keyboard closes.
 * - `visual top` is where the sheet's top edge actually sits on screen. Negative means the sheet is
 *   cut off above the visible area.
 * - `visual bottom` should land on `vvH` — the sheet resting exactly on the keyboard.
 */

const CONTENT_MODES = ["short", "tall", "scroll"] as const;
const FIELD_MODES = ["single", "multiple", "textarea", "editable", "no-keyboard"] as const;

type ContentMode = (typeof CONTENT_MODES)[number];
type FieldMode = (typeof FIELD_MODES)[number];

const CONTENT_HINT = {
  short: "Fits with room to spare — height must not change at all.",
  tall: "Taller than the strip left above the keyboard — height must clamp, not overflow.",
  scroll: "Fixed-height scrollable body — the body scrolls, the sheet itself must not resize.",
} as const satisfies Record<ContentMode, string>;

const FIELD_HINT = {
  single: "Baseline.",
  multiple: "Move between fields — the keyboard stays up, so the sheet must not drop.",
  textarea: "Content grows while open; natural height is captured once, so watch for drift.",
  editable: "contentEditable — exercises the third branch of the drawer's input check.",
  "no-keyboard": "Checkbox and button open no keyboard — the sheet must not move.",
} as const satisfies Record<FieldMode, string>;

interface Metrics {
  innerH: number;
  vvH: number;
  vvTop: number;
  scale: number;
  bottom: string;
  height: string;
  visualTop: number;
  visualBottom: number;
}

function readMetrics(el: HTMLElement | null): Metrics | null {
  const vv = window.visualViewport;
  if (!el || !vv) return null;

  const rect = el.getBoundingClientRect();
  return {
    innerH: window.innerHeight,
    vvH: Math.round(vv.height),
    vvTop: Math.round(vv.offsetTop),
    scale: Math.round(vv.scale * 100) / 100,
    bottom: el.style.bottom || "—",
    height: el.style.height || "—",
    visualTop: Math.round(rect.top - vv.offsetTop),
    visualBottom: Math.round(rect.bottom - vv.offsetTop),
  };
}

/**
 * Polls per frame rather than listening for viewport events. The sheet also moves under a CSS
 * transition, which produces no events of its own until it ends, and a readout that lags the thing
 * it is measuring is worse than no readout. Re-rendering is gated on the numbers actually changing,
 * so a settled sheet costs one rect read per frame and nothing else.
 */
function useMetrics(open: boolean) {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [metrics, setMetrics] = React.useState<Metrics | null>(null);

  React.useEffect(() => {
    if (!open) return;

    let frame = 0;
    const tick = () => {
      const next = readMetrics(contentRef.current);
      setMetrics((prev) => {
        if (!next) return prev;
        if (prev && (Object.keys(next) as (keyof Metrics)[]).every((k) => prev[k] === next[k])) {
          return prev;
        }
        return next;
      });
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [open]);

  return { contentRef, metrics };
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <VStack gap="x1">
      <span style={{ fontSize: 12, opacity: 0.6 }}>{label}</span>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{children}</div>
    </VStack>
  );
}

function Choice<T extends string>({
  values,
  value,
  onChange,
}: {
  values: readonly T[];
  value: T;
  onChange: (next: T) => void;
}) {
  return (
    <>
      {values.map((item) => (
        <ActionButton
          key={item}
          size="xsmall"
          variant={item === value ? "neutralSolid" : "neutralWeak"}
          onClick={() => onChange(item)}
        >
          {item}
        </ActionButton>
      ))}
    </>
  );
}

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <ActionButton
      size="xsmall"
      variant={value ? "neutralSolid" : "neutralWeak"}
      onClick={() => onChange(!value)}
    >
      {label}: {value ? "on" : "off"}
    </ActionButton>
  );
}

function Readout({ metrics }: { metrics: Metrics | null }) {
  if (!metrics) return null;

  // `bottom` should equal this; a mismatch is the pan-compensation regression.
  const expectedBottom = Math.max(metrics.innerH - metrics.vvH - metrics.vvTop, 0);
  // Both checks below only mean anything once something is covering the viewport. With the keyboard
  // down the sheet is meant to rest on the bottom of the screen, not on a keyboard that isn't there.
  const keyboardUp = metrics.innerH - metrics.vvH - metrics.vvTop > 60 || metrics.vvTop > 0;
  const clipped = metrics.visualTop < 0;
  const restingOnKeyboard = Math.abs(metrics.visualBottom - metrics.vvH) <= 1;

  return (
    <div
      style={{
        fontFamily: "ui-monospace, monospace",
        fontSize: 11,
        lineHeight: 1.7,
        padding: 8,
        borderRadius: 8,
        background: "rgba(127,127,127,0.14)",
      }}
    >
      <div>
        innerH {metrics.innerH} · vvH {metrics.vvH} · vvTop {metrics.vvTop} · scale {metrics.scale}
      </div>
      <div>
        bottom {metrics.bottom} (expect {expectedBottom}px) · height {metrics.height}
      </div>
      <div>
        visual top {metrics.visualTop} {clipped ? "⚠ CLIPPED" : "ok"} · visual bottom{" "}
        {metrics.visualBottom}{" "}
        {!keyboardUp ? "(keyboard down)" : restingOnKeyboard ? "ok" : "⚠ NOT ON KEYBOARD"}
      </div>
    </div>
  );
}

function Fields({ mode }: { mode: FieldMode }) {
  switch (mode) {
    case "multiple":
      return (
        <VStack gap="x3">
          <TextField name="first" label="First">
            <TextFieldInput placeholder="Tap here, then jump to the next" />
          </TextField>
          <TextField name="second" label="Second">
            <TextFieldInput placeholder="Keyboard should stay up" />
          </TextField>
        </VStack>
      );

    case "textarea":
      return (
        <TextField name="memo" label="Memo">
          <TextFieldTextarea placeholder="Type several lines and watch the height" />
        </TextField>
      );

    case "editable":
      return (
        <div
          contentEditable
          suppressContentEditableWarning
          style={{ padding: 12, minHeight: 52, borderRadius: 8, border: "1px solid currentColor" }}
        >
          contentEditable — tap to focus
        </div>
      );

    case "no-keyboard":
      return (
        <VStack gap="x3">
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input type="checkbox" /> checkbox (no keyboard)
          </label>
          <input type="button" value="button input (no keyboard)" />
        </VStack>
      );

    default:
      return (
        <TextField name="name" label="Name">
          <TextFieldInput placeholder="Tap to raise the keyboard" />
        </TextField>
      );
  }
}

const ActivityBottomSheetKeyboardPlayground: StaticActivityComponentType<
  "ActivityBottomSheetKeyboardPlayground"
> = () => {
  const { pop } = useFlow();
  const activity = useActivity();

  const [contentMode, setContentMode] = React.useState<ContentMode>("short");
  const [fieldMode, setFieldMode] = React.useState<FieldMode>("single");
  const [fixed, setFixed] = React.useState(false);
  const [withSnapPoints, setWithSnapPoints] = React.useState(false);
  const [repositionInputs, setRepositionInputs] = React.useState(true);

  const { contentRef, metrics } = useMetrics(activity.isActive);

  // Remounting on every structural change keeps the drawer from carrying a natural height it
  // captured under different settings, which would make the readout lie.
  const instanceKey = `${contentMode}-${fieldMode}-${fixed}-${withSnapPoints}-${repositionInputs}`;

  return (
    <BottomSheetRoot
      key={instanceKey}
      open={activity.isActive}
      onOpenChange={(open) => !open && pop()}
      fixed={fixed}
      repositionInputs={repositionInputs}
      {...(withSnapPoints && { snapPoints: ["360px", 1] })}
    >
      <BottomSheetContent
        ref={contentRef}
        showHandle
        showCloseButton={false}
        title="Keyboard playground"
        layerIndex={useActivityZIndexBase()}
        // The playground deliberately has a `tall` mode. Cap the sheet itself to the visible
        // viewport so that mode exercises the body's scroll behavior instead of escaping above
        // the status-bar safe area.
        style={{ maxHeight: "calc(100dvh - var(--seed-safe-area-top))" }}
      >
        <BottomSheetBody
          // A snap point can leave less vertical space than the playground controls themselves.
          // Keep its intrinsic height for Drawer’s initial snap-point measurement, then allow it
          // to shrink into a scrolling region once the visible viewport becomes smaller.
          style={{
            flex: "1 1 auto",
            minHeight: 0,
            overflowY: "auto",
            overscrollBehavior: "contain",
          }}
        >
          <VStack gap="x4">
            <Readout metrics={metrics} />

            <Row label="content">
              <Choice values={CONTENT_MODES} value={contentMode} onChange={setContentMode} />
            </Row>
            <Row label="field">
              <Choice values={FIELD_MODES} value={fieldMode} onChange={setFieldMode} />
            </Row>
            <Row label="drawer props">
              <Toggle label="fixed" value={fixed} onChange={setFixed} />
              <Toggle label="snapPoints" value={withSnapPoints} onChange={setWithSnapPoints} />
              <Toggle
                label="repositionInputs"
                value={repositionInputs}
                onChange={setRepositionInputs}
              />
            </Row>

            <span style={{ fontSize: 12, opacity: 0.6 }}>
              {CONTENT_HINT[contentMode]} {FIELD_HINT[fieldMode]}
            </span>

            <div
              {...(contentMode === "scroll" && {
                style: { maxHeight: 160, overflowY: "auto" as const },
              })}
            >
              <VStack gap="x3">
                <Fields mode={fieldMode} />
                {contentMode !== "short" &&
                  Array.from(
                    { length: contentMode === "tall" ? 8 : 14 },
                    (_, i) => `filler ${i + 1}`,
                  ).map((label) => (
                    <div
                      key={label}
                      style={{ padding: 12, borderRadius: 8, background: "rgba(127,127,127,0.1)" }}
                    >
                      {label}
                    </div>
                  ))}
              </VStack>
            </div>
          </VStack>
        </BottomSheetBody>
        <BottomSheetFooter style={{ flexShrink: 0 }}>
          <ActionButton variant="neutralSolid" onClick={() => pop()}>
            Close
          </ActionButton>
        </BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheetRoot>
  );
};

export default ActivityBottomSheetKeyboardPlayground;

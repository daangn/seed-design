/**
 * WAAPI stub for the NextAppScreen tests.
 *
 * happy-dom ships no Web Animations API, so `el.animate` is replaced with a
 * recorder: the keyframes and options the engine asked for become assertable,
 * and completion is driven by hand instead of by wall-clock time.
 *
 * Installed on import — `harness.tsx` pulls it in and resets the log per
 * `renderStack`, so every test file gets it without opting in.
 *
 * Exposed as a getter scoped to the slots this engine animates. `bun test`
 * shares one process across files, so a blanket prototype patch would follow
 * every other suite too — and several of them branch on
 * `typeof el.animate !== "function"` to pick a no-WAAPI fallback. Reading the
 * property back as the environment left it (in happy-dom: `undefined`) keeps
 * that branch intact everywhere except on our own parts.
 */
const STUBBED_PARTS = new Set(["screen-layer", "screen-dim", "screen-content"]);

let environmentAnimate = Element.prototype.animate;

export interface RecordedAnimation {
  el: Element;
  keyframes: Keyframe[];
  options: KeyframeAnimationOptions;
  cancelled: boolean;
  finished: boolean;
  /** Report completion, as the browser would at the end of the curve. */
  finish: () => void;
}

const log: RecordedAnimation[] = [];

/** Animations started on `el` that are neither cancelled nor finished. */
export const runningAnimationsOn = (el: Element) =>
  log.filter((record) => record.el === el && !record.cancelled && !record.finished);

/** Every animation ever started on `el`, oldest first. */
export const animationsOn = (el: Element) => log.filter((record) => record.el === el);

export function resetAnimations() {
  log.length = 0;
}

/** Complete every animation still in flight. */
export function finishAnimations() {
  for (const record of log) record.finish();
}

// Defined rather than assigned: the stub only implements the members the
// engines touch (`finished`, `playState`, `cancel`), which is far from the full
// `Animation` interface a plain assignment would have to satisfy.
Object.defineProperty(Element.prototype, "animate", {
  configurable: true,
  // Another suite replacing `Element.prototype.animate` outright takes over the
  // fallback, so its own stub still reaches its own elements.
  set(value: typeof environmentAnimate) {
    environmentAnimate = value;
  },
  get(this: Element) {
    if (!STUBBED_PARTS.has(this.getAttribute("data-part") ?? "")) return environmentAnimate;

    const el = this;
    return (keyframes: Keyframe[], options: KeyframeAnimationOptions) => {
      let settle: () => void = () => {};
      const record: RecordedAnimation = {
        el,
        keyframes,
        options,
        cancelled: false,
        finished: false,
        finish: () => {
          if (record.cancelled || record.finished) return;

          record.finished = true;
          settle();
        },
      };

      log.push(record);
      return {
        finished: new Promise<void>((resolve) => {
          settle = resolve;
        }),
        get playState() {
          if (record.cancelled) return "idle";

          return record.finished ? "finished" : "running";
        },
        cancel: () => {
          if (record.cancelled || record.finished) return;

          record.cancelled = true;
          settle();
        },
      };
    };
  },
});

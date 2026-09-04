/**
 * Browser-compat primitives shared by the two WAAPI engines (GlobalInteraction
 * for AppScreen, NextAppScreen for its own per-screen transitions).
 *
 * Everything here exists because WAAPI support is uneven on the WebViews this
 * package still ships to: `Animation.finished` only landed in Chrome 84, and
 * the unit test environment (happy-dom) has no WAAPI at all.
 */

/** Extra margin added to a duration before the `finished` race gives up. */
const FINISHED_TIMEOUT_MARGIN = 100;

export interface AnimationResult {
  animations: Animation[];
  finished: Promise<void>;
}

export function safeAnimate(
  el: HTMLElement | null,
  keyframes: Keyframe[],
  options: KeyframeAnimationOptions,
): Animation | null {
  if (!el) return null;
  if (typeof el.animate !== "function") return null;

  return el.animate(keyframes, options);
}

export function cancelAll(animations: (Animation | null)[]) {
  for (const a of animations) {
    try {
      a?.cancel();
    } catch {
      /* ignore */
    }
  }
}

/**
 * Resolve when the animation finishes or `timeoutMs` elapses, whichever comes
 * first. Uses `Animation.finished` when available (Chrome 84+, Safari 13.1+,
 * Firefox 110+) and falls back to `onfinish` / `oncancel` listeners for older
 * browsers (e.g. Chrome 77). Both the timer and the listeners are always
 * cleaned up on the losing side of the race, so a late-firing animation cannot
 * invoke a stale callback or leak via closure-retained Animation references.
 */
function waitOne(a: Animation, timeoutMs: number): Promise<void> {
  const maybeFinished = (a as { finished?: Promise<Animation> }).finished;

  if (maybeFinished && typeof maybeFinished.then === "function") {
    return new Promise<void>((resolve) => {
      let settled = false;
      const finish = () => {
        if (settled) return;

        settled = true;
        clearTimeout(timer);
        resolve();
      };
      const timer = setTimeout(finish, timeoutMs);
      maybeFinished.then(finish, finish);
    });
  }

  return new Promise<void>((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;

      settled = true;
      try {
        a.onfinish = null;
        a.oncancel = null;
      } catch {
        /* ignore */
      }
      clearTimeout(timer);
      resolve();
    };
    a.onfinish = finish;
    a.oncancel = finish;
    const timer = setTimeout(finish, timeoutMs);
  });
}

export function waitAll(animations: (Animation | null)[], durationMs: number): Promise<void> {
  const valid = animations.filter((a): a is Animation => a !== null);
  if (valid.length === 0) return Promise.resolve();

  const timeout = durationMs + FINISHED_TIMEOUT_MARGIN;
  return Promise.all(valid.map((a) => waitOne(a, timeout))).then(() => {});
}

export function collectAnimations(
  anims: (Animation | null)[],
  durationMs: number,
): AnimationResult {
  const animations = anims.filter((a): a is Animation => a !== null);
  return { animations, finished: waitAll(animations, durationMs) };
}

/**
 * Whether this animation is still playing.
 *
 * The precondition for `sampleKeyframe`, and asked per element rather than per
 * component: once an animation has finished, the computed style is back under
 * the control of whatever state the element is in NOW — which, by the time a
 * transition asks, is already the state it is travelling towards. Sampling
 * then reads the destination as the origin and yields an animation that never
 * moves. A sibling element still being in motion says nothing about this one.
 */
export const isPlaying = (animation: Pick<Animation, "playState"> | null | undefined) =>
  animation?.playState === "running";

/**
 * Re-read the properties named by `template` from the element's current
 * computed style, so an interrupted transition departs from where the screen
 * visually is instead of snapping back to the declared start position. While
 * an animation is in flight the computed value is that animation's output, so
 * this must be called BEFORE cancelling it — and only while `isPlaying`.
 *
 * Falls back to `template` whenever the environment reports nothing usable —
 * happy-dom resolves no layout, so `transform` comes back as an empty string.
 */
export function sampleKeyframe(el: HTMLElement, template: Keyframe): Keyframe {
  if (typeof window === "undefined") return template;

  const computed = window.getComputedStyle(el);
  const sampled: Keyframe = {};
  for (const property of Object.keys(template)) {
    const value = computed.getPropertyValue(property);
    if (!value) return template;

    sampled[property] = value;
  }

  return sampled;
}

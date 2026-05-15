/**
 * WAAPI-based transition animations for AppScreen.
 *
 * Animations use fill:"forwards" so the final keyframe persists until
 * inline styles are explicitly updated on finish (see dom.ts).
 */

import type { TransitionTargets, TransitionStyle } from "./dom";
import { setTransform, setOpacity } from "./dom";
import {
  BEHIND_OFFSET_PERCENT,
  BEHIND_PARALLAX,
  OPACITY_FADE_MULTIPLIER,
  TITLE_OFFSET_PERCENT,
  TITLE_TRANSLATE_RATIO,
} from "./constants";

// ─── Constants ──────────────────────────────────────────────────────────────

const IOS_EASING = "cubic-bezier(0.2, 0.1, 0.21, 0.99)";
const IOS_DURATION = 350;

const ANDROID_ENTER_EASING = "cubic-bezier(0.23, 0.1, 0.32, 1)";
const ANDROID_ENTER_DURATION = 300;
const ANDROID_EXIT_EASING = "linear";
const ANDROID_EXIT_DURATION = 150;

const FADE_IN_ENTER_EASING = "ease-out";
const FADE_IN_ENTER_DURATION = 300;
const FADE_IN_EXIT_EASING = "ease-in";
const FADE_IN_EXIT_DURATION = 150;

// Extra margin added to duration for the setTimeout race fallback.
const FINISHED_TIMEOUT_MARGIN = 100;

// ─── Utilities ──────────────────────────────────────────────────────────────

function safeAnimate(
  el: HTMLElement | null,
  keyframes: Keyframe[],
  options: KeyframeAnimationOptions,
): Animation | null {
  if (!el) return null;
  return el.animate(keyframes, options);
}

/**
 * Snap the app-bar background element transform during an interactive gesture
 * (e.g. swipe-back). Reuses a single Animation by swapping its keyframes each
 * call — recreating on every touchmove would cancel-then-recreate and cause a
 * visible flicker.
 */
export function scrubAppBarBackground(
  el: HTMLElement | null,
  transform: string,
  prev: Animation | null,
): Animation | null {
  if (prev && prev.effect instanceof KeyframeEffect) {
    try {
      prev.effect.setKeyframes([{ transform }]);
      return prev;
    } catch {
      prev.cancel();
    }
  }
  return safeAnimate(el, [{ transform }], { duration: 1, fill: "forwards" });
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
 * Resolve when the animation finishes or `timeoutMs` elapses, whichever
 * comes first. Uses `Animation.finished` when available (Chrome 84+,
 * Safari 13.1+, Firefox 110+) and falls back to `onfinish` / `oncancel`
 * listeners for older browsers (e.g. Chrome 77). Both the timer and the
 * listeners are always cleaned up on the losing side of the race, so a
 * late-firing animation cannot invoke a stale callback or leak via
 * closure-retained Animation references.
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

function waitAll(animations: (Animation | null)[], durationMs: number): Promise<void> {
  const valid = animations.filter((a): a is Animation => a !== null);
  if (valid.length === 0) return Promise.resolve();
  const timeout = durationMs + FINISHED_TIMEOUT_MARGIN;
  return Promise.all(valid.map((a) => waitOne(a, timeout))).then(() => {});
}

export type AnimationResult = { animations: Animation[]; finished: Promise<void> };

function collectAnimations(anims: (Animation | null)[], durationMs: number): AnimationResult {
  const animations = anims.filter((a): a is Animation => a !== null);
  return { animations, finished: waitAll(animations, durationMs) };
}

// ─── iOS Slide ──────────────────────────────────────────────────────────────

interface TitleKeyframe {
  opacity: string;
  transform: string;
}

interface IosPositions {
  topLayer: string;
  behindLayer: string;
  dim: string;
  topTitle: TitleKeyframe;
  behindTitle: TitleKeyframe;
  topIconOpacity: string;
  behindIconOpacity: string;
  appBarBackground: string;
}

const IOS_ONSCREEN: IosPositions = {
  topLayer: "translate3d(0, 0, 0)",
  behindLayer: `translate3d(${BEHIND_OFFSET_PERCENT}%, 0, 0)`,
  dim: "1",
  topTitle: { opacity: "1", transform: "translate3d(0, 0, 0)" },
  behindTitle: { opacity: "0", transform: `translate3d(${-TITLE_OFFSET_PERCENT}%, 0, 0)` },
  topIconOpacity: "1",
  behindIconOpacity: "0",
  appBarBackground: "translate3d(0, 0, 0)",
};

const IOS_OFFSCREEN: IosPositions = {
  topLayer: "translate3d(100%, 0, 0)",
  behindLayer: "translate3d(0, 0, 0)",
  dim: "0",
  topTitle: { opacity: "0", transform: `translate3d(${TITLE_OFFSET_PERCENT}%, 0, 0)` },
  behindTitle: { opacity: "1", transform: "translate3d(0, 0, 0)" },
  topIconOpacity: "0",
  behindIconOpacity: "1",
  appBarBackground: "translate3d(100%, 0, 0)",
};

function iosAnimate(t: TransitionTargets, from: IosPositions, to: IosPositions): AnimationResult {
  const opts: KeyframeAnimationOptions = {
    duration: IOS_DURATION,
    easing: IOS_EASING,
    fill: "forwards",
  };
  const anims: (Animation | null)[] = [];

  anims.push(
    safeAnimate(t.topLayer, [{ transform: from.topLayer }, { transform: to.topLayer }], opts),
  );
  anims.push(
    safeAnimate(
      t.behindLayer,
      [{ transform: from.behindLayer }, { transform: to.behindLayer }],
      opts,
    ),
  );
  anims.push(safeAnimate(t.topDim, [{ opacity: from.dim }, { opacity: to.dim }], opts));
  anims.push(safeAnimate(t.topTitle, [from.topTitle, to.topTitle], opts));
  anims.push(safeAnimate(t.behindTitle, [from.behindTitle, to.behindTitle], opts));
  for (const icon of t.topIcons) {
    anims.push(
      safeAnimate(
        icon,
        [
          { opacity: from.topIconOpacity, transform: from.topTitle.transform },
          { opacity: to.topIconOpacity, transform: to.topTitle.transform },
        ],
        opts,
      ),
    );
  }
  for (const icon of t.behindIcons) {
    anims.push(
      safeAnimate(
        icon,
        [{ opacity: from.behindIconOpacity }, { opacity: to.behindIconOpacity }],
        opts,
      ),
    );
  }
  anims.push(
    safeAnimate(
      t.topAppBarBackground,
      [{ transform: from.appBarBackground }, { transform: to.appBarBackground }],
      opts,
    ),
  );

  return collectAnimations(anims, IOS_DURATION);
}

/**
 * Pin every iOS transition target to the given position with inline styles
 * before the animation starts. Prevents a one-frame flash at the final
 * position when the browser paints between React commit and animation
 * commit, and guarantees a known start state when the previous transition's
 * finish handler did not run (e.g. in browsers without Animation.finished
 * support, where the polyfill could time out).
 */
function pinIosInlineStyles(t: TransitionTargets, pos: IosPositions) {
  setTransform(t.topLayer, pos.topLayer);
  setTransform(t.behindLayer, pos.behindLayer);
  setOpacity(t.topDim, pos.dim);
  setTransform(t.topAppBarBackground, pos.appBarBackground);

  setOpacity(t.topTitle, pos.topTitle.opacity);
  setTransform(t.topTitle, pos.topTitle.transform);
  setOpacity(t.behindTitle, pos.behindTitle.opacity);
  setTransform(t.behindTitle, pos.behindTitle.transform);

  for (const icon of t.topIcons) {
    setOpacity(icon, pos.topIconOpacity);
    setTransform(icon, pos.topTitle.transform);
  }
  for (const icon of t.behindIcons) setOpacity(icon, pos.behindIconOpacity);
}

function iosAnimatePush(t: TransitionTargets): AnimationResult {
  pinIosInlineStyles(t, IOS_OFFSCREEN);
  return iosAnimate(t, IOS_OFFSCREEN, IOS_ONSCREEN);
}

function iosAnimatePop(t: TransitionTargets): AnimationResult {
  // No inline pinning here — top is already onscreen (no flash risk) and
  // pinning `-30%` on the behind layer caused it to stick there when
  // cleanup got skipped for any reason.
  return iosAnimate(t, IOS_ONSCREEN, IOS_OFFSCREEN);
}

// ─── Android / FadeIn ───────────────────────────────────────────────────────

function androidAnimate(t: TransitionTargets, direction: "push" | "pop"): AnimationResult {
  const isPush = direction === "push";
  const duration = isPush ? ANDROID_ENTER_DURATION : ANDROID_EXIT_DURATION;
  const opts: KeyframeAnimationOptions = {
    duration,
    easing: isPush ? ANDROID_ENTER_EASING : ANDROID_EXIT_EASING,
    fill: "forwards",
  };

  if (isPush) {
    // Prevent flash: set start positions before animation
    setOpacity(t.topLayer, "0");
    setTransform(t.topLayer, "translate3d(0, 8vh, 0)");
    setOpacity(t.topDim, "0");
    if (t.topAppBarRoot) {
      setOpacity(t.topAppBarRoot, "0");
      setTransform(t.topAppBarRoot, "translate3d(0, 8vh, 0)");
    }
  } else {
    // Pin onscreen positions before pop starts (mirror push setup)
    setOpacity(t.topLayer, "1");
    setTransform(t.topLayer, "translate3d(0, 0, 0)");
    if (t.topAppBarRoot) {
      setOpacity(t.topAppBarRoot, "1");
      setTransform(t.topAppBarRoot, "translate3d(0, 0, 0)");
    }
    // Restore behind appBar before pop starts (was hidden during idle)
    if (t.behindAppBarRoot) t.behindAppBarRoot.style.opacity = "";
  }

  const [fromOpacity, toOpacity] = isPush ? ["0", "1"] : ["1", "0"];
  const [fromY, toY] = isPush ? ["8vh", "0"] : ["0", "8vh"];
  const shared: [Keyframe, Keyframe] = [
    { opacity: fromOpacity, transform: `translate3d(0, ${fromY}, 0)` },
    { opacity: toOpacity, transform: `translate3d(0, ${toY}, 0)` },
  ];
  const dimFrames: [Keyframe, Keyframe] = [
    { opacity: fromOpacity, transform: `translate3d(0, ${isPush ? "-8vh" : "0"}, 0)` },
    { opacity: toOpacity, transform: `translate3d(0, ${isPush ? "0" : "-8vh"}, 0)` },
  ];

  return collectAnimations(
    [
      safeAnimate(t.topLayer, shared, opts),
      safeAnimate(t.topDim, dimFrames, opts),
      safeAnimate(t.topAppBarRoot, shared, opts),
    ],
    duration,
  );
}

function fadeInAnimate(t: TransitionTargets, direction: "push" | "pop"): AnimationResult {
  const isPush = direction === "push";
  const duration = isPush ? FADE_IN_ENTER_DURATION : FADE_IN_EXIT_DURATION;
  const opts: KeyframeAnimationOptions = {
    duration,
    easing: isPush ? FADE_IN_ENTER_EASING : FADE_IN_EXIT_EASING,
    fill: "forwards",
  };

  if (isPush) {
    // Prevent flash: set start positions before animation
    setOpacity(t.topLayer, "0");
    if (t.topAppBarRoot) setOpacity(t.topAppBarRoot, "0");
  } else {
    // Pin onscreen positions before pop starts (mirror push setup)
    setOpacity(t.topLayer, "1");
    if (t.topAppBarRoot) setOpacity(t.topAppBarRoot, "1");
    // Restore behind appBar before pop starts (was hidden during idle)
    if (t.behindAppBarRoot) t.behindAppBarRoot.style.opacity = "";
  }

  const frames: [Keyframe, Keyframe] = [
    { opacity: isPush ? "0" : "1" },
    { opacity: isPush ? "1" : "0" },
  ];

  return collectAnimations(
    [safeAnimate(t.topLayer, frames, opts), safeAnimate(t.topAppBarRoot, frames, opts)],
    duration,
  );
}

// ─── Swipe ──────────────────────────────────────────────────────────────────

function animateSwipe(
  t: TransitionTargets,
  displacement: number,
  duration: number,
  end: IosPositions,
): AnimationResult {
  const ratio = displacement / window.innerWidth;
  const topFade = Math.max(0, 1 - ratio * OPACITY_FADE_MULTIPLIER);
  const opts: KeyframeAnimationOptions = { duration, easing: IOS_EASING, fill: "forwards" };

  const currentBehind = `translate3d(calc(${BEHIND_OFFSET_PERCENT}% + ${displacement * BEHIND_PARALLAX}px), 0, 0)`;
  const currentTitleOffset = `translate3d(${displacement * TITLE_TRANSLATE_RATIO}px, 0, 0)`;
  const currentBehindTitle = `translate3d(calc(${-TITLE_OFFSET_PERCENT}% + ${displacement * TITLE_TRANSLATE_RATIO}px), 0, 0)`;

  const anims: (Animation | null)[] = [
    safeAnimate(
      t.topLayer,
      [{ transform: `translate3d(${displacement}px, 0, 0)` }, { transform: end.topLayer }],
      opts,
    ),
    safeAnimate(
      t.behindLayer,
      [{ transform: currentBehind }, { transform: end.behindLayer }],
      opts,
    ),
    safeAnimate(t.topDim, [{ opacity: `${1 - ratio}` }, { opacity: end.dim }], opts),
    safeAnimate(
      t.topTitle,
      [{ opacity: `${topFade}`, transform: currentTitleOffset }, end.topTitle],
      opts,
    ),
    safeAnimate(
      t.behindTitle,
      [{ opacity: `${ratio}`, transform: currentBehindTitle }, end.behindTitle],
      opts,
    ),
  ];
  for (const icon of t.topIcons) {
    anims.push(
      safeAnimate(
        icon,
        [
          { opacity: `${topFade}`, transform: currentTitleOffset },
          { opacity: end.topIconOpacity, transform: end.topTitle.transform },
        ],
        opts,
      ),
    );
  }
  for (const icon of t.behindIcons) {
    anims.push(
      safeAnimate(icon, [{ opacity: `${ratio}` }, { opacity: end.behindIconOpacity }], opts),
    );
  }
  anims.push(
    safeAnimate(
      t.topAppBarBackground,
      [{ transform: `translate3d(${displacement}px, 0, 0)` }, { transform: end.appBarBackground }],
      opts,
    ),
  );

  return collectAnimations(anims, duration);
}

// ─── Public API ─────────────────────────────────────────────────────────────

export function animateTransition(
  targets: TransitionTargets,
  direction: "push" | "pop",
  style: TransitionStyle,
): AnimationResult {
  switch (style) {
    case "slideFromRightIOS":
      return direction === "push" ? iosAnimatePush(targets) : iosAnimatePop(targets);
    case "fadeFromBottomAndroid":
      return androidAnimate(targets, direction);
    case "fadeIn":
      return fadeInAnimate(targets, direction);
    default:
      return { animations: [], finished: Promise.resolve() };
  }
}

export function animateSwipeComplete(t: TransitionTargets, displacement: number): AnimationResult {
  return animateSwipe(t, displacement, IOS_DURATION, IOS_OFFSCREEN);
}

export function animateSwipeCancel(t: TransitionTargets, displacement: number): AnimationResult {
  return animateSwipe(t, displacement, IOS_DURATION, IOS_ONSCREEN);
}

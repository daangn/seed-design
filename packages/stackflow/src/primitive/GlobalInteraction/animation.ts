/**
 * WAAPI-based transition animations for AppScreen.
 *
 * Animations use fill:"forwards" so the final keyframe persists until
 * inline styles are explicitly updated on finish (see dom.ts).
 */

import type { TransitionTargets, TransitionStyle } from "./dom";
import { setTransform, setOpacity } from "./dom";

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

const BEHIND_OFFSET_PERCENT = -30;
const BEHIND_PARALLAX = 0.3;
const TITLE_TRANSLATE_RATIO = 0.15;
const OPACITY_FADE_MULTIPLIER = 3;

const MIN_SWIPE_DURATION = 150;
const MAX_SWIPE_DURATION = 500;

// ─── Utilities ──────────────────────────────────────────────────────────────

function safeAnimate(
  el: HTMLElement | null,
  keyframes: Keyframe[],
  options: KeyframeAnimationOptions,
): Animation | null {
  if (!el) return null;
  return el.animate(keyframes, options);
}

function safePseudoAnimate(
  el: HTMLElement | null,
  keyframes: Keyframe[],
  options: KeyframeAnimationOptions,
): Animation | null {
  if (!el) return null;
  try {
    return el.animate(keyframes, { ...options, pseudoElement: "::before" });
  } catch {
    return null;
  }
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

function waitAll(animations: (Animation | null)[]): Promise<void> {
  const valid = animations.filter((a): a is Animation => a !== null);
  if (valid.length === 0) return Promise.resolve();
  return Promise.all(
    valid.map((a) =>
      a.finished.catch(() => {
        /* AbortError from cancel */
      }),
    ),
  ).then(() => {});
}

export type AnimationResult = { animations: Animation[]; finished: Promise<void> };

function collectAnimations(anims: (Animation | null)[]): AnimationResult {
  const animations = anims.filter((a): a is Animation => a !== null);
  return { animations, finished: waitAll(animations) };
}

function calculateSwipeDuration(remainingDistance: number, velocity: number): number {
  if (velocity > 0.5) {
    return Math.max(MIN_SWIPE_DURATION, Math.min(MAX_SWIPE_DURATION, remainingDistance / velocity));
  }
  const ratio = remainingDistance / window.innerWidth;
  return Math.max(MIN_SWIPE_DURATION, Math.min(MAX_SWIPE_DURATION, IOS_DURATION * ratio));
}

// ─── iOS Slide ──────────────────────────────────────────────────────────────

interface IosPositions {
  topLayer: string;
  behindLayer: string;
  dim: string;
  topTitle: Keyframe;
  behindTitle: Keyframe;
  topIconOpacity: string;
  behindIconOpacity: string;
  appBarPseudo: string;
}

const IOS_ONSCREEN: IosPositions = {
  topLayer: "translate3d(0, 0, 0)",
  behindLayer: `translate3d(${BEHIND_OFFSET_PERCENT}%, 0, 0)`,
  dim: "1",
  topTitle: { opacity: "1", transform: "translate3d(0, 0, 0)" },
  behindTitle: { opacity: "0", transform: "translate3d(-25%, 0, 0)" },
  topIconOpacity: "1",
  behindIconOpacity: "0",
  appBarPseudo: "translate3d(0, 0, 0)",
};

const IOS_OFFSCREEN: IosPositions = {
  topLayer: "translate3d(100%, 0, 0)",
  behindLayer: "translate3d(0, 0, 0)",
  dim: "0",
  topTitle: { opacity: "0", transform: "translate3d(25%, 0, 0)" },
  behindTitle: { opacity: "1", transform: "translate3d(0, 0, 0)" },
  topIconOpacity: "0",
  behindIconOpacity: "1",
  appBarPseudo: "translate3d(100%, 0, 0)",
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
          { opacity: from.topIconOpacity, transform: from.topTitle["transform"] as string },
          { opacity: to.topIconOpacity, transform: to.topTitle["transform"] as string },
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
    safePseudoAnimate(
      t.topAppBarRoot,
      [{ transform: from.appBarPseudo }, { transform: to.appBarPseudo }],
      opts,
    ),
  );

  return collectAnimations(anims);
}

function iosAnimatePush(t: TransitionTargets): AnimationResult {
  // Set start positions as inline style before animation (prevents flash)
  setTransform(t.topLayer, "translate3d(100%, 0, 0)");
  setOpacity(t.topDim, "0");
  if (t.topTitle) {
    setOpacity(t.topTitle, "0");
    setTransform(t.topTitle, "translate3d(25%, 0, 0)");
  }
  for (const icon of t.topIcons) {
    setOpacity(icon, "0");
    setTransform(icon, "translate3d(25%, 0, 0)");
  }

  return iosAnimate(t, IOS_OFFSCREEN, IOS_ONSCREEN);
}

function iosAnimatePop(t: TransitionTargets): AnimationResult {
  return iosAnimate(t, IOS_ONSCREEN, IOS_OFFSCREEN);
}

// ─── Android / FadeIn ───────────────────────────────────────────────────────

function androidAnimate(t: TransitionTargets, direction: "push" | "pop"): AnimationResult {
  const isPush = direction === "push";
  const opts: KeyframeAnimationOptions = {
    duration: isPush ? ANDROID_ENTER_DURATION : ANDROID_EXIT_DURATION,
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

  return collectAnimations([
    safeAnimate(t.topLayer, shared, opts),
    safeAnimate(t.topDim, dimFrames, opts),
    safeAnimate(t.topAppBarRoot, shared, opts),
  ]);
}

function fadeInAnimate(t: TransitionTargets, direction: "push" | "pop"): AnimationResult {
  const isPush = direction === "push";
  const opts: KeyframeAnimationOptions = {
    duration: isPush ? FADE_IN_ENTER_DURATION : FADE_IN_EXIT_DURATION,
    easing: isPush ? FADE_IN_ENTER_EASING : FADE_IN_EXIT_EASING,
    fill: "forwards",
  };

  if (isPush) {
    // Prevent flash: set start positions before animation
    setOpacity(t.topLayer, "0");
    if (t.topAppBarRoot) setOpacity(t.topAppBarRoot, "0");
  } else {
    // Restore behind appBar before pop starts (was hidden during idle)
    if (t.behindAppBarRoot) t.behindAppBarRoot.style.opacity = "";
  }

  const frames: [Keyframe, Keyframe] = [
    { opacity: isPush ? "0" : "1" },
    { opacity: isPush ? "1" : "0" },
  ];

  return collectAnimations([
    safeAnimate(t.topLayer, frames, opts),
    safeAnimate(t.topAppBarRoot, frames, opts),
  ]);
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
  const currentBehindTitle = `translate3d(calc(-25% + ${displacement * TITLE_TRANSLATE_RATIO}px), 0, 0)`;

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
          { opacity: end.topIconOpacity, transform: end.topTitle["transform"] as string },
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
    safePseudoAnimate(
      t.topAppBarRoot,
      [{ transform: `translate3d(${displacement}px, 0, 0)` }, { transform: end.appBarPseudo }],
      opts,
    ),
  );

  return collectAnimations(anims);
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

export function animateSwipeComplete(
  t: TransitionTargets,
  displacement: number,
  velocity: number,
): AnimationResult {
  const duration = calculateSwipeDuration(window.innerWidth - displacement, velocity);
  return animateSwipe(t, displacement, duration, IOS_OFFSCREEN);
}

export function animateSwipeCancel(
  t: TransitionTargets,
  displacement: number,
  velocity: number,
): AnimationResult {
  const duration = calculateSwipeDuration(displacement, velocity);
  return animateSwipe(t, displacement, duration, IOS_ONSCREEN);
}

/**
 * WAAPI-based transition animations for AppScreen.
 *
 * Strategy: inline styles are the source of truth for element positions.
 * Animations use fill:"forwards" so the final keyframe persists until
 * inline styles are explicitly updated on finish.
 */

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

// ─── Selectors ──────────────────────────────────────────────────────────────

const SEL_APP_BAR_MAIN_ROOT = '[class*="seed-app-bar-main__root"]';
const SEL_APP_BAR_ROOT = '[class*="seed-app-bar__root"]';
const SEL_APP_BAR_ICON = '[class*="seed-app-bar__icon"]';
const SEL_APP_BAR_CUSTOM = '[class*="seed-app-bar__custom"]';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface TransitionTargets {
  topLayer: HTMLElement | null;
  topDim: HTMLElement | null;
  behindLayer: HTMLElement | null;
  behindDim: HTMLElement | null;
  topTitle: HTMLElement | null;
  behindTitle: HTMLElement | null;
  topIcons: HTMLElement[];
  behindIcons: HTMLElement[];
  topAppBarRoot: HTMLElement | null;
  behindAppBarRoot: HTMLElement | null;
}

export type TransitionStyle = "slideFromRightIOS" | "fadeFromBottomAndroid" | "fadeIn";

// ─── DOM Discovery ──────────────────────────────────────────────────────────

export function findTransitionTargets(stackEl: HTMLElement): TransitionTargets {
  const topActivity = stackEl.querySelector<HTMLElement>("[data-activity-is-top]");

  let behindActivity: HTMLElement | null = null;
  if (topActivity) {
    const all = stackEl.querySelectorAll<HTMLElement>("[data-part='activity']");
    const topId = topActivity.dataset["activityId"];
    let found = false;
    for (let i = all.length - 1; i >= 0; i--) {
      if (all[i].dataset["activityId"] === topId) {
        found = true;
        continue;
      }
      if (found && all[i].dataset["activityId"]) {
        behindActivity = all[i];
        break;
      }
    }
  }

  return {
    topLayer: topActivity?.querySelector<HTMLElement>("[data-part='layer']") ?? null,
    topDim: topActivity?.querySelector<HTMLElement>("[data-part='dim']") ?? null,
    behindLayer: behindActivity?.querySelector<HTMLElement>("[data-part='layer']") ?? null,
    behindDim: behindActivity?.querySelector<HTMLElement>("[data-part='dim']") ?? null,
    topTitle: topActivity?.querySelector<HTMLElement>(SEL_APP_BAR_MAIN_ROOT) ?? null,
    behindTitle: behindActivity?.querySelector<HTMLElement>(SEL_APP_BAR_MAIN_ROOT) ?? null,
    topIcons: Array.from(
      topActivity?.querySelectorAll<HTMLElement>(`${SEL_APP_BAR_ICON}, ${SEL_APP_BAR_CUSTOM}`) ??
        [],
    ),
    behindIcons: Array.from(
      behindActivity?.querySelectorAll<HTMLElement>(`${SEL_APP_BAR_ICON}, ${SEL_APP_BAR_CUSTOM}`) ??
        [],
    ),
    topAppBarRoot: topActivity?.querySelector<HTMLElement>(SEL_APP_BAR_ROOT) ?? null,
    behindAppBarRoot: behindActivity?.querySelector<HTMLElement>(SEL_APP_BAR_ROOT) ?? null,
  };
}

// ─── Inline Style Helpers ───────────────────────────────────────────────────

function setTransform(el: HTMLElement | null, value: string) {
  if (el) el.style.transform = value;
}

function setOpacity(el: HTMLElement | null, value: string) {
  if (el) el.style.opacity = value;
}

function clearStyles(el: HTMLElement | null) {
  if (!el) return;
  el.style.transform = "";
  el.style.opacity = "";
}

/**
 * Set the "idle after push" positions: top at 0, behind at -30%.
 * Called after push completes to maintain correct layering.
 */
export function setIdlePositions(t: TransitionTargets) {
  // Top activity — visible at origin
  clearStyles(t.topLayer);
  clearStyles(t.topDim);
  clearStyles(t.topTitle);
  for (const icon of t.topIcons) clearStyles(icon);
  if (t.topAppBarRoot) t.topAppBarRoot.style.removeProperty("--swipe-back-displacement");

  // Behind activity — offset to the left
  setTransform(t.behindLayer, `translate3d(${BEHIND_OFFSET_PERCENT}%, 0, 0)`);
  if (t.behindTitle) {
    setOpacity(t.behindTitle, "0");
    setTransform(t.behindTitle, "translate3d(-25%, 0, 0)");
  }
  for (const icon of t.behindIcons) setOpacity(icon, "0");
}

/**
 * Set positions after pop/swipe-complete:
 * - Top activity pinned off-screen (until stackflow removes DOM)
 * - Behind activity cleared to CSS defaults (it's now visible)
 */
export function setPostExitPositions(t: TransitionTargets) {
  // Top activity — pinned off-screen so it doesn't flash back
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
  // Hide appBar root entirely — this also hides ::before which can't be inlined
  if (t.topAppBarRoot) {
    setOpacity(t.topAppBarRoot, "0");
  }

  // Behind activity — visible at origin
  clearStyles(t.behindLayer);
  clearStyles(t.behindTitle);
  for (const icon of t.behindIcons) clearStyles(icon);
  if (t.behindAppBarRoot) {
    t.behindAppBarRoot.style.opacity = "";
    t.behindAppBarRoot.style.removeProperty("--swipe-back-displacement");
  }
}

/**
 * Clear ALL inline styles from all targets.
 */
export function clearAllStyles(t: TransitionTargets) {
  clearStyles(t.topLayer);
  clearStyles(t.topDim);
  clearStyles(t.behindLayer);
  clearStyles(t.behindDim);
  clearStyles(t.topTitle);
  clearStyles(t.behindTitle);
  for (const icon of [...t.topIcons, ...t.behindIcons]) clearStyles(icon);
  if (t.topAppBarRoot) t.topAppBarRoot.style.removeProperty("--swipe-back-displacement");
  if (t.behindAppBarRoot) t.behindAppBarRoot.style.removeProperty("--swipe-back-displacement");
}

/** Apply inline styles during swiping (touchmove). */
export function applySwipeStyles(t: TransitionTargets, displacement: number, ratio: number) {
  setTransform(t.topLayer, `translate3d(${displacement}px, 0, 0)`);
  setTransform(
    t.behindLayer,
    `translate3d(calc(${BEHIND_OFFSET_PERCENT}% + ${displacement * BEHIND_PARALLAX}px), 0, 0)`,
  );
  setOpacity(t.topDim, `${1 - ratio}`);

  const topFade = Math.max(0, 1 - ratio * OPACITY_FADE_MULTIPLIER);
  if (t.topTitle) {
    setOpacity(t.topTitle, `${topFade}`);
    setTransform(t.topTitle, `translate3d(${displacement * TITLE_TRANSLATE_RATIO}px, 0, 0)`);
  }
  if (t.behindTitle) {
    setOpacity(t.behindTitle, `${ratio}`);
    setTransform(
      t.behindTitle,
      `translate3d(calc(-25% + ${displacement * TITLE_TRANSLATE_RATIO}px), 0, 0)`,
    );
  }
  for (const icon of t.topIcons) {
    setOpacity(icon, `${topFade}`);
    setTransform(icon, `translate3d(${displacement * TITLE_TRANSLATE_RATIO}px, 0, 0)`);
  }
  for (const icon of t.behindIcons) {
    setOpacity(icon, `${ratio}`);
  }
  if (t.topAppBarRoot) {
    t.topAppBarRoot.style.setProperty("--swipe-back-displacement", `${displacement}px`);
  }
}

// ─── Animation Utilities ────────────────────────────────────────────────────

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
        /* AbortError from cancel — safe to ignore */
      }),
    ),
  ).then(() => {});
}

type AnimationResult = { animations: Animation[]; finished: Promise<void> };

/**
 * Collect nullable animations into a typed result with a `finished` promise.
 */
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

// ─── iOS Slide Transitions ──────────────────────────────────────────────────

/** Positions for the "on-screen" and "off-screen" states of an iOS transition. */
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

  // Top layer
  anims.push(
    safeAnimate(t.topLayer, [{ transform: from.topLayer }, { transform: to.topLayer }], opts),
  );
  // Behind layer
  anims.push(
    safeAnimate(
      t.behindLayer,
      [{ transform: from.behindLayer }, { transform: to.behindLayer }],
      opts,
    ),
  );
  // Dim
  anims.push(safeAnimate(t.topDim, [{ opacity: from.dim }, { opacity: to.dim }], opts));
  // Top title
  anims.push(safeAnimate(t.topTitle, [from.topTitle, to.topTitle], opts));
  // Behind title
  anims.push(safeAnimate(t.behindTitle, [from.behindTitle, to.behindTitle], opts));
  // Top icons
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
  // Behind icons
  for (const icon of t.behindIcons) {
    anims.push(
      safeAnimate(
        icon,
        [{ opacity: from.behindIconOpacity }, { opacity: to.behindIconOpacity }],
        opts,
      ),
    );
  }
  // AppBar ::before
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

// ─── Android / FadeIn Transitions ───────────────────────────────────────────

function androidAnimate(t: TransitionTargets, direction: "push" | "pop"): AnimationResult {
  const isPush = direction === "push";
  const opts: KeyframeAnimationOptions = {
    duration: isPush ? ANDROID_ENTER_DURATION : ANDROID_EXIT_DURATION,
    easing: isPush ? ANDROID_ENTER_EASING : ANDROID_EXIT_EASING,
    fill: "forwards",
  };
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
  const frames: [Keyframe, Keyframe] = [
    { opacity: isPush ? "0" : "1" },
    { opacity: isPush ? "1" : "0" },
  ];

  return collectAnimations([
    safeAnimate(t.topLayer, frames, opts),
    safeAnimate(t.topAppBarRoot, frames, opts),
  ]);
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

/** Target keyframes that differ between swipe-complete and swipe-cancel. */
interface SwipeEndpoints {
  topLayer: string;
  behindLayer: string;
  dim: string;
  topTitle: Keyframe;
  behindTitle: Keyframe;
  topIconEnd: Keyframe;
  behindIconOpacity: string;
  appBarPseudo: string;
}

function animateSwipe(
  t: TransitionTargets,
  displacement: number,
  duration: number,
  end: SwipeEndpoints,
): AnimationResult {
  const ratio = displacement / window.innerWidth;
  const topFade = Math.max(0, 1 - ratio * OPACITY_FADE_MULTIPLIER);
  const opts: KeyframeAnimationOptions = { duration, easing: IOS_EASING, fill: "forwards" };

  // Shared "from" keyframes — current swipe position
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
        [{ opacity: `${topFade}`, transform: currentTitleOffset }, end.topIconEnd],
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

export function animateSwipeComplete(
  t: TransitionTargets,
  displacement: number,
  velocity: number,
): AnimationResult {
  const screenWidth = window.innerWidth;
  const duration = calculateSwipeDuration(screenWidth - displacement, velocity);
  return animateSwipe(t, displacement, duration, {
    topLayer: "translate3d(100%, 0, 0)",
    behindLayer: "translate3d(0, 0, 0)",
    dim: "0",
    topTitle: { opacity: "0", transform: "translate3d(25%, 0, 0)" },
    behindTitle: { opacity: "1", transform: "translate3d(0, 0, 0)" },
    topIconEnd: { opacity: "0", transform: "translate3d(25%, 0, 0)" },
    behindIconOpacity: "1",
    appBarPseudo: "translate3d(100%, 0, 0)",
  });
}

export function animateSwipeCancel(
  t: TransitionTargets,
  displacement: number,
  velocity: number,
): AnimationResult {
  const duration = calculateSwipeDuration(displacement, velocity);
  return animateSwipe(t, displacement, duration, {
    topLayer: "translate3d(0, 0, 0)",
    behindLayer: `translate3d(${BEHIND_OFFSET_PERCENT}%, 0, 0)`,
    dim: "1",
    topTitle: { opacity: "1", transform: "translate3d(0, 0, 0)" },
    behindTitle: { opacity: "0", transform: "translate3d(-25%, 0, 0)" },
    topIconEnd: { opacity: "1", transform: "translate3d(0, 0, 0)" },
    behindIconOpacity: "0",
    appBarPseudo: "translate3d(0, 0, 0)",
  });
}

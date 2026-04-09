/**
 * DOM discovery and inline style management for AppScreen transitions.
 *
 * Elements are found via data-part attributes. Inline styles are the
 * source of truth for element positions between animations.
 */

// ─── Constants ──────────────────────────────────────────────────────────────

const BEHIND_OFFSET_PERCENT = -30;
const BEHIND_PARALLAX = 0.3;
const TITLE_TRANSLATE_RATIO = 0.15;
const OPACITY_FADE_MULTIPLIER = 3;

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

function queryParts(activity: HTMLElement | null, part: string): HTMLElement | null {
  return activity?.querySelector<HTMLElement>(`[data-part='${part}']`) ?? null;
}

function queryAllParts(activity: HTMLElement | null, ...parts: string[]): HTMLElement[] {
  if (!activity) return [];
  const selector = parts.map((p) => `[data-part='${p}']`).join(", ");
  return Array.from(activity.querySelectorAll<HTMLElement>(selector));
}

/** Read transition style directly from the top activity DOM element. */
export function readTransitionStyle(stackEl: HTMLElement): TransitionStyle {
  const topActivity = stackEl.querySelector<HTMLElement>("[data-activity-is-top]");
  return (topActivity?.dataset["transitionStyle"] as TransitionStyle) ?? "slideFromRightIOS";
}

/** Find all transition target elements. Call once per gesture/transition. */
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
    topLayer: queryParts(topActivity, "layer"),
    topDim: queryParts(topActivity, "dim"),
    behindLayer: queryParts(behindActivity, "layer"),
    behindDim: queryParts(behindActivity, "dim"),
    topTitle: queryParts(topActivity, "appBarMain"),
    behindTitle: queryParts(behindActivity, "appBarMain"),
    topIcons: queryAllParts(topActivity, "appBarIcon", "appBarCustom"),
    behindIcons: queryAllParts(behindActivity, "appBarIcon", "appBarCustom"),
    topAppBarRoot: queryParts(topActivity, "appBar"),
    behindAppBarRoot: queryParts(behindActivity, "appBar"),
  };
}

// ─── Inline Style Helpers ───────────────────────────────────────────────────

export function setTransform(el: HTMLElement | null, value: string) {
  if (el) el.style.transform = value;
}

export function setOpacity(el: HTMLElement | null, value: string) {
  if (el) el.style.opacity = value;
}

function clearStyles(el: HTMLElement | null) {
  if (!el) return;
  el.style.transform = "";
  el.style.opacity = "";
}

// ─── Position Management ────────────────────────────────────────────────────

/**
 * Set the "idle after push" positions.
 * iOS: top at 0, behind at -30% with title/icons hidden.
 * Android/fadeIn: top at 0, behind untouched (no parallax).
 */
export function setIdlePositions(
  t: TransitionTargets,
  style: TransitionStyle = "slideFromRightIOS",
) {
  clearStyles(t.topLayer);
  clearStyles(t.topDim);
  clearStyles(t.topTitle);
  for (const icon of t.topIcons) clearStyles(icon);
  if (t.topAppBarRoot) {
    t.topAppBarRoot.style.opacity = "";
    t.topAppBarRoot.style.removeProperty("--swipe-back-displacement");
  }

  if (style === "slideFromRightIOS") {
    setTransform(t.behindLayer, `translate3d(${BEHIND_OFFSET_PERCENT}%, 0, 0)`);
    if (t.behindTitle) {
      setOpacity(t.behindTitle, "0");
      setTransform(t.behindTitle, "translate3d(-25%, 0, 0)");
    }
    for (const icon of t.behindIcons) setOpacity(icon, "0");
  } else {
    // Android/fadeIn: behind activity stays in place but its appBar must be hidden
    // because top activity's appBar overlaps at the same position
    if (t.behindAppBarRoot) setOpacity(t.behindAppBarRoot, "0");
  }
}

/**
 * Set positions after pop/swipe-complete.
 * Pins top activity in its exit position, clears behind activity.
 */
export function setPostExitPositions(
  t: TransitionTargets,
  style: TransitionStyle = "slideFromRightIOS",
) {
  if (style === "slideFromRightIOS") {
    setTransform(t.topLayer, "translate3d(100%, 0, 0)");
    if (t.topTitle) {
      setOpacity(t.topTitle, "0");
      setTransform(t.topTitle, "translate3d(25%, 0, 0)");
    }
    for (const icon of t.topIcons) {
      setOpacity(icon, "0");
      setTransform(icon, "translate3d(25%, 0, 0)");
    }
    if (t.topAppBarRoot) setOpacity(t.topAppBarRoot, "0");
  } else if (style === "fadeFromBottomAndroid") {
    setTransform(t.topLayer, "translate3d(0, 8vh, 0)");
    setOpacity(t.topLayer, "0");
    if (t.topAppBarRoot) {
      setOpacity(t.topAppBarRoot, "0");
      setTransform(t.topAppBarRoot, "translate3d(0, 8vh, 0)");
    }
  } else {
    setOpacity(t.topLayer, "0");
    if (t.topAppBarRoot) setOpacity(t.topAppBarRoot, "0");
  }
  setOpacity(t.topDim, "0");

  clearStyles(t.behindLayer);
  clearStyles(t.behindTitle);
  for (const icon of t.behindIcons) clearStyles(icon);
  if (t.behindAppBarRoot) {
    t.behindAppBarRoot.style.opacity = "";
    t.behindAppBarRoot.style.removeProperty("--swipe-back-displacement");
  }
}

/** Clear ALL inline styles from all targets. */
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

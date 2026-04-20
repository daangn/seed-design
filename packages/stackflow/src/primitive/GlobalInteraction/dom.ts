/**
 * DOM discovery and inline style management for AppScreen transitions.
 *
 * Elements are found via data-part attributes. Inline styles are the
 * source of truth for element positions between animations.
 */

import {
  BEHIND_OFFSET_PERCENT,
  BEHIND_PARALLAX,
  OPACITY_FADE_MULTIPLIER,
  TITLE_OFFSET_PERCENT,
  TITLE_TRANSLATE_RATIO,
} from "./constants";

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
 * Clear ALL inline styles from every target, including appBar roots.
 * This is the foundation — call before setting any specific positions.
 */
export function clearAllStyles(t: TransitionTargets) {
  const all = [
    t.topLayer,
    t.topDim,
    t.behindLayer,
    t.behindDim,
    t.topTitle,
    t.behindTitle,
    t.topAppBarRoot,
    t.behindAppBarRoot,
    ...t.topIcons,
    ...t.behindIcons,
  ];
  for (const el of all) clearStyles(el);
  t.topAppBarRoot?.style.removeProperty("--swipe-back-displacement");
  t.behindAppBarRoot?.style.removeProperty("--swipe-back-displacement");
}

/**
 * Set idle positions after push completes.
 * Pattern: clear everything first, then set only non-default positions.
 */
export function setIdlePositions(
  t: TransitionTargets,
  style: TransitionStyle = "slideFromRightIOS",
) {
  clearAllStyles(t);

  if (style === "slideFromRightIOS") {
    // Behind layer parallax offset
    setTransform(t.behindLayer, `translate3d(${BEHIND_OFFSET_PERCENT}%, 0, 0)`);
    setOpacity(t.behindTitle, "0");
    setTransform(t.behindTitle, `translate3d(${-TITLE_OFFSET_PERCENT}%, 0, 0)`);
    for (const icon of t.behindIcons) setOpacity(icon, "0");
  } else {
    // Android/fadeIn: behind is at same position, hide its appBar to prevent bleed-through
    setOpacity(t.behindAppBarRoot, "0");
  }
}

/**
 * Set positions after pop/swipe-complete.
 * Pattern: clear everything first, then pin top in exit position.
 */
export function setPostExitPositions(
  t: TransitionTargets,
  style: TransitionStyle = "slideFromRightIOS",
) {
  clearAllStyles(t);

  // Pin top activity off-screen (stackflow will remove it from DOM later)
  setOpacity(t.topDim, "0");
  setOpacity(t.topAppBarRoot, "0");

  if (style === "slideFromRightIOS") {
    setTransform(t.topLayer, "translate3d(100%, 0, 0)");
    setOpacity(t.topTitle, "0");
    setTransform(t.topTitle, `translate3d(${TITLE_OFFSET_PERCENT}%, 0, 0)`);
    for (const icon of t.topIcons) {
      setOpacity(icon, "0");
      setTransform(icon, `translate3d(${TITLE_OFFSET_PERCENT}%, 0, 0)`);
    }
  } else if (style === "fadeFromBottomAndroid") {
    setOpacity(t.topLayer, "0");
    setTransform(t.topLayer, "translate3d(0, 8vh, 0)");
    setTransform(t.topAppBarRoot, "translate3d(0, 8vh, 0)");
  } else {
    setOpacity(t.topLayer, "0");
  }
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
      `translate3d(calc(${-TITLE_OFFSET_PERCENT}% + ${displacement * TITLE_TRANSLATE_RATIO}px), 0, 0)`,
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

/**
 * DOM discovery and inline style management for AppScreen transitions.
 *
 * Elements are found via data-part attributes. Inline styles are the
 * source of truth for element positions between animations.
 */

import { appBarAnatomy } from "../AppBar/anatomy";
import { appScreenAnatomy } from "../AppScreen/anatomy";
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
  intermediateActivities: HTMLElement[];
  intermediateLayers: HTMLElement[];
  intermediateDims: HTMLElement[];
  topTitle: HTMLElement | null;
  behindTitle: HTMLElement | null;
  intermediateTitles: HTMLElement[];
  topIcons: HTMLElement[];
  behindIcons: HTMLElement[];
  intermediateIcons: HTMLElement[];
  topAppBarRoot: HTMLElement | null;
  behindAppBarRoot: HTMLElement | null;
  intermediateAppBarRoots: HTMLElement[];
  topAppBarBackground: HTMLElement | null;
  behindAppBarBackground: HTMLElement | null;
  intermediateAppBarBackgrounds: HTMLElement[];
}

export type TransitionStyle = "slideFromRightIOS" | "fadeFromBottomAndroid" | "fadeIn";
export type TransitionDirection = "push" | "pop";

// ─── DOM Discovery ──────────────────────────────────────────────────────────

function queryParts(activity: HTMLElement | null, part: string): HTMLElement | null {
  return activity?.querySelector<HTMLElement>(`[data-part='${part}']`) ?? null;
}

function queryAllParts(activity: HTMLElement | null, ...parts: string[]): HTMLElement[] {
  if (!activity) return [];
  const selector = parts.map((p) => `[data-part='${p}']`).join(", ");
  return Array.from(activity.querySelectorAll<HTMLElement>(selector));
}

function queryPartsFromActivities(activities: HTMLElement[], part: string): HTMLElement[] {
  return activities
    .map((activity) => queryParts(activity, part))
    .filter((el): el is HTMLElement => el !== null);
}

function queryAllPartsFromActivities(activities: HTMLElement[], ...parts: string[]): HTMLElement[] {
  return activities.flatMap((activity) => queryAllParts(activity, ...parts));
}

/** Read transition style directly from the top activity DOM element. */
export function readTransitionStyle(stackEl: HTMLElement): TransitionStyle {
  const topActivity = stackEl.querySelector<HTMLElement>("[data-activity-is-top]");
  return (topActivity?.dataset["transitionStyle"] as TransitionStyle) ?? "slideFromRightIOS";
}

/** Find all transition target elements. Call once per gesture/transition. */
export function findTransitionTargets(
  stackEl: HTMLElement,
  options: {
    direction?: TransitionDirection;
  } = {},
): TransitionTargets {
  const topActivity = stackEl.querySelector<HTMLElement>("[data-activity-is-top]");

  let behindActivity: HTMLElement | null = null;
  let intermediateActivities: HTMLElement[] = [];
  if (topActivity) {
    const all = Array.from(
      stackEl.querySelectorAll<HTMLElement>(`[data-part='${appScreenAnatomy.activity}']`),
    );
    const topId = topActivity.dataset["activityId"];
    const topIdx = all.findIndex((el) => el.dataset["activityId"] === topId);

    const findBehindIndex = (predicate: (activity: HTMLElement) => boolean) => {
      for (let i = topIdx - 1; i >= 0; i--) {
        if (all[i].dataset["activityId"] && predicate(all[i])) {
          return i;
        }
      }

      return -1;
    };

    let behindIdx =
      options.direction === "pop"
        ? findBehindIndex((activity) => activity.dataset["activityIsActive"] !== undefined)
        : -1;

    if (behindIdx === -1) {
      behindIdx = findBehindIndex(() => true);
    }

    if (behindIdx > -1) {
      behindActivity = all[behindIdx];
      intermediateActivities =
        options.direction === "pop"
          ? all.slice(behindIdx + 1, topIdx).filter((activity) => activity.dataset["activityId"])
          : [];
    }
  }

  return {
    topLayer: queryParts(topActivity, appScreenAnatomy.layer),
    topDim: queryParts(topActivity, appScreenAnatomy.dim),
    behindLayer: queryParts(behindActivity, appScreenAnatomy.layer),
    behindDim: queryParts(behindActivity, appScreenAnatomy.dim),
    intermediateActivities,
    intermediateLayers: queryPartsFromActivities(intermediateActivities, appScreenAnatomy.layer),
    intermediateDims: queryPartsFromActivities(intermediateActivities, appScreenAnatomy.dim),
    topTitle: queryParts(topActivity, appBarAnatomy.main),
    behindTitle: queryParts(behindActivity, appBarAnatomy.main),
    intermediateTitles: queryPartsFromActivities(intermediateActivities, appBarAnatomy.main),
    topIcons: queryAllParts(topActivity, appBarAnatomy.icon, appBarAnatomy.custom),
    behindIcons: queryAllParts(behindActivity, appBarAnatomy.icon, appBarAnatomy.custom),
    intermediateIcons: queryAllPartsFromActivities(
      intermediateActivities,
      appBarAnatomy.icon,
      appBarAnatomy.custom,
    ),
    topAppBarRoot: queryParts(topActivity, appBarAnatomy.root),
    behindAppBarRoot: queryParts(behindActivity, appBarAnatomy.root),
    intermediateAppBarRoots: queryPartsFromActivities(intermediateActivities, appBarAnatomy.root),
    topAppBarBackground: queryParts(topActivity, appBarAnatomy.background),
    behindAppBarBackground: queryParts(behindActivity, appBarAnatomy.background),
    intermediateAppBarBackgrounds: queryPartsFromActivities(
      intermediateActivities,
      appBarAnatomy.background,
    ),
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
    ...t.intermediateLayers,
    ...t.intermediateDims,
    ...t.intermediateTitles,
    t.topAppBarRoot,
    t.behindAppBarRoot,
    ...t.intermediateAppBarRoots,
    t.topAppBarBackground,
    t.behindAppBarBackground,
    ...t.intermediateAppBarBackgrounds,
    ...t.topIcons,
    ...t.behindIcons,
    ...t.intermediateIcons,
  ];
  for (const el of all) clearStyles(el);
}

function setActivityPostExitPositions(
  {
    layer,
    dim,
    title,
    icons,
    appBarRoot,
  }: {
    layer: HTMLElement | null;
    dim: HTMLElement | null;
    title: HTMLElement | null;
    icons: HTMLElement[];
    appBarRoot: HTMLElement | null;
  },
  style: TransitionStyle,
) {
  setOpacity(dim, "0");
  setOpacity(appBarRoot, "0");

  if (style === "slideFromRightIOS") {
    setTransform(layer, "translate3d(100%, 0, 0)");
    setOpacity(title, "0");
    setTransform(title, `translate3d(${TITLE_OFFSET_PERCENT}%, 0, 0)`);
    for (const icon of icons) {
      setOpacity(icon, "0");
      setTransform(icon, `translate3d(${TITLE_OFFSET_PERCENT}%, 0, 0)`);
    }
  } else if (style === "fadeFromBottomAndroid") {
    setOpacity(layer, "0");
    setTransform(layer, "translate3d(0, 8vh, 0)");
    setTransform(appBarRoot, "translate3d(0, 8vh, 0)");
  } else {
    setOpacity(layer, "0");
  }
}

export function setIntermediateExitPositions(
  t: TransitionTargets,
  style: TransitionStyle = "slideFromRightIOS",
) {
  for (const activity of t.intermediateActivities) {
    setActivityPostExitPositions(
      {
        layer: queryParts(activity, appScreenAnatomy.layer),
        dim: queryParts(activity, appScreenAnatomy.dim),
        title: queryParts(activity, appBarAnatomy.main),
        icons: queryAllParts(activity, appBarAnatomy.icon, appBarAnatomy.custom),
        appBarRoot: queryParts(activity, appBarAnatomy.root),
      },
      style,
    );
  }
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
  setActivityPostExitPositions(
    {
      layer: t.topLayer,
      dim: t.topDim,
      title: t.topTitle,
      icons: t.topIcons,
      appBarRoot: t.topAppBarRoot,
    },
    style,
  );
  setIntermediateExitPositions(t, style);
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
}

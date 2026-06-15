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
  topTitle: HTMLElement | null;
  behindTitle: HTMLElement | null;
  topIcons: HTMLElement[];
  behindIcons: HTMLElement[];
  topAppBarRoot: HTMLElement | null;
  behindAppBarRoot: HTMLElement | null;
  topAppBarBackground: HTMLElement | null;
  behindAppBarBackground: HTMLElement | null;
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
    const all = Array.from(
      stackEl.querySelectorAll<HTMLElement>(`[data-part='${appScreenAnatomy.activity}']`),
    );
    const topId = topActivity.dataset["activityId"];
    const topIdx = all.findIndex((el) => el.dataset["activityId"] === topId);
    for (let i = topIdx - 1; i >= 0; i--) {
      if (all[i].dataset["activityId"]) {
        behindActivity = all[i];
        break;
      }
    }
  }

  return {
    topLayer: queryParts(topActivity, appScreenAnatomy.layer),
    topDim: queryParts(topActivity, appScreenAnatomy.dim),
    behindLayer: queryParts(behindActivity, appScreenAnatomy.layer),
    behindDim: queryParts(behindActivity, appScreenAnatomy.dim),
    topTitle: queryParts(topActivity, appBarAnatomy.main),
    behindTitle: queryParts(behindActivity, appBarAnatomy.main),
    topIcons: queryAllParts(topActivity, appBarAnatomy.icon, appBarAnatomy.custom),
    behindIcons: queryAllParts(behindActivity, appBarAnatomy.icon, appBarAnatomy.custom),
    topAppBarRoot: queryParts(topActivity, appBarAnatomy.root),
    behindAppBarRoot: queryParts(behindActivity, appBarAnatomy.root),
    topAppBarBackground: queryParts(topActivity, appBarAnatomy.background),
    behindAppBarBackground: queryParts(behindActivity, appBarAnatomy.background),
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
    t.topAppBarBackground,
    t.behindAppBarBackground,
    ...t.topIcons,
    ...t.behindIcons,
  ];
  for (const el of all) clearStyles(el);
}

/**
 * 전환이 정착한 뒤(globalTransitionState === "idle") top 액티비티에 남은
 * inline 스타일을 모두 제거한다.
 *
 * top + behind 쌍 모델은 즉시 인접한 behind 한 겹만 다룬다. 전환이 겹치면
 * (동시 pop, swipe-back race 등) 착지 화면이 "behind"나 "나가는 top"의 임시
 * 스타일에 stuck될 수 있다 — layer가 -30%에 남아 1/3 밀리거나, appBar root가
 * opacity 0(setPostExitPositions)에 남아 앱바가 통째로 사라진다.
 *
 * idle에서 top은 항상 깨끗한 기본 상태여야 하므로(setIdlePositions는 top을
 * clear만 하고 behind에만 스타일을 건다), 남은 inline을 지워 CSS 기본값
 * (layer 0%, appBar 표시)으로 되돌린다. behind는 건드리지 않고, 이미 깨끗하면 no-op이다.
 */
export function clearTopActivityStyles(stackEl: HTMLElement) {
  const t = findTransitionTargets(stackEl);
  const topParts = [
    t.topLayer,
    t.topDim,
    t.topTitle,
    t.topAppBarRoot,
    t.topAppBarBackground,
    ...t.topIcons,
  ];
  for (const el of topParts) clearStyles(el);
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
}

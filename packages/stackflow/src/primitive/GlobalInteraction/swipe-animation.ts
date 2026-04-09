/**
 * Swipe-back inline style helpers.
 *
 * During swiping (touchmove), we apply transform/opacity directly to each
 * animated element via inline style instead of CSS variables on the stack root.
 * This avoids cascading style recalculation across the entire subtree.
 *
 * On touchend, we remove inline styles and set CSS variables once so the
 * existing CSS recipe transition (completing/canceling) takes over seamlessly.
 */

// Constants matching qvism-preset/stackflow/animation.ts
const BEHIND_OFFSET = -30; // %
const BEHIND_PARALLAX = 0.3;
const OPACITY_FADE_MUL = 3;
const TITLE_TRANSLATE = 0.15;

// Selectors for finding app-bar elements
const SEL_APP_BAR_MAIN_ROOT = '[class*="seed-app-bar-main__root"]';
const SEL_APP_BAR_ROOT = '[class*="seed-app-bar__root"]';
const SEL_APP_BAR_ICON = '[class*="seed-app-bar__icon"]';
const SEL_APP_BAR_CUSTOM = '[class*="seed-app-bar__custom"]';

export interface SwipeTargets {
  topLayer: HTMLElement | null;
  topDim: HTMLElement | null;
  behindLayer: HTMLElement | null;
  topTitle: HTMLElement | null;
  behindTitle: HTMLElement | null;
  topIcons: HTMLElement[];
  behindIcons: HTMLElement[];
  topAppBarRoot: HTMLElement | null;
}

/** Query DOM once at swipe start, cache results for the gesture duration. */
export function findSwipeTargets(stackEl: HTMLElement): SwipeTargets {
  const topActivity = stackEl.querySelector<HTMLElement>("[data-activity-is-top]");

  let behindActivity: HTMLElement | null = null;
  if (topActivity) {
    const all = stackEl.querySelectorAll<HTMLElement>("[data-part='activity']");
    const topId = topActivity.dataset["activityId"];
    let found = false;
    for (let i = all.length - 1; i >= 0; i--) {
      const id = all[i].dataset["activityId"];
      if (id === topId) {
        found = true;
        continue;
      }
      if (found && id) {
        behindActivity = all[i];
        break;
      }
    }
  }

  return {
    topLayer: topActivity?.querySelector<HTMLElement>("[data-part='layer']") ?? null,
    topDim: topActivity?.querySelector<HTMLElement>("[data-part='dim']") ?? null,
    behindLayer: behindActivity?.querySelector<HTMLElement>("[data-part='layer']") ?? null,
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
  };
}

/** Apply inline styles during swiping. Overrides CSS recipe values. */
export function applySwipeStyles(t: SwipeTargets, displacement: number, ratio: number): void {
  // Top layer
  if (t.topLayer) {
    t.topLayer.style.transform = `translate3d(${displacement}px, 0, 0)`;
  }
  // Behind layer (parallax)
  if (t.behindLayer) {
    t.behindLayer.style.transform = `translate3d(calc(${BEHIND_OFFSET}% + ${displacement * BEHIND_PARALLAX}px), 0, 0)`;
  }
  // Dim
  if (t.topDim) {
    t.topDim.style.opacity = `${1 - ratio}`;
  }
  // Title
  if (t.topTitle) {
    t.topTitle.style.opacity = `${Math.max(0, 1 - ratio * OPACITY_FADE_MUL)}`;
    t.topTitle.style.transform = `translate3d(${displacement * TITLE_TRANSLATE}px, 0, 0)`;
  }
  if (t.behindTitle) {
    t.behindTitle.style.opacity = `${ratio}`;
    t.behindTitle.style.transform = `translate3d(calc(-25% + ${displacement * TITLE_TRANSLATE}px), 0, 0)`;
  }
  // Icons
  for (const icon of t.topIcons) {
    icon.style.opacity = `${Math.max(0, 1 - ratio * OPACITY_FADE_MUL)}`;
    icon.style.transform = `translate3d(${displacement * TITLE_TRANSLATE}px, 0, 0)`;
  }
  for (const icon of t.behindIcons) {
    icon.style.opacity = `${ratio}`;
  }
  // AppBar background ::before — can't inline on pseudo, use scoped CSS var
  if (t.topAppBarRoot) {
    t.topAppBarRoot.style.setProperty("--swipe-back-displacement", `${displacement}px`);
  }
}

/** Remove all inline styles so CSS recipe regains control. */
export function clearInlineStyles(t: SwipeTargets): void {
  const els = [t.topLayer, t.topDim, t.behindLayer, t.topTitle, t.behindTitle];
  for (const el of els) {
    if (!el) continue;
    el.style.transform = "";
    el.style.opacity = "";
  }
  for (const icon of [...t.topIcons, ...t.behindIcons]) {
    icon.style.transform = "";
    icon.style.opacity = "";
  }
  // Clear scoped CSS var from appBar root (stack root will set the global one)
  if (t.topAppBarRoot) {
    t.topAppBarRoot.style.removeProperty("--swipe-back-displacement");
  }
}

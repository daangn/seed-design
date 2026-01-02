export const push = "[data-global-transition-state=enter-active] &[data-activity-is-top]";
export const pop = "[data-global-transition-state=exit-active] &[data-activity-is-top]";
export const idle = "[data-global-transition-state=enter-done] &[data-activity-is-top]";
export const pushBehind =
  '[data-global-transition-state=enter-active][data-top-activity-type="full-screen"] &:not([data-activity-is-top])';
export const popBehind =
  '[data-global-transition-state=exit-active][data-top-activity-type="full-screen"] &:not([data-activity-is-top])';
export const idleBehind =
  '[data-global-transition-state=enter-done][data-top-activity-type="full-screen"] &:not([data-activity-is-top])';

// :not(#\\#) is used to force increasing specificity
export const swipeBackSwiping = "[data-swipe-back-state=swiping] &[data-activity-is-top]:not(#\\#)";
export const swipeBackSwipingBehind =
  "[data-swipe-back-state=swiping] &:not([data-activity-is-top]):not(#\\#)";

// Transitioning state should use idle animation to smoothly return from swipe position
export const swipeBackCanceling =
  "[data-swipe-back-state=canceling] &[data-activity-is-top]:not(#\\#)";
export const swipeBackCancelingBehind =
  "[data-swipe-back-state=canceling] &:not([data-activity-is-top]):not(#\\#)";

export const swipeBackCompleting =
  "[data-swipe-back-state=completing] &[data-activity-is-top]:not(#\\#)";
export const swipeBackCompletingBehind =
  "[data-swipe-back-state=completing] &:not([data-activity-is-top]):not(#\\#)";

export const pushBehindFollowTop = (topStyle: string): string =>
  `[data-global-transition-state=enter-active][data-top-transition-style="${topStyle}"][data-top-activity-type="full-screen"] &:not([data-activity-is-top]):not(#\\#):not(#\\#)`;
export const popBehindFollowTop = (topStyle: string): string =>
  `[data-global-transition-state=exit-active][data-top-transition-style="${topStyle}"][data-top-activity-type="full-screen"] &:not([data-activity-is-top]):not(#\\#):not(#\\#)`;
export const idleBehindFollowTop = (topStyle: string): string =>
  `[data-swipe-back-state=idle][data-global-transition-state=enter-done][data-top-transition-style="${topStyle}"][data-top-activity-type="full-screen"] &:not([data-activity-is-top]):not(#\\#):not(#\\#)`;
export const swipeBackSwipingBehindFollowTop = (topStyle: string): string =>
  `[data-swipe-back-state=swiping][data-top-transition-style="${topStyle}"] &:not([data-activity-is-top]):not(#\\#):not(#\\#)`;
export const swipeBackCancelingBehindFollowTop = (topStyle: string): string =>
  `[data-swipe-back-state=canceling][data-top-transition-style="${topStyle}"] &:not([data-activity-is-top]):not(#\\#):not(#\\#)`;
export const swipeBackCompletingBehindFollowTop = (topStyle: string): string =>
  `[data-swipe-back-state=completing][data-top-transition-style="${topStyle}"] &:not([data-activity-is-top]):not(#\\#):not(#\\#)`;

// Used for z-index adjustments when behind a specific transition style
export const behindWhenTopIs = (topStyle: string): string =>
  `[data-top-transition-style="${topStyle}"] &:not([data-activity-is-top]):not(#\\#):not(#\\#)`;

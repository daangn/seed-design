import { actionButtonHandler } from "./handlers/action-button";
import { actionChipHandler } from "./handlers/action-chip";
import { actionSheetHandler } from "./handlers/action-sheet";
import { appBarHandler } from "./handlers/app-bar";
import { avatarHandler } from "./handlers/avatar";
import { avatarStackHandler } from "./handlers/avatar-stack";
import { badgeHandler } from "./handlers/badge";
import { calloutHandler } from "./handlers/callout";
import { checkboxHandler } from "./handlers/checkbox";
import { chipTabsHandler } from "./handlers/chip-tabs";
import { controlChipHandler } from "./handlers/control-chip";
import { errorStateHandler } from "./handlers/error-state";
import { extendedActionSheetHandler } from "./handlers/extended-action-sheet";
import { extendedFabHandler } from "./handlers/extended-fab";
import { fabHandler } from "./handlers/fab";
import { helpBubbleHandler } from "./handlers/help-bubble";
import { identityPlaceholderHandler } from "./handlers/identity-placeholder";
import { inlineBannerHandler } from "./handlers/inline-banner";
import { mannerTempBadgeHandler } from "./handlers/manner-temp-badge";
import { multilineTextFieldHandler } from "./handlers/multiline-text-field";
import { progressCircleHandler } from "./handlers/progress-circle";
import { reactionButtonHandler } from "./handlers/reaction-button";
import { segmentedControlHandler } from "./handlers/segmented-control";
import { selectBoxGroupHandler, selectBoxHandler } from "./handlers/select-box";
import { skeletonHandler } from "./handlers/skeleton";
import { snackbarHandler } from "./handlers/snackbar";
import { switchHandler } from "./handlers/switch";
import { tabsHandler } from "./handlers/tabs";
import { textButtonHandler } from "./handlers/text-button";
import { textFieldHandler } from "./handlers/text-field";
import { toggleButtonHandler } from "./handlers/toggle-button";
import type { ComponentHandler } from "./type-helper";

const componentHandlers = [
  actionButtonHandler,
  actionChipHandler,
  actionSheetHandler,
  appBarHandler,
  avatarHandler,
  avatarStackHandler,
  badgeHandler,
  calloutHandler,
  checkboxHandler,
  chipTabsHandler,
  controlChipHandler,
  errorStateHandler,
  extendedActionSheetHandler,
  extendedFabHandler,
  fabHandler,
  helpBubbleHandler,
  identityPlaceholderHandler,
  inlineBannerHandler,
  mannerTempBadgeHandler,
  multilineTextFieldHandler,
  progressCircleHandler,
  reactionButtonHandler,
  segmentedControlHandler,
  selectBoxGroupHandler,
  selectBoxHandler,
  skeletonHandler,
  snackbarHandler,
  switchHandler,
  tabsHandler,
  textButtonHandler,
  textFieldHandler,
  toggleButtonHandler,
] as ComponentHandler[];

export const componentHandlerMap = new Map(
  componentHandlers.map((component) => [component.key, component]),
);

export const ignoredComponentKeys = new Set<string>([
  "1acdc7247c83a73a0504d6fad86d08783938cb1a",
  "b38b719b61cdf1a24458d7a7888bee74b7649084",
]);

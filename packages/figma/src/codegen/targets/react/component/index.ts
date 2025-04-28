import type { ComponentHandler } from "@/codegen/core";
import type { ComponentHandlerDeps } from "./deps.interface";
import { createActionButtonHandler } from "./handlers/action-button";
import { createActionChipHandler } from "./handlers/action-chip";
import { createActionSheetHandler } from "./handlers/action-sheet";
import { createAppBarHandler } from "./handlers/app-bar";
import { createAvatarHandler } from "./handlers/avatar";
import { createAvatarStackHandler } from "./handlers/avatar-stack";
import { createBadgeHandler } from "./handlers/badge";
import { createCalloutHandler } from "./handlers/callout";
import { createCheckboxHandler } from "./handlers/checkbox";
import { createChipTabsHandler } from "./handlers/chip-tabs";
import { createControlChipHandler } from "./handlers/control-chip";
import { createErrorStateHandler } from "./handlers/error-state";
import { createExtendedActionSheetHandler } from "./handlers/extended-action-sheet";
import { createExtendedFabHandler } from "./handlers/extended-fab";
import { createFabHandler } from "./handlers/fab";
import { createHelpBubbleHandler } from "./handlers/help-bubble";
import { createIdentityPlaceholderHandler } from "./handlers/identity-placeholder";
import { createInlineBannerHandler } from "./handlers/inline-banner";
import { createMannerTempBadgeHandler } from "./handlers/manner-temp-badge";
import { createMultilineTextFieldHandler } from "./handlers/multiline-text-field";
import { createProgressCircleHandler } from "./handlers/progress-circle";
import { createReactionButtonHandler } from "./handlers/reaction-button";
import { createSegmentedControlHandler } from "./handlers/segmented-control";
import { createSelectBoxGroupHandler, createSelectBoxHandler } from "./handlers/select-box";
import { createSkeletonHandler } from "./handlers/skeleton";
import { createSnackbarHandler } from "./handlers/snackbar";
import { createSwitchHandler } from "./handlers/switch";
import { createTabsHandler } from "./handlers/tabs";
import { createTextButtonHandler } from "./handlers/text-button";
import { createTextFieldHandler } from "./handlers/text-field";
import { createToggleButtonHandler } from "./handlers/toggle-button";

export type { ComponentHandlerDeps };
export type UnboundComponentHandler<T extends ComponentHandler<any>> = (
  deps: ComponentHandlerDeps,
) => T;

export function bindComponentHandler<T extends UnboundComponentHandler<any>>(
  unbound: T,
  deps: ComponentHandlerDeps,
) {
  return unbound(deps);
}

export const unboundSeedComponentHandlers: Array<UnboundComponentHandler<any>> = [
  createActionButtonHandler,
  createActionChipHandler,
  createActionSheetHandler,
  createAppBarHandler,
  createAvatarHandler,
  createAvatarStackHandler,
  createBadgeHandler,
  createCalloutHandler,
  createCheckboxHandler,
  createChipTabsHandler,
  createControlChipHandler,
  createErrorStateHandler,
  createExtendedActionSheetHandler,
  createExtendedFabHandler,
  createFabHandler,
  createHelpBubbleHandler,
  createIdentityPlaceholderHandler,
  createInlineBannerHandler,
  createMannerTempBadgeHandler,
  createMultilineTextFieldHandler,
  createProgressCircleHandler,
  createReactionButtonHandler,
  createSegmentedControlHandler,
  createSelectBoxGroupHandler,
  createSelectBoxHandler,
  createSkeletonHandler,
  createSnackbarHandler,
  createSwitchHandler,
  createTabsHandler,
  createTextButtonHandler,
  createTextFieldHandler,
  createToggleButtonHandler,
];

import type { ComponentHandler } from "@/codegen/core";
import type { NormalizedInstanceNode } from "@/normalizer";
import type { ComponentHandlerDeps } from "./deps.interface";

import {
  createActionButtonHandler,
  createActionButtonGhostHandler,
} from "./handlers/action-button";
import { createAlertDialogHandler } from "./handlers/alert-dialog";
import { createAppBarHandler } from "./handlers/app-bar";
import { createAvatarHandler } from "./handlers/avatar";
import { createAvatarStackHandler } from "./handlers/avatar-stack";
import { createBadgeHandler } from "./handlers/badge";
import { createBottomSheetHandler } from "./handlers/bottom-sheet";
import { createCalloutHandler } from "./handlers/callout";
import { createCheckboxHandler } from "./handlers/checkbox";
import { createCheckmarkHandler } from "@/codegen/targets/react/component/handlers/checkmark";
import { createChipHandler } from "./handlers/chip";
import { createContextualFloatingButtonHandler } from "./handlers/contextual-floating-button";
import { createDividerHandler } from "./handlers/divider";
import { createErrorStateHandler } from "./handlers/error-state";
import { createFloatingActionButtonHandler } from "./handlers/floating-action-button";
import { createHelpBubbleHandler } from "./handlers/help-bubble";
import { createIdentityPlaceholderHandler } from "./handlers/identity-placeholder";
import { createMannerTempBadgeHandler } from "./handlers/manner-temp-badge";
import { createMannerTempHandler } from "./handlers/manner-temp";
import { createMenuSheetHandler } from "./handlers/menu-sheet";
import { createMultilineTextFieldHandler } from "./handlers/multiline-text-field";
import { createPageBannerHandler } from "./handlers/page-banner";
import { createProgressCircleHandler } from "./handlers/progress-circle";
import { createRadioMarkHandler } from "@/codegen/targets/react/component/handlers/radio-mark";
import { createRadioGroupItemHandler } from "@/codegen/targets/react/component/handlers/radio-group";
import { createReactionButtonHandler } from "./handlers/reaction-button";
import { createSegmentedControlHandler } from "./handlers/segmented-control";
import { createSelectBoxGroupHandler, createSelectBoxHandler } from "./handlers/select-box";
import { createSkeletonHandler } from "./handlers/skeleton";
import { createSnackbarHandler } from "./handlers/snackbar";
import { createSwitchHandler } from "./handlers/switch";
import { createTabsHandler } from "@/codegen/targets/react/component/handlers/tabs";
import { createTextFieldHandler } from "./handlers/text-field";
import { createToggleButtonHandler } from "./handlers/toggle-button";
import { createListItemHandler } from "@/codegen/targets/react/component/handlers/list-item";

export type { ComponentHandlerDeps };
export type UnboundComponentHandler<T extends NormalizedInstanceNode["componentProperties"]> = (
  deps: ComponentHandlerDeps,
) => ComponentHandler<T>;

export function bindComponentHandler<T extends NormalizedInstanceNode["componentProperties"]>(
  unbound: UnboundComponentHandler<T>,
  deps: ComponentHandlerDeps,
): ComponentHandler<T> {
  return unbound(deps);
}

export const unboundSeedComponentHandlers: Array<UnboundComponentHandler<any>> = [
  createActionButtonGhostHandler,
  createActionButtonHandler,
  createAlertDialogHandler,
  createAppBarHandler,
  createAvatarHandler,
  createAvatarStackHandler,
  createBadgeHandler,
  createBottomSheetHandler,
  createCalloutHandler,
  createCheckboxHandler,
  createCheckmarkHandler,
  createChipHandler,
  createContextualFloatingButtonHandler,
  createDividerHandler,
  createErrorStateHandler,
  createFloatingActionButtonHandler,
  createHelpBubbleHandler,
  createIdentityPlaceholderHandler,
  createListItemHandler,
  createMannerTempBadgeHandler,
  createMannerTempHandler,
  createMenuSheetHandler,
  createMultilineTextFieldHandler,
  createPageBannerHandler,
  createProgressCircleHandler,
  createRadioGroupItemHandler,
  createRadioMarkHandler,
  createReactionButtonHandler,
  createSegmentedControlHandler,
  createSelectBoxGroupHandler,
  createSelectBoxHandler,
  createSkeletonHandler,
  createSnackbarHandler,
  createSwitchHandler,
  createTabsHandler,
  createTextFieldHandler,
  createToggleButtonHandler,
];

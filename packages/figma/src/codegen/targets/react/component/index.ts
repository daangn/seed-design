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
import {
  createFieldButtonHandler,
  createAddressFieldHandler,
  createDatePickerFieldHandler,
  createSelectFieldHandler,
  createTimePickerFieldHandler,
} from "@/codegen/targets/react/component/handlers/field-button";
import { createFloatingActionButtonHandler } from "./handlers/floating-action-button";
import { createHelpBubbleHandler } from "./handlers/help-bubble";
import { createIdentityPlaceholderHandler } from "./handlers/identity-placeholder";
import { createListHeaderHandler } from "@/codegen/targets/react/component/handlers/list-header";
import { createListItemHandler } from "@/codegen/targets/react/component/handlers/list-item";
import { createMannerTempBadgeHandler } from "./handlers/manner-temp-badge";
import { createMannerTempHandler } from "./handlers/manner-temp";
import { createMenuSheetHandler } from "./handlers/menu-sheet";
import { createPageBannerHandler } from "./handlers/page-banner";
import { createProgressCircleHandler } from "./handlers/progress-circle";
import { createRadioGroupItemHandler } from "@/codegen/targets/react/component/handlers/radio-group";
import { createRadiomarkHandler } from "@/codegen/targets/react/component/handlers/radiomark";
import { createReactionButtonHandler } from "./handlers/reaction-button";
import { createResultSectionHandler } from "./handlers/result-section";
import { createSegmentedControlHandler } from "./handlers/segmented-control";
import { createSkeletonHandler } from "./handlers/skeleton";
import {
  createSliderHandler,
  createSliderFieldHandler,
} from "@/codegen/targets/react/component/handlers/slider";
import { createSnackbarHandler } from "./handlers/snackbar";
import { createSwitchmarkHandler } from "@/codegen/targets/react/component/handlers/switchmark";
import { createSwitchHandler } from "./handlers/switch";
import { createTabsHandler } from "@/codegen/targets/react/component/handlers/tabs";
import { createTextInputFieldHandler, createTextareaFieldHandler } from "./handlers/text-field";
import { createToggleButtonHandler } from "./handlers/toggle-button";
import {
  createTagGroupHandler,
  createTagGroupItemHandler,
} from "@/codegen/targets/react/component/handlers/tag-group";
import {
  createLegacyTextFieldHandler,
  createLegacyMultilineTextFieldHandler,
} from "./handlers/legacy-text-field";
import {
  createLegacySelectBoxHandler,
  createLegacySelectBoxGroupHandler,
} from "./handlers/legacy-select-box";

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
  createTextInputFieldHandler,
  createTextareaFieldHandler,

  createLegacyTextFieldHandler,
  createLegacyMultilineTextFieldHandler,

  createBadgeHandler,
  createChipHandler,
  createCalloutHandler,
  createPageBannerHandler,
  createCheckboxHandler,
  createCheckmarkHandler,
  createRadioGroupItemHandler,
  createRadiomarkHandler,
  createSwitchHandler,
  createSwitchmarkHandler,
  createAlertDialogHandler,
  createDividerHandler,
  createAvatarHandler,
  createAvatarStackHandler,
  createSegmentedControlHandler,

  createLegacySelectBoxHandler,
  createLegacySelectBoxGroupHandler,

  createSliderHandler,
  createSliderFieldHandler,
  createTabsHandler,
  createTagGroupHandler,
  createTagGroupItemHandler,
  createToggleButtonHandler,
  createAppBarHandler,
  createBottomSheetHandler,
  createFieldButtonHandler,
  createAddressFieldHandler,
  createDatePickerFieldHandler,
  createSelectFieldHandler,
  createTimePickerFieldHandler,
  createResultSectionHandler,
  createContextualFloatingButtonHandler,
  createFloatingActionButtonHandler,
  createHelpBubbleHandler,
  createIdentityPlaceholderHandler,
  createListHeaderHandler,
  createListItemHandler,
  createMannerTempBadgeHandler,
  createMannerTempHandler,
  createMenuSheetHandler,
  createProgressCircleHandler,
  createReactionButtonHandler,
  createSkeletonHandler,
  createSnackbarHandler,
];

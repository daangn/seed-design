import type { ComponentTransformer } from "@/codegen/core";
import type { SeedComponentTransformerDeps } from "./deps.interface";
import { createActionButtonTransformer } from "./transformers/action-button";
import { createActionChipTransformer } from "./transformers/action-chip";
import { createActionSheetTransformer } from "./transformers/action-sheet";
import { createAppBarTransformer } from "./transformers/app-bar";
import { createAvatarTransformer } from "./transformers/avatar";
import { createAvatarStackTransformer } from "./transformers/avatar-stack";
import { createBadgeTransformer } from "./transformers/badge";
import { createCalloutTransformer } from "./transformers/callout";
import { createCheckboxTransformer } from "./transformers/checkbox";
import { createChipTabsTransformer } from "./transformers/chip-tabs";
import { createControlChipTransformer } from "./transformers/control-chip";
import { createErrorStateTransformer } from "./transformers/error-state";
import { createExtendedActionSheetTransformer } from "./transformers/extended-action-sheet";
import { createExtendedFabTransformer } from "./transformers/extended-fab";
import { createFabTransformer } from "./transformers/fab";
import { createHelpBubbleTransformer } from "./transformers/help-bubble";
import { createIdentityPlaceholderTransformer } from "./transformers/identity-placeholder";
import { createInlineBannerTransformer } from "./transformers/inline-banner";
import { createMannerTempBadgeTransformer } from "./transformers/manner-temp-badge";
import { createMultilineTextFieldTransformer } from "./transformers/multiline-text-field";
import { createProgressCircleTransformer } from "./transformers/progress-circle";
import { createReactionButtonTransformer } from "./transformers/reaction-button";
import { createSegmentedControlTransformer } from "./transformers/segmented-control";
import {
  createSelectBoxGroupTransformer,
  createSelectBoxTransformer,
} from "./transformers/select-box";
import { createSkeletonTransformer } from "./transformers/skeleton";
import { createSnackbarTransformer } from "./transformers/snackbar";
import { createSwitchTransformer } from "./transformers/switch";
import { createTabsTransformer } from "./transformers/tabs";
import { createTextButtonTransformer } from "./transformers/text-button";
import { createTextFieldTransformer } from "./transformers/text-field";
import { createToggleButtonTransformer } from "./transformers/toggle-button";

export type * from "./properties.type";
export type { SeedComponentTransformerDeps };

export const createSeedComponentTransformers = (
  ctx: SeedComponentTransformerDeps,
): ComponentTransformer<any>[] => [
  createActionButtonTransformer(ctx),
  createActionChipTransformer(ctx),
  createActionSheetTransformer(ctx),
  createAppBarTransformer(ctx),
  createAvatarTransformer(ctx),
  createAvatarStackTransformer(ctx),
  createBadgeTransformer(ctx),
  createCalloutTransformer(ctx),
  createCheckboxTransformer(ctx),
  createChipTabsTransformer(ctx),
  createControlChipTransformer(ctx),
  createErrorStateTransformer(ctx),
  createExtendedActionSheetTransformer(ctx),
  createExtendedFabTransformer(ctx),
  createFabTransformer(ctx),
  createHelpBubbleTransformer(ctx),
  createIdentityPlaceholderTransformer(ctx),
  createInlineBannerTransformer(ctx),
  createMannerTempBadgeTransformer(ctx),
  createMultilineTextFieldTransformer(ctx),
  createProgressCircleTransformer(ctx),
  createReactionButtonTransformer(ctx),
  createSegmentedControlTransformer(ctx),
  createSelectBoxGroupTransformer(ctx),
  createSelectBoxTransformer(ctx),
  createSkeletonTransformer(ctx),
  createSnackbarTransformer(ctx),
  createSwitchTransformer(ctx),
  createTabsTransformer(ctx),
  createTextButtonTransformer(ctx),
  createTextFieldTransformer(ctx),
  createToggleButtonTransformer(ctx),
];

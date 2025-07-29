import type { InferComponentDefinition } from "@/codegen/core";
import type * as metadata from "@/entities/data/__generated__/component-sets";

export type ActionButtonProperties = InferComponentDefinition<
  typeof metadata.actionButton.componentPropertyDefinitions
>;

export type ActionButtonGhostProperties = InferComponentDefinition<{
  "Label#30511:2": {
    type: "TEXT";
    defaultValue: "라벨";
  };
  "Prefix Icon#30511:3": {
    type: "INSTANCE_SWAP";
    defaultValue: "26621:24682";
    preferredValues: [];
  };
  "Suffix Icon#30525:0": {
    type: "INSTANCE_SWAP";
    defaultValue: "26621:23545";
    preferredValues: [
      {
        type: "COMPONENT_SET";
        key: "c8415f85843e5aea5a1d3620d03d16b643bf86cd";
      },
      {
        type: "COMPONENT_SET";
        key: "0d0a2bc648a2c4e1f06a56a30ef16299b6e91037";
      },
      {
        type: "COMPONENT_SET";
        key: "8f28ae559baf8f388d84ccc3ad65a282966e1b05";
      },
      {
        type: "COMPONENT_SET";
        key: "57341e8a9961bf31590240dd288e57c76969098d";
      },
    ];
  };
  "Icon#30525:15": {
    type: "INSTANCE_SWAP";
    defaultValue: "34885:102336";
    preferredValues: [];
  };
  Bleed: {
    type: "VARIANT";
    defaultValue: "true";
    variantOptions: ["true", "false"];
  };
  Size: {
    type: "VARIANT";
    defaultValue: "Medium";
    variantOptions: ["Xsmall", "Small", "Medium", "Large"];
  };
  Layout: {
    type: "VARIANT";
    defaultValue: "Icon First";
    variantOptions: ["Text Only", "Icon First", "Icon Last", "Icon Only"];
  };
  State: {
    type: "VARIANT";
    defaultValue: "Enabled";
    variantOptions: ["Enabled", "Pressed", "Loading", "Disabled"];
  };
}>;

export type AlertDialogProperties = InferComponentDefinition<
  typeof metadata.alertDialog.componentPropertyDefinitions
>;

export type AlertDialogFooterProperties = InferComponentDefinition<{
  Type: {
    type: "VARIANT";
    defaultValue: "Single";
    variantOptions: [
      "Single",
      "Neutral",
      "Neutral (Overflow)",
      "Critical",
      "Critical (Overflow)",
      "Nonpreferred",
    ];
  };
}>;

export type ActionChipProperties = InferComponentDefinition<
  typeof metadata.actionChip.componentPropertyDefinitions
>;

export type AvatarProperties = InferComponentDefinition<
  typeof metadata.avatar.componentPropertyDefinitions
>;

export type AvatarStackProperties = InferComponentDefinition<
  typeof metadata.avatarStack.componentPropertyDefinitions
>;

export type BadgeProperties = InferComponentDefinition<
  typeof metadata.badge.componentPropertyDefinitions
>;

export type BottomSheetProperties = InferComponentDefinition<
  typeof metadata.bottomSheet.componentPropertyDefinitions
>;

export type CalloutProperties = InferComponentDefinition<
  typeof metadata.callout.componentPropertyDefinitions
>;

export type CheckboxProperties = InferComponentDefinition<
  typeof metadata.checkbox.componentPropertyDefinitions
>;

export type ContextualFloatingButtonProperties = InferComponentDefinition<
  typeof metadata.contextualFloatingButton.componentPropertyDefinitions
>;

export type ControlChipProperties = InferComponentDefinition<
  typeof metadata.controlChip.componentPropertyDefinitions
>;

export type DividerProperties = InferComponentDefinition<
  typeof metadata.divider.componentPropertyDefinitions
>;

export type ErrorStateProperties = InferComponentDefinition<
  typeof metadata.templateErrorState.componentPropertyDefinitions
>;

export type MenuSheetProperties = InferComponentDefinition<
  typeof metadata.menuSheet.componentPropertyDefinitions
>;

export type MenuSheetGroupProperties = InferComponentDefinition<{
  "Action Count": {
    type: "VARIANT";
    defaultValue: "8";
    variantOptions: ["1", "2", "3", "4", "5", "6", "7", "8"];
  };
}>;

export type MenuSheetItemProperties = InferComponentDefinition<{
  "Show Prefix Icon#17043:5": {
    type: "BOOLEAN";
    defaultValue: true;
  };
  "Label#55905:8": {
    type: "TEXT";
    defaultValue: "라벨";
  };
  "Prefix Icon#55948:0": {
    type: "INSTANCE_SWAP";
    defaultValue: "26621:23245";
    preferredValues: [];
  };
  Tone: {
    type: "VARIANT";
    defaultValue: "Neutral";
    variantOptions: ["Neutral", "Critical"];
  };
  State: {
    type: "VARIANT";
    defaultValue: "Enabled";
    variantOptions: ["Enabled", "Pressed", "Disabled"];
  };
  Layout: {
    type: "VARIANT";
    defaultValue: "Text Only";
    variantOptions: ["Text with Icon", "Text Only"];
  };
}>;

export type FloatingActionButtonProperties = InferComponentDefinition<
  typeof metadata.floatingActionButton.componentPropertyDefinitions
>;

export type FloatingActionButtonButtonItemProperties = InferComponentDefinition<{
  "Icon#29766:18": {
    type: "INSTANCE_SWAP";
    defaultValue: "26621:24681";
    preferredValues: [];
  };
  "Label#29808:0": {
    type: "TEXT";
    defaultValue: "라벨";
  };
  State: {
    type: "VARIANT";
    defaultValue: "Enabled";
    variantOptions: ["Enabled", "Pressed"];
  };
  Extended: {
    type: "VARIANT";
    defaultValue: "True";
    variantOptions: ["True", "False"];
  };
}>;

export type FloatingActionButtonMenuItemProperties = InferComponentDefinition<{
  "Icon#29766:0": {
    type: "INSTANCE_SWAP";
    defaultValue: "26621:24681";
    preferredValues: [];
  };
  "Label#29766:9": {
    type: "TEXT";
    defaultValue: "라벨";
  };
  State: {
    type: "VARIANT";
    defaultValue: "Enabled";
    variantOptions: ["Pressed", "Enabled"];
  };
  Extended: {
    type: "VARIANT";
    defaultValue: "True";
    variantOptions: ["True", "False"];
  };
  Open: {
    type: "VARIANT";
    defaultValue: "False";
    variantOptions: ["True", "False"];
  };
}>;

export type HelpBubbleProperties = InferComponentDefinition<
  typeof metadata.helpBubble.componentPropertyDefinitions
>;

export type IdentityPlaceholderProperties = InferComponentDefinition<{
  Identity: {
    type: "VARIANT";
    defaultValue: "Person";
    variantOptions: ["Person", "Business"];
  };
}>;

export type InlineBannerProperties = InferComponentDefinition<
  typeof metadata.inlineBanner.componentPropertyDefinitions
>;

export type MannerTempProperties = InferComponentDefinition<
  typeof metadata.mannerTemp.componentPropertyDefinitions
>;

export type MannerTempBadgeProperties = InferComponentDefinition<
  typeof metadata.mannerTempBadge.componentPropertyDefinitions
>;

export type MultilineTextFieldProperties = InferComponentDefinition<
  typeof metadata.multilineTextField.componentPropertyDefinitions
>;

export type ProgressCircleProperties = InferComponentDefinition<
  typeof metadata.progressCircle.componentPropertyDefinitions
>;

export type ReactionButtonProperties = InferComponentDefinition<
  typeof metadata.reactionButton.componentPropertyDefinitions
>;

export type SegmentedControlProperties = InferComponentDefinition<
  typeof metadata.segmentedControl.componentPropertyDefinitions
>;

export type SegmentedControlItemProperties = InferComponentDefinition<{
  "Label#11366:15": {
    type: "TEXT";
    defaultValue: "라벨";
  };
  State: {
    type: "VARIANT";
    defaultValue: "Enabled";
    variantOptions: ["Enabled", "Pressed", "Selected", "Disabled", "Disabled-Selected"];
  };
}>;

export type SkeletonProperties = InferComponentDefinition<
  typeof metadata.skeleton.componentPropertyDefinitions
>;

export type SnackbarProperties = InferComponentDefinition<
  typeof metadata.snackbar.componentPropertyDefinitions
>;

export type SwitchProperties = InferComponentDefinition<
  typeof metadata.switch.componentPropertyDefinitions
>;

export type ToggleButtonProperties = InferComponentDefinition<
  typeof metadata.toggleButton.componentPropertyDefinitions
>;

export type SelectBoxGroupProperties = InferComponentDefinition<
  typeof metadata.templateSelectBoxGroup.componentPropertyDefinitions
>;

export type SelectBoxProperties = InferComponentDefinition<
  typeof metadata.selectBox.componentPropertyDefinitions
>;

export type ChipTabsProperties = InferComponentDefinition<
  typeof metadata.chipTablist.componentPropertyDefinitions
>;

export type ChipTabsItemProperties = InferComponentDefinition<{
  "Label#8876:0": {
    type: "TEXT";
    defaultValue: "라벨";
  };
  Variant: {
    type: "VARIANT";
    defaultValue: "Neutral Solid";
    variantOptions: ["Neutral Solid", "Brand Solid"];
  };
  State: {
    type: "VARIANT";
    defaultValue: "Enabled";
    variantOptions: [
      "Enabled",
      "Pressed",
      "Selected",
      "Selected-Pressed",
      "Disabled",
      "Disabled-Selected",
    ];
  };
}>;

export type TabsProperties = InferComponentDefinition<
  typeof metadata.tablist.componentPropertyDefinitions
>;

export type TabsHugItemProperties = InferComponentDefinition<{
  "Label#4478:2": {
    type: "TEXT";
    defaultValue: "라벨";
  };
  Size: {
    type: "VARIANT";
    defaultValue: "Small";
    variantOptions: ["Small", "Medium"];
  };
  Notification: {
    type: "VARIANT";
    defaultValue: "False";
    variantOptions: ["True", "False"];
  };
  State: {
    type: "VARIANT";
    defaultValue: "Selected";
    variantOptions: ["Enabled", "Selected", "Disabled"];
  };
}>;

export type TabsFillItemProperties = InferComponentDefinition<{
  "Label#4478:2": {
    type: "TEXT";
    defaultValue: "라벨";
  };
  Size: {
    type: "VARIANT";
    defaultValue: "Small";
    variantOptions: ["Small", "Medium"];
  };
  Notification: {
    type: "VARIANT";
    defaultValue: "False";
    variantOptions: ["True", "False"];
  };
  State: {
    type: "VARIANT";
    defaultValue: "Selected";
    variantOptions: ["Enabled", "Selected", "Disabled"];
  };
}>;

export type TextFieldProperties = InferComponentDefinition<
  typeof metadata.textField.componentPropertyDefinitions
>;

export type AppBarProperties = InferComponentDefinition<
  typeof metadata.topNavigation.componentPropertyDefinitions
>;

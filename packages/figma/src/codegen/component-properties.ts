import type { InferComponentDefinition } from "@/codegen/core";
import type * as metadata from "@/entities/data/__generated__/component-sets";

export type ActionButtonProperties = InferComponentDefinition<
  typeof metadata.actionButton.componentPropertyDefinitions
>;

export type ActionChipProperties = InferComponentDefinition<
  typeof metadata.actionChip.componentPropertyDefinitions
>;

export type ActionSheetProperties = InferComponentDefinition<
  typeof metadata.actionSheet.componentPropertyDefinitions
>;

export type ActionSheetItemProperties = InferComponentDefinition<{
  "Label#15420:4": {
    type: "TEXT";
    defaultValue: "액션 버튼";
  };
  Tone: {
    type: "VARIANT";
    defaultValue: "Default";
    variantOptions: ["Default", "Critical"];
  };
  State: {
    type: "VARIANT";
    defaultValue: "Enabled";
    variantOptions: ["Enabled", "Enabled-Pressed", "Disabled"];
  };
}>;

export type AvatarProperties = InferComponentDefinition<
  typeof metadata.avatar.componentPropertyDefinitions
>;

export type AvatarStackProperties = InferComponentDefinition<
  typeof metadata.avatarStack.componentPropertyDefinitions
>;

export type BadgeProperties = InferComponentDefinition<
  typeof metadata.badge.componentPropertyDefinitions
>;

export type CalloutProperties = InferComponentDefinition<
  typeof metadata.callout.componentPropertyDefinitions
>;

export type CheckboxProperties = InferComponentDefinition<
  typeof metadata.checkbox.componentPropertyDefinitions
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
      "Enabled-Pressed",
      "Enabled-Selected",
      "Enabled-Selected-Pressed",
      "Disabled",
      "Disabled-Selected",
    ];
  };
}>;

export type ControlChipProperties = InferComponentDefinition<
  typeof metadata.controlChip.componentPropertyDefinitions
>;

export type ErrorStateProperties = InferComponentDefinition<
  typeof metadata.errorState.componentPropertyDefinitions
>;

export type ExtendedActionSheetProperties = InferComponentDefinition<
  typeof metadata.extendedActionSheet.componentPropertyDefinitions
>;

export type ExtendedActionSheetGroupProperties = InferComponentDefinition<{
  "Action Count": {
    type: "VARIANT";
    defaultValue: "8";
    variantOptions: ["1", "2", "3", "4", "5", "6", "7", "8"];
  };
}>;

export type ExtendedActionSheetItemProperties = InferComponentDefinition<{
  "Show Prefix Icon#17043:5": {
    type: "BOOLEAN";
    defaultValue: true;
  };
  "Label#55905:8": {
    type: "TEXT";
    defaultValue: "액션 버튼";
  };
  "Prefix Icon#55948:0": {
    type: "INSTANCE_SWAP";
    defaultValue: "17024:100799";
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
    variantOptions: ["Enabled", "Enabled-Pressed", "Disabled"];
  };
}>;

export type ExtendedFabProperties = InferComponentDefinition<
  typeof metadata.extendedFloatingActionButton.componentPropertyDefinitions
>;

export type FabProperties = InferComponentDefinition<
  typeof metadata.floatingActionButton.componentPropertyDefinitions
>;

export type HelpBubbleProperties = InferComponentDefinition<
  typeof metadata.helpBubble.componentPropertyDefinitions
>;

export type IdentityPlaceholderProperties = InferComponentDefinition<
  typeof metadata.identityPlaceholder.componentPropertyDefinitions
>;

export type InlineBannerProperties = InferComponentDefinition<
  typeof metadata.inlineBanner.componentPropertyDefinitions
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
    defaultValue: "Enabled-Selected";
    variantOptions: [
      "Enabled",
      "Enabled-Selected",
      "Enabled-Pressed",
      "Enabled-Selected-Pressed",
      "Disabled",
      "Disabled-Selected",
    ];
  };
}>;

export type SelectBoxGroupProperties = InferComponentDefinition<
  typeof metadata.templateSelectBoxGroup.componentPropertyDefinitions
>;

export type SelectBoxProperties = InferComponentDefinition<
  typeof metadata.selectBox.componentPropertyDefinitions
>;

export type SkeletonProperties = InferComponentDefinition<
  typeof metadata.skeleton.componentPropertyDefinitions
>;

export type SnackbarProperties = InferComponentDefinition<
  typeof metadata.snackbar.componentPropertyDefinitions
>;

export type SwitchProperties = InferComponentDefinition<
  typeof metadata.switch.componentPropertyDefinitions
>;

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
    defaultValue: "Enabled-Selected";
    variantOptions: ["Enabled", "Enabled-Selected", "Disabled"];
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
    defaultValue: "Enabled-Selected";
    variantOptions: ["Enabled", "Enabled-Selected", "Disabled"];
  };
}>;

export type TextButtonProperties = InferComponentDefinition<
  typeof metadata.textButton.componentPropertyDefinitions
>;

export type TextFieldProperties = InferComponentDefinition<
  typeof metadata.textField.componentPropertyDefinitions
>;

export type ToggleButtonProperties = InferComponentDefinition<
  typeof metadata.toggleButton.componentPropertyDefinitions
>;

export type AppBarProperties = InferComponentDefinition<
  typeof metadata.standardNavigation.componentPropertyDefinitions
>;

export type AppBarMainProperties = InferComponentDefinition<{
  "Show Right#16958:13": {
    type: "BOOLEAN";
    defaultValue: false;
  };
  "Subtitle#16958:9": {
    type: "TEXT";
    defaultValue: "서브타이틀";
  };
  "Logo#16958:5": {
    type: "INSTANCE_SWAP";
    defaultValue: "1574:3942";
    preferredValues: [
      {
        type: "COMPONENT_SET";
        key: "c7dab3f6d0df0a150564e696c0df00bd43ffef3f";
      },
    ];
  };
  "Show Left#16958:17": {
    type: "BOOLEAN";
    defaultValue: false;
  };
  "Title#16944:0": {
    type: "TEXT";
    defaultValue: "타이틀";
  };
  Type: {
    type: "VARIANT";
    defaultValue: "Title";
    variantOptions: ["Title", "Title-Subtitle", "Logo"];
  };
}>;

export type AppBarLeftProperties = InferComponentDefinition<{
  Action: {
    type: "VARIANT";
    defaultValue: "Back";
    variantOptions: ["Back", "Close", "Other"];
  };
}>;

export type AppBarRightProperties = InferComponentDefinition<{
  Type: {
    type: "VARIANT";
    defaultValue: "1 Icon";
    variantOptions: ["1 Icon", "2 Icons", "3 Icons", "1 Text"];
  };
}>;

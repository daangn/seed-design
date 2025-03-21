import type { InferFromDefinition } from "./type-helper";
import type * as metadata from "../data/__generated__/component-sets";

export type ActionButtonProperties = InferFromDefinition<
  typeof metadata.actionButton.componentPropertyDefinitions
>;

export type ActionChipProperties = InferFromDefinition<
  typeof metadata.actionChip.componentPropertyDefinitions
>;

export type ActionSheetProperties = InferFromDefinition<
  typeof metadata.actionSheet.componentPropertyDefinitions
>;

export type ActionSheetItemProperties = InferFromDefinition<{
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

export type AvatarProperties = InferFromDefinition<
  typeof metadata.avatar.componentPropertyDefinitions
>;

export type AvatarStackProperties = InferFromDefinition<
  typeof metadata.avatarStack.componentPropertyDefinitions
>;

export type BadgeProperties = InferFromDefinition<
  typeof metadata.badge.componentPropertyDefinitions
>;

export type CalloutProperties = InferFromDefinition<
  typeof metadata.callout.componentPropertyDefinitions
>;

export type CheckboxProperties = InferFromDefinition<
  typeof metadata.checkbox.componentPropertyDefinitions
>;

export type ChipTabsProperties = InferFromDefinition<
  typeof metadata.chipTablist.componentPropertyDefinitions
>;

export type ChipTabsItemProperties = InferFromDefinition<{
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

export type ControlChipProperties = InferFromDefinition<
  typeof metadata.controlChip.componentPropertyDefinitions
>;

export type ErrorStateProperties = InferFromDefinition<
  typeof metadata.errorState.componentPropertyDefinitions
>;

export type ExtendedActionSheetProperties = InferFromDefinition<
  typeof metadata.extendedActionSheet.componentPropertyDefinitions
>;

export type ExtendedActionSheetGroupProperties = InferFromDefinition<{
  "Action Count": {
    type: "VARIANT";
    defaultValue: "8";
    variantOptions: ["1", "2", "3", "4", "5", "6", "7", "8"];
  };
}>;

export type ExtendedActionSheetItemProperties = InferFromDefinition<{
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

export type ExtendedFabProperties = InferFromDefinition<
  typeof metadata.extendedFloatingActionButton.componentPropertyDefinitions
>;

export type FabProperties = InferFromDefinition<
  typeof metadata.floatingActionButton.componentPropertyDefinitions
>;

export type HelpBubbleProperties = InferFromDefinition<
  typeof metadata.helpBubble.componentPropertyDefinitions
>;

export type IdentityPlaceholderProperties = InferFromDefinition<
  typeof metadata.identityPlaceholder.componentPropertyDefinitions
>;

export type InlineBannerProperties = InferFromDefinition<
  typeof metadata.inlineBanner.componentPropertyDefinitions
>;

export type MannerTempBadgeProperties = InferFromDefinition<
  typeof metadata.mannerTempBadge.componentPropertyDefinitions
>;

export type MultilineTextFieldProperties = InferFromDefinition<
  typeof metadata.multilineTextField.componentPropertyDefinitions
>;

export type ProgressCircleProperties = InferFromDefinition<
  typeof metadata.progressCircle.componentPropertyDefinitions
>;

export type ReactionButtonProperties = InferFromDefinition<
  typeof metadata.reactionButton.componentPropertyDefinitions
>;

export type SegmentedControlProperties = InferFromDefinition<
  typeof metadata.segmentedControl.componentPropertyDefinitions
>;

export type SegmentedControlItemProperties = InferFromDefinition<{
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

export type SelectBoxGroupProperties = InferFromDefinition<
  typeof metadata.templateSelectBoxGroup.componentPropertyDefinitions
>;

export type SelectBoxProperties = InferFromDefinition<
  typeof metadata.selectBox.componentPropertyDefinitions
>;

export type SkeletonProperties = InferFromDefinition<
  typeof metadata.skeleton.componentPropertyDefinitions
>;

export type SnackbarProperties = InferFromDefinition<
  typeof metadata.snackbar.componentPropertyDefinitions
>;

export type SwitchProperties = InferFromDefinition<
  typeof metadata.switch.componentPropertyDefinitions
>;

export type TabsProperties = InferFromDefinition<
  typeof metadata.tablist.componentPropertyDefinitions
>;

export type TabsHugItemProperties = InferFromDefinition<{
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

export type TabsFillItemProperties = InferFromDefinition<{
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

export type TextButtonProperties = InferFromDefinition<
  typeof metadata.textButton.componentPropertyDefinitions
>;

export type TextFieldProperties = InferFromDefinition<
  typeof metadata.textField.componentPropertyDefinitions
>;

export type ToggleButtonProperties = InferFromDefinition<
  typeof metadata.toggleButton.componentPropertyDefinitions
>;

export type AppBarProperties = InferFromDefinition<
  typeof metadata.standardNavigation.componentPropertyDefinitions
>;

export type AppBarMainProperties = InferFromDefinition<{
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

export type AppBarLeftProperties = InferFromDefinition<{
  Action: {
    type: "VARIANT";
    defaultValue: "Back";
    variantOptions: ["Back", "Close", "Other"];
  };
}>;

export type AppBarRightProperties = InferFromDefinition<{
  Type: {
    type: "VARIANT";
    defaultValue: "1 Icon";
    variantOptions: ["1 Icon", "2 Icons", "3 Icons", "1 Text"];
  };
}>;

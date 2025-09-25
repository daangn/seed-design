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

export type CheckmarkProperties = InferComponentDefinition<
  typeof metadata.checkmark.componentPropertyDefinitions
>;

export type ChipProperties = InferComponentDefinition<
  typeof metadata.chip.componentPropertyDefinitions
>;

export type ChipIconSuffixProperties = InferComponentDefinition<{
  "Icon#33203:0": {
    type: "INSTANCE_SWAP";
    defaultValue: "26621:23250";
    preferredValues: [];
  };
}>;

export type ContextualFloatingButtonProperties = InferComponentDefinition<
  typeof metadata.contextualFloatingButton.componentPropertyDefinitions
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

export type PageBannerProperties = InferComponentDefinition<
  typeof metadata.pageBanner.componentPropertyDefinitions
>;

export type PageBannerButtonProperties = InferComponentDefinition<{
  "Label#39890:0": {
    type: "TEXT";
    defaultValue: "라벨";
  };
}>;

export type ListHeaderProperties = InferComponentDefinition<
  typeof metadata.listHeader.componentPropertyDefinitions
>;

export type ListItemProperties = InferComponentDefinition<
  typeof metadata.listItem.componentPropertyDefinitions
>;

export type ListItemPrefixIconProperties = InferComponentDefinition<{
  "Icon#28452:111": {
    type: "INSTANCE_SWAP";
    defaultValue: "34885:102336";
    preferredValues: [{ type: "COMPONENT_SET"; key: "1449adc3a216979ac3e6a4a99183a9e9790b220c" }];
  };
}>;

export type ListItemSuffixIconProperties = InferComponentDefinition<{
  "Icon#28347:9": {
    type: "INSTANCE_SWAP";
    defaultValue: "26621:23412";
    preferredValues: [];
  };
}>;

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

export type RadioProperties = InferComponentDefinition<
  typeof metadata.radio.componentPropertyDefinitions
>;

export type RadioMarkProperties = InferComponentDefinition<
  typeof metadata.radioMark.componentPropertyDefinitions
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

export type SwitchMarkProperties = InferComponentDefinition<
  typeof metadata.switchMark.componentPropertyDefinitions
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

export type TextFieldProperties = InferComponentDefinition<
  typeof metadata.textField.componentPropertyDefinitions
>;

export type AppBarProperties = InferComponentDefinition<
  typeof metadata.topNavigation.componentPropertyDefinitions
>;

export type AppBarMainProperties = InferComponentDefinition<{
  "Title#16944:0": {
    type: "TEXT";
    defaultValue: "타이틀";
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
  "Subtitle#16958:9": {
    type: "TEXT";
    defaultValue: "서브타이틀";
  };
  "Show Right#16958:13": {
    type: "BOOLEAN";
    defaultValue: false;
  };
  "Show Left#16958:17": {
    type: "BOOLEAN";
    defaultValue: false;
  };
  Type: {
    type: "VARIANT";
    defaultValue: "Title";
    variantOptions: ["Title", "Title-Subtitle", "Logo (Figma Only)"];
  };
}>;

export type AppBarLeftIconButtonProperties = InferComponentDefinition<{
  "Icon#33580:0": {
    type: "INSTANCE_SWAP";
    defaultValue: "26621:23427";
    preferredValues: [];
  };
}>;

export type AppBarRightIconButtonProperties = InferComponentDefinition<{
  "Icon#6406:3": {
    type: "INSTANCE_SWAP";
    defaultValue: "34885:102301";
    preferredValues: [
      {
        type: "COMPONENT_SET";
        key: "bc7bc98e19d8ffdd9efdc94b610c6af28156f867";
      },
      {
        type: "COMPONENT_SET";
        key: "d766c026e52ee6c78cbf1a474068264e831ddfe3";
      },
      {
        type: "COMPONENT_SET";
        key: "a4cb85e4d25a320d27a48c3e8132a6c01b45ab3c";
      },
      {
        type: "COMPONENT_SET";
        key: "e262d9b447adff63d15a6f1af60ae47cbc1ca47f";
      },
      {
        type: "COMPONENT_SET";
        key: "1d3918afcac320eff3aafc2719b98cf5141afa55";
      },
      {
        type: "COMPONENT_SET";
        key: "8ed05ef62a40f2dc034ee7eb6945bd0e63ad49aa";
      },
      {
        type: "COMPONENT_SET";
        key: "98ee886122c725ac9e3e682f31efd1d1a1bec90d";
      },
      {
        type: "COMPONENT_SET";
        key: "bf71b0c5c8664149298fe1b3c58905715a523e19";
      },
      {
        type: "COMPONENT_SET";
        key: "47a8df3d59bc52aef1c584d992c05771a8125965";
      },
      {
        type: "COMPONENT_SET";
        key: "0fcbc3c123d5c7ee7a5dd20e0860ee25bdc19e30";
      },
    ];
  };
  Notification: {
    type: "VARIANT";
    defaultValue: "False";
    variantOptions: ["False", "True"];
  };
}>;

export type TabsProperties = InferComponentDefinition<
  typeof metadata.tabs.componentPropertyDefinitions
>;

export type TabsLineWrapperProperties = InferComponentDefinition<{
  Size: {
    type: "VARIANT";
    defaultValue: "Medium";
    variantOptions: ["Medium", "Small"];
  };
  Layout: {
    type: "VARIANT";
    defaultValue: "Fill";
    variantOptions: ["Hug", "Fill"];
  };
}>;

export type TabsLineTriggerHugProperties = InferComponentDefinition<{
  "Label#4478:2": {
    type: "TEXT";
    defaultValue: "라벨";
  };
  "Has Notification#32892:0": {
    type: "BOOLEAN";
    defaultValue: false;
  };
  Size: {
    type: "VARIANT";
    defaultValue: "Small";
    variantOptions: ["Medium", "Small"];
  };
  State: {
    type: "VARIANT";
    defaultValue: "Selected";
    variantOptions: ["Enabled", "Selected", "Disabled"];
  };
}>;

export type TabsLineTriggerFillProperties = InferComponentDefinition<{
  "Label#4478:2": {
    type: "TEXT";
    defaultValue: "라벨";
  };
  "Has Notification#32904:13": {
    type: "BOOLEAN";
    defaultValue: false;
  };
  Size: {
    type: "VARIANT";
    defaultValue: "Small";
    variantOptions: ["Medium", "Small"];
  };
  State: {
    type: "VARIANT";
    defaultValue: "Selected";
    variantOptions: ["Enabled", "Selected", "Disabled"];
  };
}>;

export type TabsChipWrapperProperties = InferComponentDefinition<{
  Size: {
    type: "VARIANT";
    defaultValue: "Large";
    variantOptions: ["Medium", "Large"];
  };
  Variant: {
    type: "VARIANT";
    defaultValue: "Solid";
    variantOptions: ["Solid", "Outline"];
  };
}>;

export type ChipTabsTriggerProperties = InferComponentDefinition<{
  "\bSize": {
    type: "VARIANT";
    defaultValue: "Medium";
    variantOptions: ["Medium", "Large"];
  };
  Variant: {
    type: "VARIANT";
    defaultValue: "Solid";
    variantOptions: ["Outline", "Solid"];
  };
  State: {
    type: "VARIANT";
    defaultValue: "Selected";
    variantOptions: ["Enabled", "Selected", "Disabled"];
  };
  "Has Notification": {
    type: "VARIANT";
    defaultValue: "False";
    variantOptions: ["False", "True"];
  };
}>;

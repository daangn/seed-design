import type { InferComponentDefinition } from "@/codegen/core";
import type * as sets from "@/entities/data/__generated__/component-sets";

export type ActionButtonProperties = InferComponentDefinition<
  typeof sets.actionButton.componentPropertyDefinitions
>;

export type ActionButtonGhostProperties = InferComponentDefinition<
  typeof sets.actionButtonGhostButton.componentPropertyDefinitions
>;

export type AlertDialogProperties = InferComponentDefinition<
  typeof sets.alertDialog.componentPropertyDefinitions
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
  typeof sets.avatar.componentPropertyDefinitions
>;

export type AvatarStackProperties = InferComponentDefinition<
  typeof sets.avatarStack.componentPropertyDefinitions
>;

export type BadgeProperties = InferComponentDefinition<
  typeof sets.badge.componentPropertyDefinitions
>;

export type BottomSheetProperties = InferComponentDefinition<
  typeof sets.bottomSheet.componentPropertyDefinitions
>;

export type CalloutProperties = InferComponentDefinition<
  typeof sets.callout.componentPropertyDefinitions
>;

export type CheckboxProperties = InferComponentDefinition<
  typeof sets.checkbox.componentPropertyDefinitions
>;

export type CheckmarkProperties = InferComponentDefinition<
  typeof sets.checkmark.componentPropertyDefinitions
>;

export type ChipProperties = InferComponentDefinition<
  typeof sets.chip.componentPropertyDefinitions
>;

export type ChipIconSuffixProperties = InferComponentDefinition<{
  "Icon#33203:0": {
    type: "INSTANCE_SWAP";
    defaultValue: "26621:23250";
    preferredValues: [];
  };
}>;

export type ContextualFloatingButtonProperties = InferComponentDefinition<
  typeof sets.contextualFloatingButton.componentPropertyDefinitions
>;

export type DividerProperties = InferComponentDefinition<
  typeof sets.divider.componentPropertyDefinitions
>;

export type ErrorStateProperties = InferComponentDefinition<
  typeof sets.templateErrorState.componentPropertyDefinitions
>;

export type FieldHeaderProperties = InferComponentDefinition<{
  "Label#34796:0": {
    type: "TEXT";
    defaultValue: "라벨";
  };
  "Has Indicator#34796:1": {
    type: "BOOLEAN";
    defaultValue: false;
  };
  "Has Suffix#34796:2": {
    type: "BOOLEAN";
    defaultValue: false;
  };
  Weight: {
    type: "VARIANT";
    defaultValue: "Medium";
    variantOptions: ["Medium", "Bold"];
  };
}>;

export type FieldIndicatorProperties = InferComponentDefinition<{
  "Required Label#40606:3": {
    type: "TEXT";
    defaultValue: "선택";
  };
  Type: {
    type: "VARIANT";
    defaultValue: "Required Mark";
    variantOptions: ["Required Mark", "Text"];
  };
}>;

export type FieldFooterProperties = InferComponentDefinition<{
  "Text#2770:0": {
    type: "TEXT";
    defaultValue: "도움말 텍스트 입력";
  };
  "Has Prefix#2778:13": {
    type: "BOOLEAN";
    defaultValue: false;
  };
  "Error Text#32821:0": {
    type: "TEXT";
    defaultValue: "에러 메시지 입력";
  };
  Type: {
    type: "VARIANT";
    defaultValue: "Description With Character Count";
    variantOptions: ["Description", "Description With Character Count", "Character Count"];
  };
  Error: {
    type: "VARIANT";
    defaultValue: "false";
    variantOptions: ["true", "false"];
  };
}>;

export type FieldCharacterCountProperties = InferComponentDefinition<{
  "Counter#40960:0": {
    type: "TEXT";
    defaultValue: "10";
  };
  "Max Count#40960:4": {
    type: "TEXT";
    defaultValue: "500";
  };
  State: {
    type: "VARIANT";
    defaultValue: "Null";
    variantOptions: ["Null", "Has Value", "Error"];
  };
}>;

export type MenuSheetProperties = InferComponentDefinition<
  typeof sets.menuSheet.componentPropertyDefinitions
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
  typeof sets.floatingActionButton.componentPropertyDefinitions
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
  typeof sets.helpBubble.componentPropertyDefinitions
>;

// lives in a different file
export type IdentityPlaceholderProperties = InferComponentDefinition<{
  Identity: {
    type: "VARIANT";
    defaultValue: "Person";
    variantOptions: ["Person", "Business"];
  };
}>;

export type PageBannerProperties = InferComponentDefinition<
  typeof sets.pageBanner.componentPropertyDefinitions
>;

export type PageBannerButtonProperties = InferComponentDefinition<{
  "Label#39890:0": {
    type: "TEXT";
    defaultValue: "라벨";
  };
}>;

export type ListHeaderProperties = InferComponentDefinition<
  typeof sets.listHeader.componentPropertyDefinitions
>;

export type ListItemProperties = InferComponentDefinition<
  typeof sets.listItem.componentPropertyDefinitions
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
  typeof sets.mannerTemp.componentPropertyDefinitions
>;

export type MannerTempBadgeProperties = InferComponentDefinition<
  typeof sets.mannerTempBadge.componentPropertyDefinitions
>;

export type ProgressCircleProperties = InferComponentDefinition<
  typeof sets.progressCircle.componentPropertyDefinitions
>;

export type RadioProperties = InferComponentDefinition<
  typeof sets.radio.componentPropertyDefinitions
>;

export type RadioMarkProperties = InferComponentDefinition<
  typeof sets.radioMark.componentPropertyDefinitions
>;

export type ReactionButtonProperties = InferComponentDefinition<
  typeof sets.reactionButton.componentPropertyDefinitions
>;

export type SegmentedControlProperties = InferComponentDefinition<
  typeof sets.segmentedControl.componentPropertyDefinitions
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
  typeof sets.skeleton.componentPropertyDefinitions
>;

export type SliderProperties = InferComponentDefinition<
  typeof sets.slider.componentPropertyDefinitions
>;

export type SliderTicksProperties = InferComponentDefinition<{
  Type: {
    type: "VARIANT";
    defaultValue: "Continuous";
    variantOptions: ["Continuous", "Discrete"];
  };
  Step: {
    type: "VARIANT";
    defaultValue: "2";
    variantOptions: ["2", "3", "4", "5"];
  };
}>;

export type SliderFieldProperties = InferComponentDefinition<
  typeof sets.templateSliderField.componentPropertyDefinitions
>;

export type SnackbarProperties = InferComponentDefinition<
  typeof sets.snackbar.componentPropertyDefinitions
>;

export type SwitchProperties = InferComponentDefinition<
  typeof sets._switch.componentPropertyDefinitions
>;

export type SwitchMarkProperties = InferComponentDefinition<
  typeof sets.switchMark.componentPropertyDefinitions
>;

export type ToggleButtonProperties = InferComponentDefinition<
  typeof sets.toggleButton.componentPropertyDefinitions
>;

export type SelectBoxGroupProperties = InferComponentDefinition<
  typeof sets.templateSelectBoxGroup.componentPropertyDefinitions
>;

export type SelectBoxProperties = InferComponentDefinition<
  typeof sets.selectBox.componentPropertyDefinitions
>;

export type AppBarProperties = InferComponentDefinition<
  typeof sets.topNavigation.componentPropertyDefinitions
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
  typeof sets.tabs.componentPropertyDefinitions
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
  Size: {
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

export type TagGroupProperties = InferComponentDefinition<
  typeof sets.tagGroup.componentPropertyDefinitions
>;

export type TagGroupItemProperties = InferComponentDefinition<{
  "Label#5409:0": {
    type: "TEXT";
    defaultValue: "라벨";
  };
  "Prefix Icon#47948:0": {
    type: "INSTANCE_SWAP";
    defaultValue: "26621:23540";
    preferredValues: [];
  };
  "Suffix Icon#47948:55": {
    type: "INSTANCE_SWAP";
    defaultValue: "27053:2268";
    preferredValues: [];
  };
  Size: {
    type: "VARIANT";
    defaultValue: "t2(12pt)";
    variantOptions: ["t2(12pt)", "t3(13pt)", "t4(14pt)"];
  };
  Layout: {
    type: "VARIANT";
    defaultValue: "Text Only";
    variantOptions: ["Text Only", "Icon First", "Icon Last"];
  };
  Tone: {
    type: "VARIANT";
    defaultValue: "Neutral Subtle";
    variantOptions: ["Neutral Subtle", "Brand", "Neutral"];
  };
  Weight: {
    type: "VARIANT";
    defaultValue: "Regular";
    variantOptions: ["Regular", "Bold"];
  };
}>;

export type TextInputFieldProperties = InferComponentDefinition<
  typeof sets.templateTextField.componentPropertyDefinitions
>;

export type TextInputOutlineProperties = InferComponentDefinition<{
  "Has Prefix#32514:10": {
    type: "BOOLEAN";
    defaultValue: false;
  };
  "Loading Text#32734:0": {
    type: "TEXT";
    defaultValue: "단서를 모아서 추리 중...";
  };
  "Has Suffix#32865:68": {
    type: "BOOLEAN";
    defaultValue: false;
  };
  State: {
    type: "VARIANT";
    defaultValue: "Enabled";
    variantOptions: [
      "Enabled",
      "Focused",
      "Error",
      "Error Focused",
      "Disabled",
      "Read Only",
      "AI Loading (Figma Only)",
    ];
  };
}>;

export type TextInputOutlinePrefixProperties = InferComponentDefinition<{
  "Icon#34021:2": {
    type: "INSTANCE_SWAP";
    defaultValue: "32633:80013";
    preferredValues: [];
  };
  Type: {
    type: "VARIANT";
    defaultValue: "Icon";
    variantOptions: ["Icon", "Custom (Figma Only)"];
  };
}>;

export type TextInputOutlineSuffixProperties = InferComponentDefinition<{
  "Suffix Text#34021:4": {
    type: "TEXT";
    defaultValue: "원";
  };
  "Icon#45391:0": {
    type: "INSTANCE_SWAP";
    defaultValue: "34885:102331";
    preferredValues: [];
  };
  "Type (Figma Only)": {
    type: "VARIANT";
    defaultValue: "Text";
    variantOptions: ["Text", "Icon", "Icon Button (Ghost Button)", "Custom"];
  };
}>;

export type TextInputUnderlinePrefixProperties = InferComponentDefinition<{
  "Icon#34021:2": {
    type: "INSTANCE_SWAP";
    defaultValue: "32633:80013";
    preferredValues: [];
  };
  Type: {
    type: "VARIANT";
    defaultValue: "Icon";
    variantOptions: ["Icon", "Custom (Figma Only)"];
  };
}>;

export type TextInputUnderlineSuffixProperties = InferComponentDefinition<{
  "Suffix Text#34021:4": {
    type: "TEXT";
    defaultValue: "원";
  };
  "Icon#45391:5": {
    type: "INSTANCE_SWAP";
    defaultValue: "34885:102331";
    preferredValues: [];
  };
  "Type (Figma Only)": {
    type: "VARIANT";
    defaultValue: "Text";
    variantOptions: ["Text", "Icon", "Icon Button (Ghost Button)", "Custom"];
  };
}>;

export type TextInputUnderlineProperties = InferComponentDefinition<{
  "Show Footer#33213:14": {
    type: "BOOLEAN";
    defaultValue: true;
  };
  "Has Prefix#34125:0": {
    type: "BOOLEAN";
    defaultValue: false;
  };
  "Has Suffix#34125:8": {
    type: "BOOLEAN";
    defaultValue: false;
  };
  "Show Header#34125:16": {
    type: "BOOLEAN";
    defaultValue: false;
  };
  State: {
    type: "VARIANT";
    defaultValue: "Enabled";
    variantOptions: [
      "Enabled",
      "Focused",
      "Error",
      "Error Focused",
      "Disabled",
      "Read Only",
      "AI Loading (Figma Only)",
    ];
  };
}>;

export type TextareaFieldProperties = InferComponentDefinition<
  typeof sets.templateTextareaField.componentPropertyDefinitions
>;

export type TextareaProperties = InferComponentDefinition<{
  "Auto Size (Figma Only)": {
    type: "VARIANT";
    defaultValue: "true";
    variantOptions: ["true", "false"];
  };
  State: {
    type: "VARIANT";
    defaultValue: "Enabled";
    variantOptions: [
      "Enabled",
      "Focused",
      "Error",
      "Error Focused",
      "Disabled",
      "Read Only",
      "AI Loading (Figma Only)",
    ];
  };
}>;

export type FieldButtonProperties = InferComponentDefinition<
  typeof sets.templateCustomPickerField.componentPropertyDefinitions
>;

export type InputButtonProperties = InferComponentDefinition<{
  "Has Prefix#32514:10": {
    type: "BOOLEAN";
    defaultValue: false;
  };
  "Has Suffix#32865:68": {
    type: "BOOLEAN";
    defaultValue: false;
  };
  State: {
    type: "VARIANT";
    defaultValue: "Enabled";
    variantOptions: ["Enabled", "Error", "Disabled", "Read Only", "Pressed", "Error Pressed"];
  };
}>;

export type InputButtonPrefixProperties = InferComponentDefinition<{
  "Icon#34021:2": {
    type: "INSTANCE_SWAP";
    defaultValue: "34885:102321";
    preferredValues: [
      {
        type: "COMPONENT_SET";
        key: "e6ff71538e21f2e117c72727e5e5cc526d2328ba";
      },
      {
        type: "COMPONENT_SET";
        key: "b4cad90025daa85c417154f8f61e09fbddb34fa7";
      },
    ];
  };
  Type: {
    type: "VARIANT";
    defaultValue: "Icon";
    variantOptions: ["Icon", "Custom (Figma Only)"];
  };
}>;

export type InputButtonSuffixProperties = InferComponentDefinition<{
  "Suffix Text#34021:4": {
    type: "TEXT";
    defaultValue: "원";
  };
  "Icon#37963:0": {
    type: "INSTANCE_SWAP";
    defaultValue: "43573:11862";
    preferredValues: [
      {
        type: "COMPONENT_SET";
        key: "422f4be7a88e2c41c079de9202e0b8e7da429971";
      },
      {
        type: "COMPONENT_SET";
        key: "5c704613ff444e38fe356e3991738965bd43fcec";
      },
      {
        type: "COMPONENT_SET";
        key: "29314e598cfae33d3b325feaaa39cb71449d521a";
      },
      {
        type: "COMPONENT_SET";
        key: "ffe429c229000d814017f87a62ff9746639e3bbb";
      },
    ];
  };
  "Type (Figma Only)": {
    type: "VARIANT";
    defaultValue: "Icon";
    variantOptions: ["Icon", "Text", "Custom"];
  };
}>;

export type GenericFieldButtonProps = InferComponentDefinition<{}>;

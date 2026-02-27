import type { InferComponentDefinition } from "@/codegen/core";
import type * as sets from "@/entities/data/__generated__/component-sets";
import type * as components from "@/entities/data/__generated__/components";

export type ActionButtonProperties = InferComponentDefinition<
  typeof sets.componentActionButton.componentPropertyDefinitions
>;

export type ActionButtonGhostProperties = InferComponentDefinition<
  typeof sets.componentActionButtonGhostButton.componentPropertyDefinitions
>;

export type AlertDialogProperties = InferComponentDefinition<
  typeof sets.componentAlertDialog.componentPropertyDefinitions
>;

export type AlertDialogFooterProperties = InferComponentDefinition<
  typeof sets.privateComponentAlertDialogActions.componentPropertyDefinitions
>;

export type AvatarProperties = InferComponentDefinition<
  typeof sets.componentAvatar.componentPropertyDefinitions
>;

export type AvatarStackProperties = InferComponentDefinition<
  typeof sets.componentAvatarStack.componentPropertyDefinitions
>;

export type BadgeProperties = InferComponentDefinition<
  typeof sets.componentBadge.componentPropertyDefinitions
>;

export type BottomSheetProperties = InferComponentDefinition<
  typeof sets.componentBottomSheet.componentPropertyDefinitions
>;

export type CalloutProperties = InferComponentDefinition<
  typeof sets.componentCallout.componentPropertyDefinitions
>;

export type CheckboxProperties = InferComponentDefinition<
  typeof sets.componentCheckbox.componentPropertyDefinitions
>;

export type CheckboxGroupFieldProperties = InferComponentDefinition<
  typeof sets.templateCheckboxField.componentPropertyDefinitions
>;

export type CheckmarkProperties = InferComponentDefinition<
  typeof sets.componentCheckmark.componentPropertyDefinitions
>;

export type ChipProperties = InferComponentDefinition<
  typeof sets.componentChip.componentPropertyDefinitions
>;

export type ChipIconSuffixProperties = InferComponentDefinition<
  typeof components.componentChipSuffixIcon.componentPropertyDefinitions
>;

export type ContextualFloatingButtonProperties = InferComponentDefinition<
  typeof sets.componentContextualFloatingButton.componentPropertyDefinitions
>;

export type DividerProperties = InferComponentDefinition<
  typeof sets.componentDivider.componentPropertyDefinitions
>;

export type FieldHeaderProperties = InferComponentDefinition<
  typeof sets.componentFieldHeader.componentPropertyDefinitions
>;

export type FieldIndicatorProperties = InferComponentDefinition<
  typeof sets.privateComponentFieldHeaderIndicator.componentPropertyDefinitions
>;

export type FieldFooterProperties = InferComponentDefinition<
  typeof sets.componentFieldFooter.componentPropertyDefinitions
>;

export type FieldCharacterCountProperties = InferComponentDefinition<
  typeof sets.privateComponentFieldFooterCharacterCount.componentPropertyDefinitions
>;

export type MenuSheetProperties = InferComponentDefinition<
  typeof sets.componentMenuSheet.componentPropertyDefinitions
>;

export type MenuSheetGroupProperties = InferComponentDefinition<
  typeof sets.privateComponentMenuSheetMenuGroup.componentPropertyDefinitions
>;

export type MenuSheetItemProperties = InferComponentDefinition<
  typeof sets.privateComponentMenuSheetMenuItem.componentPropertyDefinitions
>;

export type FloatingActionButtonProperties = InferComponentDefinition<
  typeof sets.componentFloatingActionButton.componentPropertyDefinitions
>;

export type FloatingActionButtonButtonItemProperties = InferComponentDefinition<
  typeof sets.privateComponentItemButtonType.componentPropertyDefinitions
>;

export type FloatingActionButtonMenuItemProperties = InferComponentDefinition<
  typeof sets.privateComponentItemMenuType.componentPropertyDefinitions
>;

export type HelpBubbleProperties = InferComponentDefinition<
  typeof sets.componentHelpBubble.componentPropertyDefinitions
>;

export type ImageFrameProperties = InferComponentDefinition<
  typeof sets.componentImageFrame.componentPropertyDefinitions
>;

export type ImageFrameIconProperties = InferComponentDefinition<
  typeof components.componentImageFrameIcon.componentPropertyDefinitions
>;

export type ImageFrameOverlayIndicatorProperties = InferComponentDefinition<
  typeof components.componentImageFrameOverlayIndicator.componentPropertyDefinitions
>;

export type ImageFrameReactionButtonProperties = InferComponentDefinition<
  typeof sets.componentImageFrameReactionButton.componentPropertyDefinitions
>;

export type PageBannerProperties = InferComponentDefinition<
  typeof sets.componentPageBanner.componentPropertyDefinitions
>;

export type PageBannerButtonProperties = InferComponentDefinition<
  typeof components.componentPageBannerSuffixAction.componentPropertyDefinitions
>;

export type ListHeaderProperties = InferComponentDefinition<
  typeof sets.componentListHeader.componentPropertyDefinitions
>;

export type ListItemProperties = InferComponentDefinition<
  typeof sets.componentListItem.componentPropertyDefinitions
>;

export type ListItemPrefixIconProperties = InferComponentDefinition<
  typeof components.componentListItemPrefixIcon.componentPropertyDefinitions
>;

export type ListItemSuffixIconProperties = InferComponentDefinition<
  typeof components.componentListItemSuffixIcon.componentPropertyDefinitions
>;

export type MannerTempProperties = InferComponentDefinition<
  typeof sets.componentMannerTemp.componentPropertyDefinitions
>;

export type MannerTempBadgeProperties = InferComponentDefinition<
  typeof sets.componentMannerTempBadge.componentPropertyDefinitions
>;

export type ProgressCircleProperties = InferComponentDefinition<
  typeof sets.componentProgressCircle.componentPropertyDefinitions
>;

export type RadioProperties = InferComponentDefinition<
  typeof sets.componentRadio.componentPropertyDefinitions
>;

export type RadioGroupFieldProperties = InferComponentDefinition<
  typeof sets.templateRadioField.componentPropertyDefinitions
>;

export type RadiomarkProperties = InferComponentDefinition<
  typeof sets.componentRadiomark.componentPropertyDefinitions
>;

export type ReactionButtonProperties = InferComponentDefinition<
  typeof sets.componentReactionButton.componentPropertyDefinitions
>;

export type ResultSectionProperties = InferComponentDefinition<
  typeof sets.componentResultSection.componentPropertyDefinitions
>;

export type SegmentedControlProperties = InferComponentDefinition<
  typeof sets.componentSegmentedControl.componentPropertyDefinitions
>;

export type SegmentedControlItemProperties = InferComponentDefinition<
  typeof sets.privateComponentSegmentedControlItem.componentPropertyDefinitions
>;

export type SelectBoxGroupFieldProperties = InferComponentDefinition<
  typeof sets.templateSelectBoxField.componentPropertyDefinitions
>;

export type SelectBoxGroupProperties = InferComponentDefinition<
  typeof sets.componentSelectBoxGroup.componentPropertyDefinitions
>;

export type SelectBoxHorizontalProperties = InferComponentDefinition<
  typeof sets.componentSelectBoxItemHorizontal.componentPropertyDefinitions
>;

export type SelectBoxVerticalProperties = InferComponentDefinition<
  typeof sets.componentSelectBoxItemVertical.componentPropertyDefinitions
>;

export type SelectBoxPrefixIconProperties = InferComponentDefinition<
  typeof components.componentSelectBoxItemPrefixIcon.componentPropertyDefinitions
>;

export type SkeletonProperties = InferComponentDefinition<
  typeof sets.componentSkeleton.componentPropertyDefinitions
>;

export type SliderProperties = InferComponentDefinition<
  typeof sets.componentSlider.componentPropertyDefinitions
>;

export type SliderTicksProperties = InferComponentDefinition<
  typeof sets.privateComponentSliderItemTickMark.componentPropertyDefinitions
>;

export type SliderFieldProperties = InferComponentDefinition<
  typeof sets.templateSliderField.componentPropertyDefinitions
>;

export type SnackbarProperties = InferComponentDefinition<
  typeof sets.componentSnackbar.componentPropertyDefinitions
>;

export type SwitchProperties = InferComponentDefinition<
  typeof sets.componentSwitch.componentPropertyDefinitions
>;

export type SwitchmarkProperties = InferComponentDefinition<
  typeof sets.componentSwitchmark.componentPropertyDefinitions
>;

export type ToggleButtonProperties = InferComponentDefinition<
  typeof sets.componentToggleButton.componentPropertyDefinitions
>;

export type AppBarProperties = InferComponentDefinition<
  typeof sets.componentTopNavigation.componentPropertyDefinitions
>;

export type AppBarMainProperties = InferComponentDefinition<
  typeof sets.privateComponentTopNavigationTitle.componentPropertyDefinitions
>;

export type AppBarLeftIconButtonProperties = InferComponentDefinition<
  typeof components.privateComponentTopNavigationLeftIconButton.componentPropertyDefinitions
>;

export type AppBarRightIconButtonProperties = InferComponentDefinition<
  typeof sets.privateComponentTopNavigationRightIconButton.componentPropertyDefinitions
>;

export type TabsProperties = InferComponentDefinition<
  typeof sets.componentTabs.componentPropertyDefinitions
>;

export type TabsLineWrapperProperties = InferComponentDefinition<
  typeof sets.privateComponentTabsLine.componentPropertyDefinitions
>;

export type TabsLineTriggerHugProperties = InferComponentDefinition<
  typeof sets.privateComponentTabItemLineHug.componentPropertyDefinitions
>;

export type TabsLineTriggerFillProperties = InferComponentDefinition<
  typeof sets.privateComponentTabItemLineFill.componentPropertyDefinitions
>;

export type TabsChipWrapperProperties = InferComponentDefinition<
  typeof sets.privateComponentTabsChip.componentPropertyDefinitions
>;

export type ChipTabsTriggerProperties = InferComponentDefinition<
  typeof sets.privateComponentTabItemChip.componentPropertyDefinitions
>;

export type TagGroupProperties = InferComponentDefinition<
  typeof sets.componentTagGroup.componentPropertyDefinitions
>;

export type TagGroupItemProperties = InferComponentDefinition<
  typeof sets.privateComponentItemTag.componentPropertyDefinitions
>;

export type TextInputFieldProperties = InferComponentDefinition<
  typeof sets.templateTextField.componentPropertyDefinitions
>;

export type TextInputOutlineProperties = InferComponentDefinition<
  typeof sets.componentTextInput.componentPropertyDefinitions
>;

export type TextInputOutlinePrefixProperties = InferComponentDefinition<
  typeof sets.privateComponentTextInputPrefix.componentPropertyDefinitions
>;

export type TextInputOutlineSuffixProperties = InferComponentDefinition<
  typeof sets.privateComponentTextInputSuffix.componentPropertyDefinitions
>;

export type TextInputUnderlinePrefixProperties = InferComponentDefinition<
  typeof sets.privateComponentUnderlineTextInputPrefix.componentPropertyDefinitions
>;

export type TextInputUnderlineSuffixProperties = InferComponentDefinition<
  typeof sets.privateComponentUnderlineTextInputSuffix.componentPropertyDefinitions
>;

export type TextInputUnderlineProperties = InferComponentDefinition<
  typeof sets.componentUnderlineTextInput.componentPropertyDefinitions
>;

export type TextareaFieldProperties = InferComponentDefinition<
  typeof sets.templateTextareaField.componentPropertyDefinitions
>;

export type TextareaProperties = InferComponentDefinition<
  typeof sets.componentTextarea.componentPropertyDefinitions
>;

export type FieldButtonProperties = InferComponentDefinition<
  typeof sets.templateFieldButton.componentPropertyDefinitions
>;

export type InputButtonProperties = InferComponentDefinition<
  typeof sets.componentInputButton.componentPropertyDefinitions
>;

export type InputButtonPrefixProperties = InferComponentDefinition<
  typeof sets.privateComponentInputButtonPrefix.componentPropertyDefinitions
>;

export type InputButtonSuffixProperties = InferComponentDefinition<
  typeof sets.privateComponentInputButtonSuffix.componentPropertyDefinitions
>;

export type GenericFieldButtonProps = InferComponentDefinition<{}>;

export type LegacyTextFieldProperties = InferComponentDefinition<
  typeof sets.componentDeprecatedTextField.componentPropertyDefinitions
>;

export type LegacyMultilineTextFieldProperties = InferComponentDefinition<
  typeof sets.componentDeprecatedMultilineTextField.componentPropertyDefinitions
>;

export type LegacySelectBoxProperties = InferComponentDefinition<
  typeof sets.componentDeprecatedSelectBox.componentPropertyDefinitions
>;

export type LegacySelectBoxGroupProperties = InferComponentDefinition<
  typeof sets.componentDeprecatedSelectBoxGroup.componentPropertyDefinitions
>;

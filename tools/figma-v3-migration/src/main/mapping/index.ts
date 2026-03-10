import {
  boxButtonMapping,
  boxToggleButtonMapping,
  capsuleToggleButtonMapping,
  iconButtonMapping,
} from "./buttons";

import { alertDialogMapping } from "./alert-dialog";
import { avatarGroupMapping, avatarMapping } from "./avatars";
import { buttonGroupFixedMapping, buttonGroupMapping } from "./button-group";
import { actionableCalloutMapping, calloutMapping, dismissableCalloutMapping } from "./callouts";
import { checkboxCircleMapping, checkboxGhostMapping, checkboxSquareMapping } from "./checkbox";
import {
  chipButtonMapping,
  chipFilterMapping,
  chipRadioMapping,
  chipToggleButtonMapping,
} from "./chips";
import { extendedFabMapping, fabMapping, menuFabMapping } from "./fabs";
import { helpBubbleMapping } from "./help-bubble";
import {
  actionableInlineAlertMapping,
  dismissableInlineAlertMapping,
  inlineAlertMapping,
} from "./inline-alerts";
import { spinnerMapping } from "./progress-circle";
import { radioMapping } from "./radio";
import { selectBoxMapping } from "./select-box";
import { rangeSliderMapping, sliderMapping } from "./sliders";
import { snackbarMapping } from "./snackbar";
import { switchMapping } from "./switches";
import { tabsMapping } from "./tabs";
import {
  multilineTextFieldMapping,
  outlineTextFieldMapping,
  underlinedTextFieldMapping,
} from "./text-fields";
import { dividerMapping, dividerNavMapping } from "./divider";
import { actionSheetMapping, actionSheetV2BetaMapping } from "./action-sheet";
import { squareBadgeMapping, pillBadgeMapping } from "./badges";
import { thumbnailMapping, thumbnailRatioMapping } from "./thumbnail";

export default [
  squareBadgeMapping,
  pillBadgeMapping,
  actionSheetMapping,
  actionSheetV2BetaMapping,
  buttonGroupMapping,
  buttonGroupFixedMapping,
  boxButtonMapping,
  boxToggleButtonMapping,
  capsuleToggleButtonMapping,
  iconButtonMapping,
  menuFabMapping,
  fabMapping,
  extendedFabMapping,
  alertDialogMapping,
  avatarMapping,
  avatarGroupMapping,
  calloutMapping,
  actionableCalloutMapping,
  dismissableCalloutMapping,
  checkboxCircleMapping,
  checkboxSquareMapping,
  checkboxGhostMapping,
  chipButtonMapping,
  chipFilterMapping,
  chipRadioMapping,
  dividerMapping,
  dividerNavMapping,
  chipToggleButtonMapping,
  helpBubbleMapping,
  inlineAlertMapping,
  actionableInlineAlertMapping,
  dismissableInlineAlertMapping,
  radioMapping,
  selectBoxMapping,
  sliderMapping,
  rangeSliderMapping,
  snackbarMapping,
  tabsMapping,
  spinnerMapping,
  switchMapping,
  underlinedTextFieldMapping,
  multilineTextFieldMapping,
  outlineTextFieldMapping,
  thumbnailMapping,
  thumbnailRatioMapping,
] as const;

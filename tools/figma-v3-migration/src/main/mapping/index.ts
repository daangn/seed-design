import {
  boxButtonMapping,
  boxToggleButtonMapping,
  capsuleToggleButtonMapping,
  iconButtonMapping,
  textButtonMapping,
} from "./buttons";

import { menuFabMapping, fabMapping, extendedFabMapping } from "./fabs";
import { alertDialogMapping } from "./alert-dialog";
import { avatarMapping } from "./avatars";
import { calloutMapping, actionableCalloutMapping, dismissableCalloutMapping } from "./callouts";
import { checkboxCircleMapping, checkboxSquareMapping, checkboxGhostMapping } from "./checkbox";
import {
  chipButtonMapping,
  chipFilterMapping,
  chipRadioMapping,
  chipToggleButtonMapping,
} from "./chips";
import { helpBubbleMapping } from "./help-bubble";
import {
  inlineAlertMapping,
  actionableInlineAlertMapping,
  dismissableInlineAlertMapping,
} from "./inline-alerts";
import { radioMapping } from "./radio";
import { selectBoxMapping } from "./select-box";
import { sliderMapping, rangeSliderMapping } from "./sliders";
import { snackbarMapping } from "./snackbar";
import { tabsMapping } from "./tabs";
import { spinnerMapping } from "./progress-circle";
import { switchMapping } from "./switches";
import {
  underlinedTextFieldMapping,
  multilineTextFieldMapping,
  outlineTextFieldMapping,
} from "./text-fields";
import { buttonGroupMapping, buttonGroupFixedMapping } from "./button-group";

export default [
  buttonGroupMapping,
  buttonGroupFixedMapping,
  boxButtonMapping,
  boxToggleButtonMapping,
  capsuleToggleButtonMapping,
  iconButtonMapping,
  textButtonMapping,
  menuFabMapping,
  fabMapping,
  extendedFabMapping,
  alertDialogMapping,
  avatarMapping,
  calloutMapping,
  actionableCalloutMapping,
  dismissableCalloutMapping,
  checkboxCircleMapping,
  checkboxSquareMapping,
  checkboxGhostMapping,
  chipButtonMapping,
  chipFilterMapping,
  chipRadioMapping,
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
] as const;

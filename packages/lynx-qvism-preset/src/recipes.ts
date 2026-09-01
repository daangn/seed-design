import accordion from "./recipes/accordion";
import actionButton from "./recipes/action-button";
import { appBar, appBarMain } from "./recipes/app-bar";
import badge from "./recipes/badge";
import bottomSheet from "./recipes/bottom-sheet";
import bottomSheetHandle from "./recipes/bottom-sheet-handle";
import callout from "./recipes/callout";
import checkbox from "./recipes/checkbox";
import checkboxGroup from "./recipes/checkbox-group";
import checkmark from "./recipes/checkmark";
import chip from "./recipes/chip";
import field from "./recipes/field";
import fieldLabel from "./recipes/field-label";
import pageBanner from "./recipes/page-banner";
import radio from "./recipes/radio";
import radioGroup from "./recipes/radio-group";
import radiomark from "./recipes/radiomark";
import segmentedControl from "./recipes/segmented-control";
import { selectBox, selectBoxCheckmark, selectBoxGroup } from "./recipes/select-box";
import switchRecipe from "./recipes/switch";
import switchmarkRecipe from "./recipes/switchmark";
import { tagGroup as lynxTagGroup, tagGroupItem as lynxTagGroupItem } from "./recipes/tag-group";
import tabs from "./recipes/tabs";
import textInput from "./recipes/text-input";

/**
 * Recipes used by the Lynx preset build.
 */
export const recipes = {
  accordion,
  actionButton,
  appBar,
  appBarMain,
  badge,
  bottomSheet,
  bottomSheetHandle,
  callout,
  checkbox,
  checkboxGroup,
  checkmark,
  chip,
  field,
  fieldLabel,
  pageBanner,
  radio,
  radioGroup,
  radiomark,
  segmentedControl,
  selectBox,
  selectBoxCheckmark,
  selectBoxGroup,
  switch: switchRecipe,
  switchmark: switchmarkRecipe,
  tagGroup: lynxTagGroup,
  tagGroupItem: lynxTagGroupItem,
  tabs,
  textInput,
};

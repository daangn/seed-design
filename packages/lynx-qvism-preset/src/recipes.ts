import actionButton from "./recipes/action-button";
import { appBar, appBarMain } from "./recipes/app-bar";
import badge from "./recipes/badge";
import bottomSheet from "./recipes/bottom-sheet";
import bottomSheetHandle from "./recipes/bottom-sheet-handle";
import callout from "./recipes/callout";
import checkbox from "./recipes/checkbox";
import checkboxGroup from "./recipes/checkbox-group";
import checkmark from "./recipes/checkmark";
import field from "./recipes/field";
import fieldLabel from "./recipes/field-label";
import radio from "./recipes/radio";
import radioGroup from "./recipes/radio-group";
import radiomark from "./recipes/radiomark";
import switchRecipe from "./recipes/switch";
import switchmarkRecipe from "./recipes/switchmark";
import { tagGroup as lynxTagGroup, tagGroupItem as lynxTagGroupItem } from "./recipes/tag-group";
import textInput from "./recipes/text-input";

/**
 * Recipes used by the Lynx preset build.
 */
export const recipes = {
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
  field,
  fieldLabel,
  radio,
  radioGroup,
  radiomark,
  switch: switchRecipe,
  switchmark: switchmarkRecipe,
  tagGroup: lynxTagGroup,
  tagGroupItem: lynxTagGroupItem,
  textInput,
};

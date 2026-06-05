import actionButton from "./recipes/action-button";
import { appBar, appBarMain } from "./recipes/app-bar";
import bottomSheet from "./recipes/bottom-sheet";
import bottomSheetHandle from "./recipes/bottom-sheet-handle";
import checkbox from "./recipes/checkbox";
import checkboxGroup from "./recipes/checkbox-group";
import checkmark from "./recipes/checkmark";
import radio from "./recipes/radio";
import radioGroup from "./recipes/radio-group";
import radiomark from "./recipes/radiomark";
import switchRecipe from "./recipes/switch";
import switchmarkRecipe from "./recipes/switchmark";
import { tagGroup as lynxTagGroup, tagGroupItem as lynxTagGroupItem } from "./recipes/tag-group";

/**
 * Recipes used by the Lynx preset build.
 */
export const recipes = {
  actionButton,
  appBar,
  appBarMain,
  bottomSheet,
  bottomSheetHandle,
  checkbox,
  checkboxGroup,
  checkmark,
  radio,
  radioGroup,
  radiomark,
  switch: switchRecipe,
  switchmark: switchmarkRecipe,
  tagGroup: lynxTagGroup,
  tagGroupItem: lynxTagGroupItem,
};

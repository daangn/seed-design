import actionButton from "./recipes/lynx/action-button";
import bottomSheet from "./recipes/lynx/bottom-sheet";
import bottomSheetHandle from "./recipes/lynx/bottom-sheet-handle";
import checkbox from "./recipes/lynx/checkbox";
import checkboxGroup from "./recipes/lynx/checkbox-group";
import checkmark from "./recipes/lynx/checkmark";
import radio from "./recipes/lynx/radio";
import radioGroup from "./recipes/lynx/radio-group";
import radiomark from "./recipes/lynx/radiomark";
import switchRecipe from "./recipes/lynx/switch";
import switchmarkRecipe from "./recipes/lynx/switchmark";
import {
  tagGroup as lynxTagGroup,
  tagGroupItem as lynxTagGroupItem,
} from "./recipes/lynx/tag-group";

/**
 * Recipes used by the Lynx preset build.
 *
 * Reuse a web recipe by importing it from `./recipes/*`; fork it by adding an
 * override in `./recipes/lynx/*` and importing from there instead.
 */
export const lynxRecipes = {
  actionButton,
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

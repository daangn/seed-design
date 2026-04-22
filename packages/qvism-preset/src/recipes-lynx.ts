import actionButton from "./recipes/lynx/action-button";
import bottomSheet from "./recipes/lynx/bottom-sheet";
import bottomSheetHandle from "./recipes/lynx/bottom-sheet-handle";
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
  switch: switchRecipe,
  switchmark: switchmarkRecipe,
  tagGroup: lynxTagGroup,
  tagGroupItem: lynxTagGroupItem,
};

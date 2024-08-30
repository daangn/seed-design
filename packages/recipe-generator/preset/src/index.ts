import avatar from "./avatar.recipe";
import boxButton from "./box-button.recipe";
import callout from "./callout.recipe";
import checkbox from "./checkbox.recipe";
import chip from "./chip.recipe";
import dialog from "./dialog.recipe";
import helpBubble from "./help-bubble.recipe";
import radio from "./radio.recipe";
import switchRecipe from "./switch.recipe";
import tab from "./tab.recipe";
import tabs from "./tabs.recipe";
import chipTab from "./chip-tab.recipe";
import chipTabs from "./chip-tabs.recipe";

const recipes = {
  avatar,
  boxButton,
  radio,
  dialog,
  checkbox,
  chip,
  callout,
  switch: switchRecipe,
  helpBubble,
  tab,
  tabs,
  chipTab,
  chipTabs,
};

export default recipes;

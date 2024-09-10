import avatar from "./avatar.recipe";
import actionButton from "./action-button.recipe";
import callout from "./callout.recipe";
import checkbox from "./checkbox.recipe";
import actionChip from "./action-chip.recipe";
import dialog from "./dialog.recipe";
import helpBubble from "./help-bubble.recipe";
import radio from "./radio.recipe";
import switchRecipe from "./switch.recipe";
import tab from "./tab.recipe";
import tabs from "./tabs.recipe";
import chipTab from "./chip-tab.recipe";
import chipTabs from "./chip-tabs.recipe";
import progressCircle from "./progress-circle.recipe";

const recipes = {
  avatar,
  actionButton,
  radio,
  dialog,
  checkbox,
  actionChip,
  callout,
  switch: switchRecipe,
  helpBubble,
  tab,
  tabs,
  chipTab,
  chipTabs,
  progressCircle,
};

export default recipes;

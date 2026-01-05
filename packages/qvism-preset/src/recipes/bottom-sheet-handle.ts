import { bottomSheetHandle as handleVars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";
import { active, pseudo } from "../utils/pseudo";

const bottomSheetHandle = defineSlotRecipe({
  name: "bottom-sheet-handle",
  slots: ["root", "touchArea"],
  base: {
    root: {
      // positioning
      position: "absolute",
      top: handleVars.base.enabled.root.fromTop,
      left: "50%",
      transform: "translateX(-50%)",

      // appearance
      width: handleVars.base.enabled.root.width,
      height: handleVars.base.enabled.root.height,
      backgroundColor: handleVars.base.enabled.root.color,
      borderRadius: handleVars.base.enabled.root.borderRadius,
      transition: `background-color ${handleVars.base.enabled.root.colorDuration} ${handleVars.base.enabled.root.colorTimingFunction}`,
      touchAction: "pan-y",

      [pseudo(active)]: {
        backgroundColor: handleVars.base.pressed.root.color,
      },
    },
    touchArea: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: handleVars.base.enabled.touchArea.width,
      height: handleVars.base.enabled.touchArea.height,
      touchAction: "inherit",
    },
  },
  variants: {},
  defaultVariants: {},
});

export default bottomSheetHandle;

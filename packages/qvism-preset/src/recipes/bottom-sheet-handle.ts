import { bottomSheetHandle as handleVars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";
import { engaged, pseudo } from "../utils/pseudo";

const bottomSheetHandle = defineSlotRecipe({
  name: "bottom-sheet-handle",
  slots: ["root", "touchArea"],
  base: {
    root: {
      // positioning
      position: "absolute",
      top: handleVars.base.rest.root.fromTop,
      left: "50%",
      transform: "translateX(-50%)",

      // appearance
      width: handleVars.base.rest.root.width,
      height: handleVars.base.rest.root.height,
      backgroundColor: handleVars.base.rest.root.color,
      borderRadius: handleVars.base.rest.root.borderRadius,
      transition: `background-color ${handleVars.base.rest.root.colorDuration} ${handleVars.base.rest.root.colorTimingFunction}`,
      touchAction: "pan-y",

      [pseudo(engaged)]: {
        backgroundColor: handleVars.base.pressed.root.color,
      },
    },
    touchArea: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: handleVars.base.rest.touchArea.width,
      height: handleVars.base.rest.touchArea.height,
      touchAction: "inherit",
    },
  },
  variants: {},
  defaultVariants: {},
});

export default bottomSheetHandle;

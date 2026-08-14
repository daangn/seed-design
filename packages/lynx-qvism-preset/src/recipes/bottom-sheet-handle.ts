import { defineSlotRecipe } from "../utils/define";
import { bottomSheetHandle as handleVars } from "../vars/component";

/**
 * Lynx-only BottomSheet handle recipe.
 *
 * Provides the static geometry for the visible handle and its target-size area.
 */
const bottomSheetHandle = defineSlotRecipe({
  name: "bottom-sheet-handle",
  slots: ["root", "touchArea"],
  base: {
    root: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",

      width: handleVars.base.rest.root.width,
      height: handleVars.base.rest.root.height,
      backgroundColor: handleVars.base.rest.root.color,
      borderRadius: handleVars.base.rest.root.borderRadius,
    },
    touchArea: {
      position: "absolute",
      top: `calc(${handleVars.base.rest.root.fromTop} + ${handleVars.base.rest.root.height} / 2 - ${handleVars.base.rest.touchArea.height} / 2)`,
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 1,

      width: handleVars.base.rest.touchArea.width,
      height: handleVars.base.rest.touchArea.height,
    },
  },
  variants: {},
  defaultVariants: {},
});

export default bottomSheetHandle;

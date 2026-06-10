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

      width: handleVars.base.enabled.root.width,
      height: handleVars.base.enabled.root.height,
      backgroundColor: handleVars.base.enabled.root.color,
      borderRadius: handleVars.base.enabled.root.borderRadius,
    },
    touchArea: {
      position: "absolute",
      top: `calc(${handleVars.base.enabled.root.fromTop} + ${handleVars.base.enabled.root.height} / 2 - ${handleVars.base.enabled.touchArea.height} / 2)`,
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 1,

      width: handleVars.base.enabled.touchArea.width,
      height: handleVars.base.enabled.touchArea.height,
    },
  },
  variants: {},
  defaultVariants: {},
});

export default bottomSheetHandle;

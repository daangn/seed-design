import { defineLynxSlotRecipe } from "../../utils/define-lynx";
import { bottomSheetHandle as handleVars } from "../../vars/component";

/**
 * BottomSheet handle recipe (Lynx fork).
 *
 * Identical in spirit to the web recipe but stripped of CSS features Lynx
 * does not support (CSS `transition`, pseudo-class hover, etc.). Pressed-state
 * feedback is driven by lynx-ui-sheet's touch handlers, not CSS `:active`.
 */
const bottomSheetHandle = defineLynxSlotRecipe({
  name: "bottom-sheet-handle",
  slots: ["root", "touchArea"],
  base: {
    root: {
      position: "absolute",
      top: handleVars.base.enabled.root.fromTop,
      left: "50%",
      transform: "translateX(-50%)",

      width: handleVars.base.enabled.root.width,
      height: handleVars.base.enabled.root.height,
      backgroundColor: handleVars.base.enabled.root.color,
      borderRadius: handleVars.base.enabled.root.borderRadius,
    },
    touchArea: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: handleVars.base.enabled.touchArea.width,
      height: handleVars.base.enabled.touchArea.height,
    },
  },
  variants: {},
  defaultVariants: {},
});

export default bottomSheetHandle;

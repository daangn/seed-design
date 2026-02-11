import { defineRecipe } from "../utils/define";
import { active, pseudo } from "../utils/pseudo";
import { actionSheet as rootVars, actionSheetItem as vars } from "../vars/component";

/**
 * @deprecated Use `menu-sheet-item` instead.
 */
const actionSheetItem = defineRecipe({
  name: "action-sheet-item",
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",

    backgroundColor: vars.base.enabled.root.color,
    minHeight: vars.base.enabled.root.minHeight,
    paddingInline: vars.base.enabled.root.paddingX,
    paddingBlock: vars.base.enabled.root.paddingY,

    fontSize: vars.base.enabled.label.fontSize,
    lineHeight: vars.base.enabled.label.lineHeight,
    fontWeight: vars.base.enabled.label.fontWeight,

    [pseudo(active)]: {
      backgroundColor: vars.base.pressed.root.color,
    },

    "&:after": {
      content: "''",
      display: "block",
      position: "absolute",
      left: rootVars.base.enabled.divider.marginX,
      right: rootVars.base.enabled.divider.marginX,
      bottom: 0,
      height: rootVars.base.enabled.divider.strokeWidth,
      background: rootVars.base.enabled.divider.strokeColor,
    },
  },
  variants: {
    tone: {
      neutral: {
        color: vars.toneNeutral.enabled.label.color,
      },
      critical: {
        color: vars.toneCritical.enabled.label.color,
      },
    },
  },
  defaultVariants: {
    tone: "neutral",
  },
});

export default actionSheetItem;

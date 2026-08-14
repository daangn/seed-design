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

    backgroundColor: vars.base.rest.root.color,
    minHeight: vars.base.rest.root.minHeight,
    paddingInline: vars.base.rest.root.paddingX,
    paddingBlock: vars.base.rest.root.paddingY,

    fontSize: vars.base.rest.label.fontSize,
    lineHeight: vars.base.rest.label.lineHeight,
    fontWeight: vars.base.rest.label.fontWeight,

    [pseudo(active)]: {
      backgroundColor: vars.base.pressed.root.color,
    },

    "&:after": {
      content: "''",
      display: "block",
      position: "absolute",
      left: rootVars.base.rest.divider.marginX,
      right: rootVars.base.rest.divider.marginX,
      bottom: 0,
      height: rootVars.base.rest.divider.strokeWidth,
      background: rootVars.base.rest.divider.strokeColor,
    },
  },
  variants: {
    tone: {
      neutral: {
        color: vars.toneNeutral.rest.label.color,
      },
      critical: {
        color: vars.toneCritical.rest.label.color,
      },
    },
  },
  defaultVariants: {
    tone: "neutral",
  },
});

export default actionSheetItem;

import {
  extendedActionSheetItem as vars,
  extendedActionSheet as rootVars,
} from "../vars/component";
import { defineRecipe } from "../utils/define";
import { active, pseudo } from "../utils/pseudo";
import { prefixIcon } from "../utils/icon";

/**
 * @deprecated Use `menu-sheet-item` instead.
 */
const extendedActionSheetItem = defineRecipe({
  name: "extended-action-sheet-item",
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",

    backgroundColor: vars.base.rest.root.color,
    minHeight: vars.base.rest.root.minHeight,
    paddingInline: vars.base.rest.root.paddingX,
    paddingBlock: vars.base.rest.root.paddingY,
    gap: vars.base.rest.root.gap,
    boxShadow: `inset 0 calc(-1 * ${rootVars.base.rest.divider.strokeBottomWidth}) 0 ${rootVars.base.rest.divider.strokeColor}`,

    fontSize: vars.base.rest.label.fontSize,
    lineHeight: vars.base.rest.label.lineHeight,
    fontWeight: vars.base.rest.label.fontWeight,

    [pseudo(active)]: {
      backgroundColor: vars.base.pressed.root.color,
    },
    "&:last-child": {
      boxShadow: "none",
    },

    ...prefixIcon({
      size: vars.base.rest.prefixIcon.size,
    }),
  },
  variants: {
    tone: {
      neutral: {
        color: vars.toneNeutral.rest.label.color,
        ...prefixIcon({
          color: vars.toneNeutral.rest.prefixIcon.color,
        }),
      },
      critical: {
        color: vars.toneCritical.rest.label.color,
        ...prefixIcon({
          color: vars.toneCritical.rest.prefixIcon.color,
        }),
      },
    },
  },
  defaultVariants: {
    tone: "neutral",
  },
});

export default extendedActionSheetItem;

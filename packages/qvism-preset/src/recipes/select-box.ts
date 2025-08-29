import { defineRecipe, defineSlotRecipe } from "../utils/define";
import { active, checked, pseudo } from "../utils/pseudo";
import { selectBox as vars } from "../vars/component";

export const selectBoxGroup = defineRecipe({
  name: "select-box-group",
  base: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  variants: {},
  defaultVariants: {},
});

export const selectBox = defineSlotRecipe({
  name: "select-box",
  slots: ["root", "content", "label", "description"],
  base: {
    root: {
      cursor: "pointer",

      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: vars.base.enabled.root.gap,

      paddingInline: vars.base.enabled.root.paddingX,
      paddingBlock: vars.base.enabled.root.paddingY,

      borderRadius: vars.base.enabled.root.cornerRadius,

      boxShadow: `inset 0 0 0 ${vars.base.enabled.root.strokeWidth} ${vars.base.enabled.root.strokeColor}`,

      [pseudo(active)]: {
        backgroundColor: vars.base.enabledPressed.root.color,
      },

      [pseudo(checked)]: {
        backgroundColor: vars.base.enabledSelected.root.color,

        boxShadow: `inset 0 0 0 ${vars.base.enabled.root.strokeWidth} ${vars.base.enabledSelected.root.strokeColor}`,
      },

      [pseudo(checked, active)]: {
        backgroundColor: vars.base.enabledSelectedPressed.root.color,
      },
    },
    content: {
      display: "flex",
      flexDirection: "column",
      flexGrow: 1,

      gap: vars.base.enabled.content.gap,
    },
    label: {
      color: vars.base.enabled.label.color,

      fontWeight: vars.base.enabled.label.fontWeight,
      fontSize: vars.base.enabled.label.fontSize,
      lineHeight: vars.base.enabled.label.lineHeight,
    },
    description: {
      color: vars.base.enabled.description.color,

      fontWeight: vars.base.enabled.description.fontWeight,
      fontSize: vars.base.enabled.description.fontSize,
      lineHeight: vars.base.enabled.description.lineHeight,
    },
  },
  variants: {},
  defaultVariants: {},
});

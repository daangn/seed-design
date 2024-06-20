import { vars } from "./__generated__/switch.vars";
import { defineRecipe } from "./helper";
import { active, checked, disabled, pseudo } from "./pseudo";

const switchRecipe = defineRecipe({
  name: "switch",
  slots: ["root", "control", "thumb"],
  base: {
    root: {
      display: "inline-flex",
      alignItems: "flex-start",
      justifyContent: "space-between",

      position: "relative",

      verticalAlign: "top",
      isolation: "isolate",
      opacity: 1,

      [pseudo(disabled, checked)]: {
        opacity: vars.base.disabledSelected.root.opacity,
      },
    },
    control: {
      display: "block",
      position: "absolute",

      minInlineSize: vars.base.enabled.root.width,
      minBlockSize: vars.base.enabled.root.height,

      borderRadius: vars.base.enabled.control.cornerRadius,
      background: vars.base.enabled.control.color,

      padding: `${vars.base.enabled.control.paddingY} ${vars.base.enabled.control.paddingX}`,

      transition: "background-color 50ms cubic-bezier(0.35, 0, 0.35, 1) 20ms",

      [pseudo(active)]: {
        background: vars.base.enabled.control.color,
      },

      [pseudo(checked)]: {
        background: vars.base.enabledSelected.control.color,
      },

      [pseudo(disabled)]: {
        background: vars.base.disabled.control.color,
      },
    },
    thumb: {
      width: vars.base.enabled.thumb.width,
      height: vars.base.enabled.thumb.height,

      borderRadius: vars.base.enabled.thumb.cornerRadius,
      background: vars.base.enabled.thumb.color,

      boxShadow: vars.base.enabled.thumb.shadow,

      transition: "transform 150ms cubic-bezier(0.35, 0, 0.35, 1)",

      [pseudo(checked)]: {
        transform: `translateX(calc(${vars.base.enabled.root.width} - ${vars.base.enabled.root.height}))`,
      },
    },
  },
  variants: {},
});

export default switchRecipe;

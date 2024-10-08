import { vars } from "./__generated__/switch.vars";
import { defineRecipe } from "./helper";
import { active, checked, disabled, pseudo } from "./pseudo";

const switchRecipe = defineRecipe({
  name: "switch",
  slots: ["root", "control", "thumb"],
  base: {
    root: {
      boxSizing: "border-box",
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
      position: "relative",

      borderRadius: vars.base.enabled.control.cornerRadius,
      background: vars.base.enabled.control.color,

      transition: "background-color 50ms cubic-bezier(0.35, 0, 0.35, 1) 20ms",

      [pseudo(checked)]: {
        background: vars.base.enabledSelected.control.color,
      },

      [pseudo(disabled)]: {
        background: vars.base.disabled.control.color,
      },
    },
    thumb: {
      borderRadius: vars.base.enabled.thumb.cornerRadius,
      background: vars.base.enabled.thumb.color,

      boxShadow: vars.base.enabled.thumb.shadow,

      transition: "transform 150ms cubic-bezier(0.35, 0, 0.35, 1)",
    },
  },
  variants: {
    size: {
      medium: {
        control: {
          minInlineSize: vars.sizeMedium.enabled.root.width,
          minBlockSize: vars.sizeMedium.enabled.root.height,
          padding: `${vars.sizeMedium.enabled.control.paddingY} ${vars.sizeMedium.enabled.control.paddingX}`,
        },
        thumb: {
          width: vars.sizeMedium.enabled.thumb.width,
          height: vars.sizeMedium.enabled.thumb.height,

          [pseudo(checked)]: {
            transform: `translateX(calc(${vars.sizeMedium.enabled.root.width} - ${vars.sizeMedium.enabled.root.height}))`,
          },
        },
      },
      small: {
        control: {
          minInlineSize: vars.sizeSmall.enabled.root.width,
          minBlockSize: vars.sizeSmall.enabled.root.height,
          padding: `${vars.sizeSmall.enabled.control.paddingY} ${vars.sizeSmall.enabled.control.paddingX}`,
        },
        thumb: {
          width: vars.sizeSmall.enabled.thumb.width,
          height: vars.sizeSmall.enabled.thumb.height,

          [pseudo(checked)]: {
            transform: `translateX(calc(${vars.sizeSmall.enabled.root.width} - ${vars.sizeSmall.enabled.root.height}))`,
          },
        },
      },
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

export default switchRecipe;

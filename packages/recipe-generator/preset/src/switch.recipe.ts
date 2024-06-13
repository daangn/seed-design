import { vars } from "./__generated__/switch.vars";
import { defineRecipe } from "./helper";
import { active, checked, disabled, pseudo } from "./pseudo";

const switchRecipe = defineRecipe({
  name: "switch",
  slots: ["root", "control", "thumbContainer", "thumb"],
  base: {
    root: {
      display: "inline-flex",
      alignItems: "flex-start",
      justifyContent: "space-between",

      position: "relative",

      minInlineSize: vars.base.enabled.root.width,
      minBlockSize: vars.base.enabled.root.height,

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

      width: "100%",
      height: "100%",

      borderRadius: vars.base.enabled.track.cornerRadius,
      background: vars.base.enabled.track.color,

      transition: "background-color 50ms cubic-bezier(0.35, 0, 0.35, 1) 20ms",

      [pseudo(active)]: {
        background: vars.base.enabled.track.color,
      },

      [pseudo(checked)]: {
        background: vars.base.enabledSelected.track.color,
      },

      [pseudo(disabled)]: {
        background: vars.base.disabled.track.color,
      },
    },
    thumbContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",

      minInlineSize: vars.base.enabled.thumbContainer.width,
      minBlockSize: vars.base.enabled.thumbContainer.height,

      padding: vars.base.enabled.thumbContainer.padding,

      transition: "transform 150ms cubic-bezier(0.35, 0, 0.35, 1)",

      [pseudo(checked)]: {
        transform: `translateX(calc(${vars.base.enabled.root.width} - ${vars.base.enabled.root.height}))`,
      },
    },
    thumb: {
      minInlineSize: vars.base.enabled.thumb.width,
      minBlockSize: vars.base.enabled.thumb.height,

      borderRadius: vars.base.enabled.thumb.cornerRadius,
      background: vars.base.enabled.thumb.color,

      boxShadow: vars.base.enabled.thumb.shadow,
    },
  },
  variants: {},
});

export default switchRecipe;

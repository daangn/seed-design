import { vars } from "./__generated__/switch.vars";
import { defineRecipe } from "./helper";
import { active, checked, disabled, pseudo } from "./pseudo";

const switchRecipe = defineRecipe({
  name: "switch",
  slots: ["root", "track", "handleContainer", "handle"],
  base: {
    root: {
      display: "inline-flex",
      alignItems: "flex-start",
      justifyContent: "space-between",

      position: "relative",

      width: vars.base.enabled.root.minInlineSize,
      height: vars.base.enabled.root.minBlockSize,

      verticalAlign: "top",
      isolation: "isolate",
      opacity: 1,

      [pseudo(disabled, checked)]: {
        opacity: vars.base.disabledSelected.root.opacity,
      },
    },
    track: {
      display: "block",
      position: "absolute",

      width: "100%",
      height: "100%",

      borderRadius: vars.base.enabled.track.cornerRadius,
      background: vars.base.enabled.track.background,

      transition: "background-color 50ms cubic-bezier(0.35, 0, 0.35, 1) 20ms",

      [pseudo(active)]: {
        background: vars.base.enabled.track.background,
      },

      [pseudo(checked)]: {
        background: vars.base.enabledSelected.track.background,
      },

      [pseudo(disabled)]: {
        background: vars.base.disabled.track.background,
      },
    },
    handleContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",

      height: vars.base.enabled.handleContainer.minBlockSize,
      width: vars.base.enabled.handleContainer.minInlineSize,

      padding: vars.base.enabled.handleContainer.padding,

      transition: "transform 150ms cubic-bezier(0.35, 0, 0.35, 1)",

      [pseudo(checked)]: {
        transform: `translateX(calc(${vars.base.enabled.root.minInlineSize} - ${vars.base.enabled.root.minBlockSize}))`,
      },
    },
    handle: {
      width: vars.base.enabled.handle.minInlineSize,
      height: vars.base.enabled.handle.minBlockSize,

      borderRadius: vars.base.enabled.handle.cornerRadius,
      background: vars.base.enabled.handle.background,

      boxShadow: vars.base.enabled.handle.shadow,
    },
  },
  variants: {},
});

export default switchRecipe;

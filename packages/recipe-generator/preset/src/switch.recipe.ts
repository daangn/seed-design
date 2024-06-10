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

      minBlockSize: vars.base.enabled.root.minBlockSize,
      minInlineSize: vars.base.enabled.root.minInlineSize,

      verticalAlign: "top",
      isolation: "isolate",
      opacity: 1,

      [pseudo(disabled, checked)]: {
        opacity: vars.base.disabledSelected.root.opacity,
      },
    },
    track: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",

      boxSizing: "border-box",
      position: "relative",

      borderRadius: vars.base.enabled.track.cornerRadius,
      background: vars.base.enabled.track.background,

      transition: "background-color 50ms cubic-bezier(0.35, 0, 0.35, 1) 20ms",

      [pseudo(active)]: {
        background: vars.base.enabled.track.background,
      },

      [pseudo(checked)]: {
        justifyContent: "flex-end",
        background: vars.base.enabledSelected.track.background,
      },
    },
    handleContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",

      position: "absolute",

      minBlockSize: vars.base.enabled.handleContainer.minBlockSize,
      minInlineSize: vars.base.enabled.handleContainer.minInlineSize,

      padding: vars.base.enabled.handleContainer.padding,

      transition: "transform 150ms cubic-bezier(0.35, 0, 0.35, 1)",
    },
    handle: {
      width: "100%",
      height: "100%",

      borderRadius: vars.base.enabled.handle.cornerRadius,
      background: vars.base.enabled.handle.background,

      boxShadow: vars.base.enabled.handle.shadow,
    },
  },
  variants: {},
});

export default switchRecipe;

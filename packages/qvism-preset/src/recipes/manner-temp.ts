import { defineRecipe } from "../utils/define";
import { suffixIcon } from "../utils/icon";
import { mannerTemp as vars } from "../vars/component";

const mannerTemp = defineRecipe({
  name: "manner-temp",
  base: {
    display: "inline-flex",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: vars.base.enabled.root.gap,
    boxSizing: "border-box",

    fontSize: vars.base.enabled.label.fontSize,
    lineHeight: vars.base.enabled.label.lineHeight,
    fontWeight: vars.base.enabled.label.fontWeight,

    ...suffixIcon({
      size: vars.base.enabled.emote.size,
      marginLeft: `calc(${vars.base.enabled.emote.bleed} * -1)`,
      marginRight: `calc(${vars.base.enabled.emote.bleed} * -1)`,
      marginTop: `calc(${vars.base.enabled.emote.bleed} * -1)`,
      marginBottom: `calc(${vars.base.enabled.emote.bleed} * -1)`,
    }),
  },
  variants: {
    level: {
      l1: {
        color: vars.levelL1.enabled.label.color,
      },
      l2: {
        color: vars.levelL2.enabled.label.color,
      },
      l3: {
        color: vars.levelL3.enabled.label.color,
      },
      l4: {
        color: vars.levelL4.enabled.label.color,
      },
      l5: {
        color: vars.levelL5.enabled.label.color,
      },
      l6: {
        color: vars.levelL6.enabled.label.color,
      },
      l7: {
        color: vars.levelL7.enabled.label.color,
      },
      l8: {
        color: vars.levelL8.enabled.label.color,
      },
      l9: {
        color: vars.levelL9.enabled.label.color,
      },
      l10: {
        color: vars.levelL10.enabled.label.color,
      },
    },
  },
  defaultVariants: {
    level: "l1",
  },
});

export default mannerTemp;

import { defineRecipe } from "../utils/define";
import { suffixIcon } from "../utils/icon";
import { mannerTemp as vars } from "../vars/component";

const mannerTemp = defineRecipe({
  name: "manner-temp",
  base: {
    display: "inline-flex",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: vars.base.rest.root.gap,
    boxSizing: "border-box",

    fontSize: vars.base.rest.label.fontSize,
    lineHeight: vars.base.rest.label.lineHeight,
    fontWeight: vars.base.rest.label.fontWeight,

    ...suffixIcon({
      size: vars.base.rest.emote.size,
      marginLeft: `calc(${vars.base.rest.emote.bleed} * -1)`,
      marginRight: `calc(${vars.base.rest.emote.bleed} * -1)`,
      marginTop: `calc(${vars.base.rest.emote.bleed} * -1)`,
      marginBottom: `calc(${vars.base.rest.emote.bleed} * -1)`,
    }),
  },
  variants: {
    level: {
      l1: {
        color: vars.levelL1.rest.label.color,
      },
      l2: {
        color: vars.levelL2.rest.label.color,
      },
      l3: {
        color: vars.levelL3.rest.label.color,
      },
      l4: {
        color: vars.levelL4.rest.label.color,
      },
      l5: {
        color: vars.levelL5.rest.label.color,
      },
      l6: {
        color: vars.levelL6.rest.label.color,
      },
      l7: {
        color: vars.levelL7.rest.label.color,
      },
      l8: {
        color: vars.levelL8.rest.label.color,
      },
      l9: {
        color: vars.levelL9.rest.label.color,
      },
      l10: {
        color: vars.levelL10.rest.label.color,
      },
    },
  },
  defaultVariants: {
    level: "l1",
  },
});

export default mannerTemp;

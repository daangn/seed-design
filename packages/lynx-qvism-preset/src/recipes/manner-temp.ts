import { mannerTemp as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";

const mannerTemp = defineSlotRecipe({
  name: "manner-temp",
  slots: ["root", "label", "emote"],
  base: {
    root: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      flexShrink: 0,
      gap: vars.base.enabled.root.gap,
    },
    label: {
      fontSize: vars.base.enabled.label.fontSize,
      lineHeight: vars.base.enabled.label.lineHeight,
      fontWeight: vars.base.enabled.label.fontWeight,
    },
    emote: {
      width: vars.base.enabled.emote.size,
      height: vars.base.enabled.emote.size,
      marginLeft: `calc(${vars.base.enabled.emote.bleed} * -1)`,
      marginRight: `calc(${vars.base.enabled.emote.bleed} * -1)`,
      marginTop: `calc(${vars.base.enabled.emote.bleed} * -1)`,
      marginBottom: `calc(${vars.base.enabled.emote.bleed} * -1)`,
      flexShrink: 0,
    },
  },
  variants: {
    level: {
      l1: { label: { color: vars.levelL1.enabled.label.color } },
      l2: { label: { color: vars.levelL2.enabled.label.color } },
      l3: { label: { color: vars.levelL3.enabled.label.color } },
      l4: { label: { color: vars.levelL4.enabled.label.color } },
      l5: { label: { color: vars.levelL5.enabled.label.color } },
      l6: { label: { color: vars.levelL6.enabled.label.color } },
      l7: { label: { color: vars.levelL7.enabled.label.color } },
      l8: { label: { color: vars.levelL8.enabled.label.color } },
      l9: { label: { color: vars.levelL9.enabled.label.color } },
      l10: { label: { color: vars.levelL10.enabled.label.color } },
    },
  },
  defaultVariants: {
    level: "l1",
  },
});

export default mannerTemp;

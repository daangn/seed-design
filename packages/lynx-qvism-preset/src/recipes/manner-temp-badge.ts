import { mannerTempBadge as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";

const mannerTempBadge = defineSlotRecipe({
  name: "manner-temp-badge",
  slots: ["root", "label"],
  base: {
    root: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      minHeight: vars.base.enabled.root.minHeight,
      paddingLeft: vars.base.enabled.root.paddingX,
      paddingRight: vars.base.enabled.root.paddingX,
      paddingTop: vars.base.enabled.root.paddingY,
      paddingBottom: vars.base.enabled.root.paddingY,
      borderRadius: vars.base.enabled.root.cornerRadius,
    },
    label: {
      fontSize: vars.base.enabled.label.fontSize,
      lineHeight: vars.base.enabled.label.lineHeight,
      fontWeight: vars.base.enabled.label.fontWeight,
    },
  },
  variants: {
    level: {
      l1: {
        root: { backgroundColor: vars.levelL1.enabled.root.color },
        label: { color: vars.levelL1.enabled.label.color },
      },
      l2: {
        root: { backgroundColor: vars.levelL2.enabled.root.color },
        label: { color: vars.levelL2.enabled.label.color },
      },
      l3: {
        root: { backgroundColor: vars.levelL3.enabled.root.color },
        label: { color: vars.levelL3.enabled.label.color },
      },
      l4: {
        root: { backgroundColor: vars.levelL4.enabled.root.color },
        label: { color: vars.levelL4.enabled.label.color },
      },
      l5: {
        root: { backgroundColor: vars.levelL5.enabled.root.color },
        label: { color: vars.levelL5.enabled.label.color },
      },
      l6: {
        root: { backgroundColor: vars.levelL6.enabled.root.color },
        label: { color: vars.levelL6.enabled.label.color },
      },
      l7: {
        root: { backgroundColor: vars.levelL7.enabled.root.color },
        label: { color: vars.levelL7.enabled.label.color },
      },
      l8: {
        root: { backgroundColor: vars.levelL8.enabled.root.color },
        label: { color: vars.levelL8.enabled.label.color },
      },
      l9: {
        root: { backgroundColor: vars.levelL9.enabled.root.color },
        label: { color: vars.levelL9.enabled.label.color },
      },
      l10: {
        root: { backgroundColor: vars.levelL10.enabled.root.color },
        label: { color: vars.levelL10.enabled.label.color },
      },
    },
  },
  defaultVariants: {
    level: "l1",
  },
});

export default mannerTempBadge;

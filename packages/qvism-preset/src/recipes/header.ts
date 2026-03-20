import { vars } from "../vars";
import { defineSlotRecipe } from "../utils/define";

const header = defineSlotRecipe({
  name: "header",
  slots: ["root", "left", "center", "right"],
  base: {
    root: {
      display: "flex",
      alignItems: "center",
      width: "100%",
      boxSizing: "border-box",
      minHeight: "56px",
      paddingLeft: vars.$dimension.x4,
      paddingRight: vars.$dimension.x4,
      paddingTop: vars.$dimension.x2,
      paddingBottom: vars.$dimension.x2,
      gap: vars.$dimension.x3,
    },
    left: {
      display: "flex",
      alignItems: "center",
      flexShrink: 0,
      gap: vars.$dimension.x3,
    },
    center: {
      display: "flex",
      alignItems: "center",
      flex: 1,
      minWidth: 0,
      gap: vars.$dimension.x1,
    },
    right: {
      display: "flex",
      alignItems: "center",
      flexShrink: 0,
      gap: vars.$dimension.x2,
    },
  },
  variants: {
    tone: {
      layer: {
        root: { backgroundColor: vars.$color.bg.layerDefault },
      },
      transparent: {
        root: { backgroundColor: "transparent" },
      },
    },
    divider: {
      true: {
        root: {
          borderBottomWidth: "1px",
          borderBottomStyle: "solid",
          borderBottomColor: vars.$color.stroke.neutralSubtle,
        },
      },
      false: {},
    },
  },
  defaultVariants: {
    tone: "layer",
    divider: false,
  },
});

export default header;

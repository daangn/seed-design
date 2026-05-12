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
      paddingLeft: vars.$dimension.x6,
      paddingRight: vars.$dimension.x6,
      paddingTop: vars.$dimension.x2,
      paddingBottom: vars.$dimension.x2,
      gap: vars.$dimension.x3,
    },
    left: {
      display: "flex",
      alignItems: "center",
      flexShrink: 0,
      gap: vars.$dimension.x4,
    },
    center: {
      display: "flex",
      alignItems: "center",
      flex: 1,
      minWidth: 0,
      gap: vars.$dimension.x4,
    },
    right: {
      display: "flex",
      alignItems: "center",
      flexShrink: 0,
      marginLeft: "auto",
      gap: vars.$dimension.x4,
    },
  },
  variants: {
    size: {
      medium: {
        root: { minHeight: "72px" },
      },
      small: {
        root: { minHeight: "56px" },
      },
    },
    transparent: {
      true: {
        root: { backgroundColor: "transparent" },
      },
      false: {
        root: { backgroundColor: vars.$color.bg.layerDefault },
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
    size: "medium",
    transparent: false,
    divider: false,
  },
});

export default header;

import { breakpoints } from "../utils/breakpoint";
import { defineSlotRecipe } from "../utils/define";

const layout = defineSlotRecipe({
  name: "layout",
  slots: ["root", "content"],
  base: {
    root: {
      display: "flex",

      height: "100vh",

      overflowY: "auto",
    },
    content: {
      width: "100%",

      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  variants: {
    density: {
      low: {
        content: {
          [breakpoints.up("md")]: {
            maxWidth: "720px",
          },
        },
      },
      medium: {
        content: {
          [breakpoints.up("md")]: {
            maxWidth: "720px",
          },

          [breakpoints.up("lg")]: {
            maxWidth: "1040px",
          },
        },
      },
      high: {},
    },
  },
  defaultVariants: {
    density: "medium",
  },
});

export default layout;

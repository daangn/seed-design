import { linkContent as vars } from "@seed-design/css/vars/component";

import { defineRecipe } from "../utils/define";
import { suffixIcon } from "../utils/icon";

const linkContent = defineRecipe({
  name: "link-content",
  slots: ["root"],
  base: {
    root: {
      display: "inline-flex",
      alignItems: "center",
      cursor: "pointer",
      backgroundColor: "transparent",
      boxSizing: "border-box",
      border: "none",
      outline: "none",

      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
      fontFamily: "inherit",
      textAlign: "center",

      paddingInline: 0,
      paddingBlock: 0,

      color: "var(--seed-box-color)",

      ...suffixIcon({
        color: "var(--seed-box-color)",
      }),
    },
  },
  variants: {
    weight: {
      bold: {
        root: {
          fontWeight: vars.weightBold.enabled.label.fontWeight,
        },
      },
      regular: {
        root: {
          fontWeight: vars.weightRegular.enabled.label.fontWeight,
        },
      },
    },
    size: {
      t6: {
        root: {
          fontSize: vars.sizeT6.enabled.label.fontSize,
          lineHeight: vars.sizeT6.enabled.label.lineHeight,

          ...suffixIcon({
            size: vars.sizeT6.enabled.suffixIcon.size,
          }),
        },
      },
      t5: {
        root: {
          fontSize: vars.sizeT5.enabled.label.fontSize,
          lineHeight: vars.sizeT5.enabled.label.lineHeight,

          ...suffixIcon({
            size: vars.sizeT5.enabled.suffixIcon.size,
          }),
        },
      },
      t4: {
        root: {
          fontSize: vars.sizeT4.enabled.label.fontSize,
          lineHeight: vars.sizeT4.enabled.label.lineHeight,

          ...suffixIcon({
            size: vars.sizeT4.enabled.suffixIcon.size,
          }),
        },
      },
    },
  },
  defaultVariants: {
    size: "t4",
    weight: "regular",
  },
});

export default linkContent;

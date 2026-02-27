import { linkContent as vars } from "../vars/component";

import { defineRecipe } from "../utils/define";
import { suffixIcon } from "../utils/icon";

/**
 * @deprecated Use `action-button` with variant="ghost" instead.
 */
const linkContent = defineRecipe({
  name: "link-content",
  base: {
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
  variants: {
    weight: {
      bold: {
        fontWeight: vars.weightBold.enabled.label.fontWeight,
      },
      regular: {
        fontWeight: vars.weightRegular.enabled.label.fontWeight,
      },
    },
    size: {
      t6: {
        fontSize: vars.sizeT6.enabled.label.fontSize,
        lineHeight: vars.sizeT6.enabled.label.lineHeight,
        gap: vars.sizeT6.enabled.root.gap,

        ...suffixIcon({
          size: vars.sizeT6.enabled.suffixIcon.size,
        }),
      },
      t5: {
        fontSize: vars.sizeT5.enabled.label.fontSize,
        lineHeight: vars.sizeT5.enabled.label.lineHeight,
        gap: vars.sizeT5.enabled.root.gap,

        ...suffixIcon({
          size: vars.sizeT5.enabled.suffixIcon.size,
        }),
      },
      t4: {
        fontSize: vars.sizeT4.enabled.label.fontSize,
        lineHeight: vars.sizeT4.enabled.label.lineHeight,
        gap: vars.sizeT4.enabled.root.gap,

        ...suffixIcon({
          size: vars.sizeT4.enabled.suffixIcon.size,
        }),
      },
    },
  },
  defaultVariants: {
    size: "t4",
    weight: "regular",
  },
});

export default linkContent;

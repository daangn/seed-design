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
        fontWeight: vars.weightBold.rest.label.fontWeight,
      },
      regular: {
        fontWeight: vars.weightRegular.rest.label.fontWeight,
      },
    },
    size: {
      t6: {
        fontSize: vars.sizeT6.rest.label.fontSize,
        lineHeight: vars.sizeT6.rest.label.lineHeight,
        gap: vars.sizeT6.rest.root.gap,

        ...suffixIcon({
          size: vars.sizeT6.rest.suffixIcon.size,
        }),
      },
      t5: {
        fontSize: vars.sizeT5.rest.label.fontSize,
        lineHeight: vars.sizeT5.rest.label.lineHeight,
        gap: vars.sizeT5.rest.root.gap,

        ...suffixIcon({
          size: vars.sizeT5.rest.suffixIcon.size,
        }),
      },
      t4: {
        fontSize: vars.sizeT4.rest.label.fontSize,
        lineHeight: vars.sizeT4.rest.label.lineHeight,
        gap: vars.sizeT4.rest.root.gap,

        ...suffixIcon({
          size: vars.sizeT4.rest.suffixIcon.size,
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

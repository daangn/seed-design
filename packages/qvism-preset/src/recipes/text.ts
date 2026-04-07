import { typography as vars } from "../vars/component";

import { defineRecipe } from "../utils/define";

const uncapitalize = (str: string) => str.charAt(0).toLowerCase() + str.slice(1);

type OmitPrefix<T> = T extends `textStyle${infer U}` ? U : never;

const text = defineRecipe({
  name: "text",
  base: {
    margin: 0,

    color: "var(--ride-text-color)",
    fontSize: "var(--ride-font-size)",
    fontWeight: "var(--ride-font-weight)",
    lineHeight: "var(--ride-line-height)",
    textAlign: "var(--ride-text-align)",
    userSelect: "var(--ride-user-select)",

    "--ride-text-color": "inherit",
    "--ride-font-size": "inherit",
    "--ride-font-weight": "inherit",
    "--ride-line-height": "inherit",
    "--ride-text-align": "inherit",
    "--ride-user-select": "inherit",
    "--ride-white-space": "inherit",

    "--ride-max-lines": "initial",
  },
  variants: {
    textStyle: Object.fromEntries(
      Object.entries(vars).map(([key, value]) => [
        uncapitalize(key.split("textStyle")[1]),
        {
          "--ride-font-size": value.enabled.root.fontSize,
          "--ride-line-height": value.enabled.root.lineHeight,
          "--ride-font-weight": value.enabled.root.fontWeight,
        },
      ]),
    ) as Record<Uncapitalize<OmitPrefix<keyof typeof vars>>, any>,
    maxLines: {
      none: {
        overflow: "unset",
        minWidth: "unset",
        textOverflow: "unset",
        whiteSpace: "var(--ride-white-space)",
        WebkitLineClamp: "unset",
      },
      single: {
        display: "block",
        overflow: "hidden",
        minWidth: 0,
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        WebkitLineClamp: "var(--ride-max-lines)",
      },
      multi: {
        display: "-webkit-box",
        overflow: "hidden",
        minWidth: 0,
        textOverflow: "ellipsis",
        whiteSpace: "initial",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: "var(--ride-max-lines)",
      },
    },
    textDecorationLine: {
      none: {
        textDecorationLine: "none",
      },
      // NOTE: We keep kebab-case for textDecorationLine because it's a CSS property.
      "line-through": {
        textDecorationLine: "line-through",
      },
      underline: {
        textDecorationLine: "underline",

        // might want to customize text decoration styles or underline offset later
      },
    },
  },
  defaultVariants: {
    textStyle: "t5Regular",
    maxLines: "none",
    textDecorationLine: "none",
  },
});

export default text;

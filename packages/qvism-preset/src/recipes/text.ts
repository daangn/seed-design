import { typography as vars } from "../vars/component";

import { defineRecipe } from "../utils/define";

const uncapitalize = (str: string) => str.charAt(0).toLowerCase() + str.slice(1);

type OmitPrefix<T> = T extends `textStyle${infer U}` ? U : never;

const text = defineRecipe({
  name: "text",
  base: {
    margin: 0,

    color: "var(--seed-text-color)",
    fontSize: "var(--seed-font-size)",
    fontWeight: "var(--seed-font-weight)",
    lineHeight: "var(--seed-line-height)",
    textAlign: "var(--seed-text-align)",
    userSelect: "var(--seed-user-select)",

    "--seed-text-color": "inherit",
    "--seed-font-size": "inherit",
    "--seed-font-weight": "inherit",
    "--seed-line-height": "inherit",
    "--seed-text-align": "inherit",
    "--seed-user-select": "inherit",
    "--seed-white-space": "inherit",

    "--seed-max-lines": "initial",
  },
  variants: {
    textStyle: Object.fromEntries(
      Object.entries(vars).map(([key, value]) => [
        uncapitalize(key.split("textStyle")[1]),
        {
          "--seed-font-size": value.enabled.root.fontSize,
          "--seed-line-height": value.enabled.root.lineHeight,
          "--seed-font-weight": value.enabled.root.fontWeight,
        },
      ]),
    ) as Record<Uncapitalize<OmitPrefix<keyof typeof vars>>, any>,
    maxLines: {
      none: {
        overflow: "unset",
        minWidth: "unset",
        textOverflow: "unset",
        whiteSpace: "var(--seed-white-space)",
        WebkitLineClamp: "unset",
      },
      single: {
        display: "block",
        overflow: "hidden",
        minWidth: 0,
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        WebkitLineClamp: "var(--seed-max-lines)",
      },
      multi: {
        display: "-webkit-box",
        overflow: "hidden",
        minWidth: 0,
        textOverflow: "ellipsis",
        whiteSpace: "initial",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: "var(--seed-max-lines)",
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

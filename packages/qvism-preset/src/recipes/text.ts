import { typography as vars } from "../vars/component";

import { defineRecipe } from "../utils/define";

const uncapitalize = (str: string) => str.charAt(0).toLowerCase() + str.slice(1);

type OmitPrefix<T> = T extends `textStyle${infer U}` ? U : never;

const text = defineRecipe({
  name: "text",
  base: {
    margin: 0,
    textAlign: "var(--seed-text-align)",
    color: "var(--seed-text-color)",
    fontSize: "var(--seed-font-size)",
    lineHeight: "var(--seed-line-height)",
    fontWeight: "var(--seed-font-weight)",
    "--seed-text-color": "inherit",
    "--seed-font-size": "inherit",
    "--seed-line-height": "inherit",
    "--seed-font-weight": "inherit",
    "--seed-text-align": "inherit",
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
        display: "unset",
        overflow: "unset",
        minWidth: "unset",
        textOverflow: "unset",
        whiteSpace: "unset",
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
  },
  defaultVariants: {
    textStyle: "t5Regular",
    maxLines: "none",
  },
});

export default text;

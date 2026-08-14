import { field as vars, fieldLabel as labelVars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";
import { invalid, not, pseudo } from "../utils/pseudo";
import { prefixIcon } from "../utils/icon";

export const field = defineSlotRecipe({
  name: "field",
  slots: [
    "root",
    "header",
    "footer",
    "description",
    "errorMessage",
    "characterCountArea",
    "characterCount",
    "maxCharacterCount",
  ],
  base: {
    root: {
      display: "flex",
      flexDirection: "column",

      width: "100%",

      gap: vars.base.rest.root.gap,
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",

      paddingInline: vars.base.rest.header.paddingX,
      gap: vars.base.rest.header.gap,
    },
    footer: {
      display: "flex",
      alignItems: "flex-start",

      paddingInline: vars.base.rest.footer.paddingX,
      gap: vars.base.rest.footer.gap,
    },
    description: {
      display: "flex",

      color: vars.base.rest.description.color,
      fontWeight: vars.base.rest.description.fontWeight,
      fontSize: vars.base.rest.description.fontSize,
      lineHeight: vars.base.rest.description.lineHeight,

      ...prefixIcon({
        size: vars.base.rest.descriptionIcon.size,
        color: vars.base.rest.descriptionIcon.color,
        marginRight: vars.base.rest.descriptionIcon.paddingRight,
        marginTop: `calc((${vars.base.rest.description.lineHeight} - ${vars.base.rest.descriptionIcon.size}) / 2)`,
      }),
    },
    errorMessage: {
      display: "flex",

      color: vars.base.rest.errorMessage.color,
      fontWeight: vars.base.rest.errorMessage.fontWeight,
      fontSize: vars.base.rest.errorMessage.fontSize,
      lineHeight: vars.base.rest.errorMessage.lineHeight,

      ...prefixIcon({
        size: vars.base.rest.errorIcon.size,
        color: vars.base.rest.errorIcon.color,
        marginRight: vars.base.rest.errorIcon.paddingRight,
        marginTop: `calc((${vars.base.rest.errorMessage.lineHeight} - ${vars.base.rest.errorIcon.size}) / 2)`,
      }),
    },
    characterCountArea: {
      marginLeft: "auto",

      // we define lineHeight here because some reset.css sets default line-height
      // e.g. tailwind preflight sets * { line-height: 1.5 }
      fontSize: vars.base.rest.characterCount.fontSize,
      lineHeight: vars.base.rest.characterCount.lineHeight,
    },
    characterCount: {
      color: vars.base.rest.characterCount.color,
      fontWeight: vars.base.rest.characterCount.fontWeight,
      fontSize: vars.base.rest.characterCount.fontSize,
      lineHeight: vars.base.rest.characterCount.lineHeight,

      [pseudo("[data-empty]", not(invalid))]: {
        color: vars.base.rest.maxCharacterCount.color,
      },

      [pseudo(invalid)]: {
        color: vars.base.invalid.characterCount.color,
      },
    },
    maxCharacterCount: {
      color: vars.base.rest.maxCharacterCount.color,
      fontWeight: vars.base.rest.maxCharacterCount.fontWeight,
      fontSize: vars.base.rest.maxCharacterCount.fontSize,
      lineHeight: vars.base.rest.maxCharacterCount.lineHeight,

      [pseudo(invalid)]: {
        color: vars.base.invalid.maxCharacterCount.color,
      },
    },
  },
  variants: {},
  defaultVariants: {},
});

export const fieldLabel = defineSlotRecipe({
  name: "field-label",
  slots: ["root", "indicatorText", "indicatorIcon"],
  base: {
    root: {
      color: labelVars.base.rest.root.color,
      fontSize: labelVars.base.rest.root.fontSize,
      lineHeight: labelVars.base.rest.root.lineHeight,
    },
    indicatorText: {
      display: "inline",
      verticalAlign: "bottom",

      // TODO: have some better way to derive `--seed-font-size-limit-min/max` and px values
      // NOTE: when updating vars, update px values accordingly
      paddingLeft: `clamp(calc(4px * var(--seed-font-size-limit-min)), ${vars.base.rest.indicatorText.paddingLeft}, calc(4px * var(--seed-font-size-limit-max)))`,

      color: vars.base.rest.indicatorText.color,
      fontSize: vars.base.rest.indicatorText.fontSize,
      lineHeight: vars.base.rest.indicatorText.lineHeight,
      fontWeight: vars.base.rest.indicatorText.fontWeight,
    },
    indicatorIcon: {
      display: "inline",
      verticalAlign: "top",

      // TODO: have some better way to derive `--seed-font-size-limit-min/max` and px values
      // NOTE: when updating vars, update px values accordingly
      width: `clamp(calc(6px * var(--seed-font-size-limit-min)), ${vars.base.rest.indicatorIcon.size}, calc(6px * var(--seed-font-size-limit-max)))`,
      height: `clamp(calc(6px * var(--seed-font-size-limit-min)), ${vars.base.rest.indicatorIcon.size}, calc(6px * var(--seed-font-size-limit-max)))`,
      marginTop: `clamp(calc(4px * var(--seed-font-size-limit-min)), ${vars.base.rest.indicatorIcon.paddingTop}, calc(4px * var(--seed-font-size-limit-max)))`,
      marginLeft: `clamp(calc(2px * var(--seed-font-size-limit-min)), ${vars.base.rest.indicatorIcon.paddingLeft}, calc(2px * var(--seed-font-size-limit-max)))`,

      color: vars.base.rest.indicatorIcon.color,
    },
  },
  variants: {
    weight: {
      medium: {
        root: {
          fontWeight: labelVars.weightMedium.rest.root.fontWeight,
        },
      },
      bold: {
        root: {
          fontWeight: labelVars.weightBold.rest.root.fontWeight,
        },
      },
    },
  },
  defaultVariants: {
    weight: "medium",
  },
});

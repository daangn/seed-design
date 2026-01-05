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

      gap: vars.base.enabled.root.gap,
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",

      paddingLeft: vars.base.enabled.header.paddingX,
      paddingRight: vars.base.enabled.header.paddingX,
      gap: vars.base.enabled.header.gap,
    },
    footer: {
      display: "flex",
      alignItems: "flex-start",

      paddingLeft: vars.base.enabled.footer.paddingX,
      paddingRight: vars.base.enabled.footer.paddingX,
      gap: vars.base.enabled.footer.gap,
    },
    description: {
      display: "flex",

      color: vars.base.enabled.description.color,
      fontWeight: vars.base.enabled.description.fontWeight,
      fontSize: vars.base.enabled.description.fontSize,
      lineHeight: vars.base.enabled.description.lineHeight,

      ...prefixIcon({
        size: vars.base.enabled.descriptionIcon.size,
        color: vars.base.enabled.descriptionIcon.color,
        marginRight: vars.base.enabled.descriptionIcon.paddingRight,
        marginTop: `calc((${vars.base.enabled.description.lineHeight} - ${vars.base.enabled.descriptionIcon.size}) / 2)`,
      }),
    },
    errorMessage: {
      display: "flex",

      color: vars.base.enabled.errorMessage.color,
      fontWeight: vars.base.enabled.errorMessage.fontWeight,
      fontSize: vars.base.enabled.errorMessage.fontSize,
      lineHeight: vars.base.enabled.errorMessage.lineHeight,

      ...prefixIcon({
        size: vars.base.enabled.errorIcon.size,
        color: vars.base.enabled.errorIcon.color,
        marginRight: vars.base.enabled.errorIcon.paddingRight,
        marginTop: `calc((${vars.base.enabled.errorMessage.lineHeight} - ${vars.base.enabled.errorIcon.size}) / 2)`,
      }),
    },
    characterCountArea: {
      marginLeft: "auto",

      // we define lineHeight here because some reset.css sets default line-height
      // e.g. tailwind preflight sets * { line-height: 1.5 }
      fontSize: vars.base.enabled.characterCount.fontSize,
      lineHeight: vars.base.enabled.characterCount.lineHeight,
    },
    characterCount: {
      color: vars.base.enabled.characterCount.color,
      fontWeight: vars.base.enabled.characterCount.fontWeight,
      fontSize: vars.base.enabled.characterCount.fontSize,
      lineHeight: vars.base.enabled.characterCount.lineHeight,

      [pseudo("[data-empty]", not(invalid))]: {
        color: vars.base.enabled.maxCharacterCount.color,
      },

      [pseudo(invalid)]: {
        color: vars.base.invalid.characterCount.color,
      },
    },
    maxCharacterCount: {
      color: vars.base.enabled.maxCharacterCount.color,
      fontWeight: vars.base.enabled.maxCharacterCount.fontWeight,
      fontSize: vars.base.enabled.maxCharacterCount.fontSize,
      lineHeight: vars.base.enabled.maxCharacterCount.lineHeight,

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
      color: labelVars.base.enabled.root.color,
      fontSize: labelVars.base.enabled.root.fontSize,
      lineHeight: labelVars.base.enabled.root.lineHeight,
    },
    indicatorText: {
      display: "inline",
      verticalAlign: "bottom",

      // TODO: have some better way to derive `--seed-font-size-limit-min/max` and px values
      // NOTE: when updating vars, update px values accordingly
      paddingLeft: `clamp(calc(4px * var(--seed-font-size-limit-min)), ${vars.base.enabled.indicatorText.paddingLeft}, calc(4px * var(--seed-font-size-limit-max)))`,

      color: vars.base.enabled.indicatorText.color,
      fontSize: vars.base.enabled.indicatorText.fontSize,
      lineHeight: vars.base.enabled.indicatorText.lineHeight,
      fontWeight: vars.base.enabled.indicatorText.fontWeight,
    },
    indicatorIcon: {
      display: "inline",
      verticalAlign: "top",

      // TODO: have some better way to derive `--seed-font-size-limit-min/max` and px values
      // NOTE: when updating vars, update px values accordingly
      width: `clamp(calc(6px * var(--seed-font-size-limit-min)), ${vars.base.enabled.indicatorIcon.size}, calc(6px * var(--seed-font-size-limit-max)))`,
      height: `clamp(calc(6px * var(--seed-font-size-limit-min)), ${vars.base.enabled.indicatorIcon.size}, calc(6px * var(--seed-font-size-limit-max)))`,
      marginTop: `clamp(calc(4px * var(--seed-font-size-limit-min)), ${vars.base.enabled.indicatorIcon.paddingTop}, calc(4px * var(--seed-font-size-limit-max)))`,
      marginLeft: `clamp(calc(2px * var(--seed-font-size-limit-min)), ${vars.base.enabled.indicatorIcon.paddingLeft}, calc(2px * var(--seed-font-size-limit-max)))`,

      color: vars.base.enabled.indicatorIcon.color,
    },
  },
  variants: {
    weight: {
      medium: {
        root: {
          fontWeight: labelVars.weightMedium.enabled.root.fontWeight,
        },
      },
      bold: {
        root: {
          fontWeight: labelVars.weightBold.enabled.root.fontWeight,
        },
      },
    },
  },
  defaultVariants: {
    weight: "medium",
  },
});

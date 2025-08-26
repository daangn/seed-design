import { field as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";
import { invalid, not, pseudo } from "../utils/pseudo";

const field = defineSlotRecipe({
  name: "field",
  slots: [
    "root",
    "header",
    "label",
    "requiredIndicator",
    "footer",
    "description",
    "errorContainer",
    "errorMessage",
    "errorIcon",
    "characterCountArea",
    "characterCount",
    "maxCharacterCount",
  ],
  base: {
    root: {
      display: "flex",
      flexDirection: "column",

      width: "100%",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",

      paddingInline: vars.base.enabled.header.paddingX,
      gap: vars.base.enabled.header.gap,
    },
    label: {
      display: "flex",
      gap: vars.base.enabled.labelContainer.gap,

      color: vars.base.enabled.label.color,
      fontSize: vars.base.enabled.label.fontSize,
      lineHeight: vars.base.enabled.label.lineHeight,
    },
    indicator: {
      color: vars.base.enabled.indicator.color,
      fontSize: vars.base.enabled.indicator.fontSize,
      lineHeight: vars.base.enabled.indicator.lineHeight,
      fontWeight: vars.base.enabled.indicator.fontWeight,
    },
    footer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",

      paddingInline: vars.base.enabled.footer.paddingX,
      gap: vars.base.enabled.footer.gap,
    },
    description: {
      color: vars.base.enabled.description.color,
      fontWeight: vars.base.enabled.description.fontWeight,
      fontSize: vars.base.enabled.description.fontSize,
      lineHeight: vars.base.enabled.description.lineHeight,
    },
    errorContainer: {
      display: "flex",
      gap: vars.base.enabled.errorContainer.gap,
      alignItems: "center",
    },
    errorMessage: {
      color: vars.base.enabled.errorMessage.color,
      fontWeight: vars.base.enabled.errorMessage.fontWeight,
      fontSize: vars.base.enabled.errorMessage.fontSize,
      lineHeight: vars.base.enabled.errorMessage.lineHeight,
    },
    errorIcon: {
      color: vars.base.enabled.errorIcon.color,

      flex: "none",
      width: vars.base.enabled.errorIcon.size,
      height: vars.base.enabled.errorIcon.size,
    },
    characterCount: {
      color: vars.base.enabled.characterCount.color,
      fontWeight: vars.base.enabled.characterCount.fontWeight,
      fontSize: vars.base.enabled.characterCount.fontSize,
      lineHeight: vars.base.enabled.characterCount.lineHeight,

      [pseudo("[data-empty]", not(invalid))]: {
        // rootage에 스펙 없는 문제 + 스펙인지부터 논의 필요해 보임
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
  defaultVariants: {
    weight: "medium",
  },
  variants: {
    weight: {
      medium: {
        label: {
          fontWeight: vars.weightMedium.enabled.label.fontWeight,
        },
      },
      bold: {
        label: {
          fontWeight: vars.weightBold.enabled.label.fontWeight,
        },
      },
    },
  },
});

export default field;

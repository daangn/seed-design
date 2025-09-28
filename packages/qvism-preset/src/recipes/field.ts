import { field as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";
import { invalid, not, pseudo } from "../utils/pseudo";
import { prefixIcon } from "../utils/icon";

const field = defineSlotRecipe({
  name: "field",
  slots: [
    "root",
    "header",
    "label",
    "indicatorText",
    "indicatorIcon",
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

      overflowX: "auto",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",

      paddingInline: vars.base.enabled.header.paddingX,
      gap: vars.base.enabled.header.gap,
    },
    label: {
      color: vars.base.enabled.label.color,
      fontSize: vars.base.enabled.label.fontSize,
      lineHeight: vars.base.enabled.label.lineHeight,
    },
    indicatorText: {
      display: "inline-block",
      verticalAlign: "bottom",

      paddingInlineStart: vars.base.enabled.indicatorText.paddingLeft,

      color: vars.base.enabled.indicatorText.color,
      fontSize: vars.base.enabled.indicatorText.fontSize,
      lineHeight: vars.base.enabled.indicatorText.lineHeight,
      fontWeight: vars.base.enabled.indicatorText.fontWeight,
    },
    indicatorIcon: {
      display: "inline-block",
      verticalAlign: "top",

      width: vars.base.enabled.indicatorIcon.size,
      height: vars.base.enabled.indicatorIcon.size,

      marginBlockStart: vars.base.enabled.indicatorIcon.paddingTop,
      marginInlineStart: vars.base.enabled.indicatorIcon.paddingLeft,

      color: vars.base.enabled.indicatorIcon.color,
    },
    footer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",

      paddingInline: vars.base.enabled.footer.paddingX,
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

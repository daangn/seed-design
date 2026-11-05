import { field as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";

const field = defineSlotRecipe({
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
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingLeft: vars.base.enabled.header.paddingX,
      paddingRight: vars.base.enabled.header.paddingX,
      gap: vars.base.enabled.header.gap,
    },
    footer: {
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-start",
      paddingLeft: vars.base.enabled.footer.paddingX,
      paddingRight: vars.base.enabled.footer.paddingX,
      gap: vars.base.enabled.footer.gap,
    },
    description: {
      color: vars.base.enabled.description.color,
      fontWeight: vars.base.enabled.description.fontWeight,
      fontSize: vars.base.enabled.description.fontSize,
      lineHeight: vars.base.enabled.description.lineHeight,
    },
    errorMessage: {
      color: vars.base.enabled.errorMessage.color,
      fontWeight: vars.base.enabled.errorMessage.fontWeight,
      fontSize: vars.base.enabled.errorMessage.fontSize,
      lineHeight: vars.base.enabled.errorMessage.lineHeight,
    },
    characterCountArea: {
      display: "flex",
      flexDirection: "row",
      marginLeft: "auto",
    },
    characterCount: {
      color: vars.base.enabled.characterCount.color,
      fontWeight: vars.base.enabled.characterCount.fontWeight,
      fontSize: vars.base.enabled.characterCount.fontSize,
      lineHeight: vars.base.enabled.characterCount.lineHeight,
    },
    maxCharacterCount: {
      color: vars.base.enabled.maxCharacterCount.color,
      fontWeight: vars.base.enabled.maxCharacterCount.fontWeight,
      fontSize: vars.base.enabled.maxCharacterCount.fontSize,
      lineHeight: vars.base.enabled.maxCharacterCount.lineHeight,
    },
  },
  variants: {
    empty: {
      true: {
        characterCount: {
          color: vars.base.enabled.maxCharacterCount.color,
        },
      },
      false: {},
    },
    invalid: {
      true: {
        characterCount: {
          color: vars.base.invalid.characterCount.color,
        },
        maxCharacterCount: {
          color: vars.base.invalid.maxCharacterCount.color,
        },
      },
      false: {},
    },
  },
  defaultVariants: {
    invalid: false,
    empty: false,
  },
});

export default field;

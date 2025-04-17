import { defineSlotRecipe } from "../utils/define";
import { pseudo } from "../utils/pseudo";
import { textField as vars } from "../vars/component";

// TODO: rootage에 formControl을 textField와 분리

const field = defineSlotRecipe({
  name: "field",
  slots: [
    "root",
    "header",
    "label",
    "indicator",
    "footer",
    "description",
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
    header: {},
    label: {
      color: vars.base.enabled.label.color,
      fontWeight: vars.base.enabled.label.fontWeight,
    },
    indicator: {
      color: vars.base.enabled.indicator.color,
      fontWeight: vars.base.enabled.indicator.fontWeight,
    },
    footer: {
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
    },
    description: {
      fontWeight: vars.base.enabled.description.fontWeight,
      color: vars.base.enabled.description.color,
    },
    errorMessage: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",

      color: vars.base.enabled.errorMessage.color,
    },
    errorIcon: {
      flex: "none",
      flexShrink: 0,
    },
    characterCountArea: {
      display: "flex",
      flex: "none",
      marginInlineStart: "auto",
    },
    characterCount: {
      color: vars.base.enabled.characterCount.color,
      fontWeight: vars.base.enabled.characterCount.fontWeight,
      [pseudo("[data-empty]")]: {
        color: vars.base.enabled.maxCharacterCount.color,
      },
    },
    maxCharacterCount: {
      color: vars.base.enabled.maxCharacterCount.color,
      fontWeight: vars.base.enabled.maxCharacterCount.fontWeight,
    },
  },
  defaultVariants: {
    size: "large",
  },
  variants: {
    size: {
      large: {
        header: {
          paddingBottom: vars.sizeLarge.enabled.header.paddingBottom,
          gap: vars.sizeLarge.enabled.header.gap,
        },
        label: {
          fontSize: vars.sizeLarge.enabled.label.fontSize,
          lineHeight: vars.sizeLarge.enabled.label.lineHeight,
        },
        indicator: {
          fontSize: vars.sizeLarge.enabled.indicator.fontSize,
          lineHeight: vars.sizeLarge.enabled.indicator.lineHeight,
        },
        footer: {
          gap: vars.sizeLarge.enabled.footer.gap,
          paddingTop: vars.sizeLarge.enabled.footer.paddingTop,
          minHeight: vars.sizeLarge.enabled.footer.minHeight,
        },
        description: {
          fontSize: vars.sizeLarge.enabled.description.fontSize,
          lineHeight: vars.sizeLarge.enabled.description.lineHeight,
        },
        errorMessage: {
          fontSize: vars.sizeLarge.enabled.errorMessage.fontSize,
          lineHeight: vars.sizeLarge.enabled.errorMessage.lineHeight,
        },
        errorIcon: {
          width: vars.sizeLarge.enabled.errorIcon.size,
          height: vars.sizeLarge.enabled.errorIcon.size,
          marginRight: vars.sizeLarge.enabled.errorIcon.marginRight,
        },
        characterCount: {
          fontSize: vars.sizeLarge.enabled.characterCount.fontSize,
          lineHeight: vars.sizeLarge.enabled.characterCount.lineHeight,
        },
        maxCharacterCount: {
          fontSize: vars.sizeLarge.enabled.maxCharacterCount.fontSize,
          lineHeight: vars.sizeLarge.enabled.maxCharacterCount.lineHeight,
        },
      },
      medium: {
        header: {
          paddingBottom: vars.sizeMedium.enabled.header.paddingBottom,
        },
        label: {
          fontSize: vars.sizeMedium.enabled.label.fontSize,
          lineHeight: vars.sizeMedium.enabled.label.lineHeight,
        },
        indicator: {
          fontSize: vars.sizeMedium.enabled.indicator.fontSize,
          lineHeight: vars.sizeMedium.enabled.indicator.lineHeight,
        },
        footer: {
          gap: vars.sizeMedium.enabled.footer.gap,
          paddingTop: vars.sizeMedium.enabled.footer.paddingTop,
          minHeight: vars.sizeMedium.enabled.footer.minHeight,
        },
        description: {
          fontSize: vars.sizeMedium.enabled.description.fontSize,
          lineHeight: vars.sizeMedium.enabled.description.lineHeight,
        },
        errorMessage: {
          fontSize: vars.sizeMedium.enabled.errorMessage.fontSize,
          lineHeight: vars.sizeMedium.enabled.errorMessage.lineHeight,
        },
        errorIcon: {
          width: vars.sizeMedium.enabled.errorIcon.size,
          height: vars.sizeMedium.enabled.errorIcon.size,
          marginRight: vars.sizeMedium.enabled.errorIcon.marginRight,
        },
        characterCount: {
          fontSize: vars.sizeMedium.enabled.characterCount.fontSize,
          lineHeight: vars.sizeMedium.enabled.characterCount.lineHeight,
        },
        maxCharacterCount: {
          fontSize: vars.sizeMedium.enabled.maxCharacterCount.fontSize,
          lineHeight: vars.sizeMedium.enabled.maxCharacterCount.lineHeight,
        },
      },
    },
  },
});

export default field;

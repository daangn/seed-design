import { inlineBanner as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";
import { pseudo } from "../utils/pseudo";
import { prefixIcon, suffixIcon } from "../utils/icon";

const closeButtonNegativeMargin = `(${vars.base.enabled.suffixIcon.targetSize} - ${vars.base.enabled.suffixIcon.size}) * -0.5`;
const prefixIconVerticalAdjustMargin = `(${vars.base.enabled.root.minHeight} - ${vars.base.enabled.prefixIcon.size}) * 0.5 - ${vars.base.enabled.root.paddingY}`;

/**
 * @deprecated Use `page-banner` instead.
 */
const inlineBanner = defineSlotRecipe({
  name: "inline-banner",
  slots: ["root", "content", "title", "description", "link", "closeButton"],
  base: {
    root: {
      boxSizing: "border-box",
      border: "none",
      fontFamily: "inherit",
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",

      display: "flex",
      alignItems: "flex-start",
      textAlign: "start",
      width: "100%",
      minHeight: vars.base.enabled.root.minHeight,

      paddingInline: vars.base.enabled.root.paddingX,
      paddingBlock: vars.base.enabled.root.paddingY,

      ...prefixIcon({
        size: vars.base.enabled.prefixIcon.size,
        marginRight: vars.base.enabled.prefixIcon.marginRight,
        marginTop: `calc(${prefixIconVerticalAdjustMargin})`,
      }),
      ...suffixIcon({
        size: vars.base.enabled.suffixIcon.size,
        marginLeft: vars.base.enabled.suffixIcon.marginLeft,
        alignSelf: "center",
      }),

      [pseudo(":is(button)")]: {
        cursor: "pointer",
      },
    },
    content: {
      marginInlineEnd: "auto",
    },
    title: {
      flexShrink: 0,

      fontSize: vars.base.enabled.title.fontSize,
      lineHeight: vars.base.enabled.title.lineHeight,
      fontWeight: vars.base.enabled.title.fontWeight,

      [pseudo("::after")]: {
        content: '"  "',
        whiteSpace: "pre",
      },
    },
    description: {
      fontSize: vars.base.enabled.description.fontSize,
      lineHeight: vars.base.enabled.description.lineHeight,
      fontWeight: vars.base.enabled.description.fontWeight,
    },
    link: {
      flexShrink: 0,
      flexGrow: 0,
      fontFamily: "inherit",
      border: "none",
      backgroundColor: "transparent",
      cursor: "pointer",

      display: "flex",
      alignItems: "center",

      // TODO: handle targetHeight
      marginBlock: "auto",
      marginLeft: vars.base.enabled.link.marginLeft,

      fontSize: vars.base.enabled.link.fontSize,
      lineHeight: vars.base.enabled.link.lineHeight,
      fontWeight: vars.base.enabled.link.fontWeight,

      textDecoration: "underline",
      textUnderlineOffset: "2px",
    },
    closeButton: {
      flexShrink: 0,
      flexGrow: 0,

      display: "flex",
      justifyContent: "center",
      alignItems: "center",

      width: vars.base.enabled.suffixIcon.targetSize,
      height: vars.base.enabled.suffixIcon.targetSize,

      margin: `calc(${closeButtonNegativeMargin})`,

      // Consume suffixIcon margin here, and reset suffix icon margin.
      marginLeft: `calc(${closeButtonNegativeMargin} + ${vars.base.enabled.suffixIcon.marginLeft})`,
      "--seed-suffix-icon-margin-left": "initial",

      alignSelf: "center",

      border: "none",
      backgroundColor: "transparent",
      padding: 0,
      cursor: "pointer",
    },
  },
  defaultVariants: {
    variant: "neutralWeak",
  },
  variants: {
    variant: {
      neutralWeak: {
        root: {
          backgroundColor: vars.variantNeutralWeak.enabled.root.color,
          color: vars.variantNeutralWeak.enabled.description.color,

          ...prefixIcon({
            color: vars.variantNeutralWeak.enabled.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.variantNeutralWeak.enabled.suffixIcon.color,
          }),
        },
        title: {
          color: vars.variantNeutralWeak.enabled.title.color,
        },
        description: {
          color: vars.variantNeutralWeak.enabled.description.color,
        },
        link: {
          color: vars.variantNeutralWeak.enabled.link.color,
        },
      },
      positiveWeak: {
        root: {
          backgroundColor: vars.variantPositiveWeak.enabled.root.color,
          color: vars.variantPositiveWeak.enabled.description.color,

          ...prefixIcon({
            color: vars.variantPositiveWeak.enabled.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.variantPositiveWeak.enabled.suffixIcon.color,
          }),
        },
        title: {
          color: vars.variantPositiveWeak.enabled.title.color,
        },
        description: {
          color: vars.variantPositiveWeak.enabled.description.color,
        },
        link: {
          color: vars.variantPositiveWeak.enabled.link.color,
        },
      },
      informativeWeak: {
        root: {
          backgroundColor: vars.variantInformativeWeak.enabled.root.color,
          color: vars.variantInformativeWeak.enabled.description.color,

          ...prefixIcon({
            color: vars.variantInformativeWeak.enabled.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.variantInformativeWeak.enabled.suffixIcon.color,
          }),
        },
        title: {
          color: vars.variantInformativeWeak.enabled.title.color,
        },
        description: {
          color: vars.variantInformativeWeak.enabled.description.color,
        },
        link: {
          color: vars.variantInformativeWeak.enabled.link.color,
        },
      },
      warningWeak: {
        root: {
          backgroundColor: vars.variantWarningWeak.enabled.root.color,
          color: vars.variantWarningWeak.enabled.description.color,

          ...prefixIcon({
            color: vars.variantWarningWeak.enabled.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.variantWarningWeak.enabled.suffixIcon.color,
          }),
        },
        title: {
          color: vars.variantWarningWeak.enabled.title.color,
        },
        description: {
          color: vars.variantWarningWeak.enabled.description.color,
        },
        link: {
          color: vars.variantWarningWeak.enabled.link.color,
        },
      },
      warningSolid: {
        root: {
          backgroundColor: vars.variantWarningSolid.enabled.root.color,
          color: vars.variantWarningSolid.enabled.description.color,

          ...prefixIcon({
            color: vars.variantWarningSolid.enabled.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.variantWarningSolid.enabled.suffixIcon.color,
          }),
        },
        title: {
          color: vars.variantWarningSolid.enabled.title.color,
        },
        description: {
          color: vars.variantWarningSolid.enabled.description.color,
        },
        link: {
          color: vars.variantWarningSolid.enabled.link.color,
        },
      },
      criticalWeak: {
        root: {
          backgroundColor: vars.variantCriticalWeak.enabled.root.color,
          color: vars.variantCriticalWeak.enabled.description.color,

          ...prefixIcon({
            color: vars.variantCriticalWeak.enabled.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.variantCriticalWeak.enabled.suffixIcon.color,
          }),
        },
        title: {
          color: vars.variantCriticalWeak.enabled.title.color,
        },
        description: {
          color: vars.variantCriticalWeak.enabled.description.color,
        },
        link: {
          color: vars.variantCriticalWeak.enabled.link.color,
        },
      },
      criticalSolid: {
        root: {
          backgroundColor: vars.variantCriticalSolid.enabled.root.color,
          color: vars.variantCriticalSolid.enabled.description.color,

          ...prefixIcon({
            color: vars.variantCriticalSolid.enabled.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.variantCriticalSolid.enabled.suffixIcon.color,
          }),
        },
        title: {
          color: vars.variantCriticalSolid.enabled.title.color,
        },
        description: {
          color: vars.variantCriticalSolid.enabled.description.color,
        },
        link: {
          color: vars.variantCriticalSolid.enabled.link.color,
        },
      },
    },
  },
});

export default inlineBanner;

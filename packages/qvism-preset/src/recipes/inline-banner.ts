import { inlineBanner as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";
import { pseudo } from "../utils/pseudo";
import { prefixIcon, suffixIcon } from "../utils/icon";

const closeButtonNegativeMargin = `(${vars.base.rest.suffixIcon.targetSize} - ${vars.base.rest.suffixIcon.size}) * -0.5`;
const prefixIconVerticalAdjustMargin = `(${vars.base.rest.root.minHeight} - ${vars.base.rest.prefixIcon.size}) * 0.5 - ${vars.base.rest.root.paddingY}`;

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
      minHeight: vars.base.rest.root.minHeight,

      paddingInline: vars.base.rest.root.paddingX,
      paddingBlock: vars.base.rest.root.paddingY,

      ...prefixIcon({
        size: vars.base.rest.prefixIcon.size,
        marginRight: vars.base.rest.prefixIcon.marginRight,
        marginTop: `calc(${prefixIconVerticalAdjustMargin})`,
      }),
      ...suffixIcon({
        size: vars.base.rest.suffixIcon.size,
        marginLeft: vars.base.rest.suffixIcon.marginLeft,
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

      fontSize: vars.base.rest.title.fontSize,
      lineHeight: vars.base.rest.title.lineHeight,
      fontWeight: vars.base.rest.title.fontWeight,

      [pseudo("::after")]: {
        content: '"  "',
        whiteSpace: "pre",
      },
    },
    description: {
      fontSize: vars.base.rest.description.fontSize,
      lineHeight: vars.base.rest.description.lineHeight,
      fontWeight: vars.base.rest.description.fontWeight,
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
      marginLeft: vars.base.rest.link.marginLeft,

      fontSize: vars.base.rest.link.fontSize,
      lineHeight: vars.base.rest.link.lineHeight,
      fontWeight: vars.base.rest.link.fontWeight,

      textDecoration: "underline",
      textUnderlineOffset: "2px",
    },
    closeButton: {
      flexShrink: 0,
      flexGrow: 0,

      display: "flex",
      justifyContent: "center",
      alignItems: "center",

      width: vars.base.rest.suffixIcon.targetSize,
      height: vars.base.rest.suffixIcon.targetSize,

      margin: `calc(${closeButtonNegativeMargin})`,

      // Consume suffixIcon margin here, and reset suffix icon margin.
      marginLeft: `calc(${closeButtonNegativeMargin} + ${vars.base.rest.suffixIcon.marginLeft})`,
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
          backgroundColor: vars.variantNeutralWeak.rest.root.color,
          color: vars.variantNeutralWeak.rest.description.color,

          ...prefixIcon({
            color: vars.variantNeutralWeak.rest.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.variantNeutralWeak.rest.suffixIcon.color,
          }),
        },
        title: {
          color: vars.variantNeutralWeak.rest.title.color,
        },
        description: {
          color: vars.variantNeutralWeak.rest.description.color,
        },
        link: {
          color: vars.variantNeutralWeak.rest.link.color,
        },
      },
      positiveWeak: {
        root: {
          backgroundColor: vars.variantPositiveWeak.rest.root.color,
          color: vars.variantPositiveWeak.rest.description.color,

          ...prefixIcon({
            color: vars.variantPositiveWeak.rest.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.variantPositiveWeak.rest.suffixIcon.color,
          }),
        },
        title: {
          color: vars.variantPositiveWeak.rest.title.color,
        },
        description: {
          color: vars.variantPositiveWeak.rest.description.color,
        },
        link: {
          color: vars.variantPositiveWeak.rest.link.color,
        },
      },
      informativeWeak: {
        root: {
          backgroundColor: vars.variantInformativeWeak.rest.root.color,
          color: vars.variantInformativeWeak.rest.description.color,

          ...prefixIcon({
            color: vars.variantInformativeWeak.rest.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.variantInformativeWeak.rest.suffixIcon.color,
          }),
        },
        title: {
          color: vars.variantInformativeWeak.rest.title.color,
        },
        description: {
          color: vars.variantInformativeWeak.rest.description.color,
        },
        link: {
          color: vars.variantInformativeWeak.rest.link.color,
        },
      },
      warningWeak: {
        root: {
          backgroundColor: vars.variantWarningWeak.rest.root.color,
          color: vars.variantWarningWeak.rest.description.color,

          ...prefixIcon({
            color: vars.variantWarningWeak.rest.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.variantWarningWeak.rest.suffixIcon.color,
          }),
        },
        title: {
          color: vars.variantWarningWeak.rest.title.color,
        },
        description: {
          color: vars.variantWarningWeak.rest.description.color,
        },
        link: {
          color: vars.variantWarningWeak.rest.link.color,
        },
      },
      warningSolid: {
        root: {
          backgroundColor: vars.variantWarningSolid.rest.root.color,
          color: vars.variantWarningSolid.rest.description.color,

          ...prefixIcon({
            color: vars.variantWarningSolid.rest.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.variantWarningSolid.rest.suffixIcon.color,
          }),
        },
        title: {
          color: vars.variantWarningSolid.rest.title.color,
        },
        description: {
          color: vars.variantWarningSolid.rest.description.color,
        },
        link: {
          color: vars.variantWarningSolid.rest.link.color,
        },
      },
      criticalWeak: {
        root: {
          backgroundColor: vars.variantCriticalWeak.rest.root.color,
          color: vars.variantCriticalWeak.rest.description.color,

          ...prefixIcon({
            color: vars.variantCriticalWeak.rest.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.variantCriticalWeak.rest.suffixIcon.color,
          }),
        },
        title: {
          color: vars.variantCriticalWeak.rest.title.color,
        },
        description: {
          color: vars.variantCriticalWeak.rest.description.color,
        },
        link: {
          color: vars.variantCriticalWeak.rest.link.color,
        },
      },
      criticalSolid: {
        root: {
          backgroundColor: vars.variantCriticalSolid.rest.root.color,
          color: vars.variantCriticalSolid.rest.description.color,

          ...prefixIcon({
            color: vars.variantCriticalSolid.rest.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.variantCriticalSolid.rest.suffixIcon.color,
          }),
        },
        title: {
          color: vars.variantCriticalSolid.rest.title.color,
        },
        description: {
          color: vars.variantCriticalSolid.rest.description.color,
        },
        link: {
          color: vars.variantCriticalSolid.rest.link.color,
        },
      },
    },
  },
});

export default inlineBanner;

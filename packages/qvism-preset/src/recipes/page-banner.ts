import { pageBanner as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";
import { active, pseudo } from "../utils/pseudo";
import { prefixIcon, suffixIcon } from "../utils/icon";

const closeButtonNegativeMargin = `(${vars.base.enabled.suffixIcon.targetSize} - ${vars.base.enabled.suffixIcon.size}) * -0.5`;
const prefixIconVerticalAdjustMargin = `(${vars.base.enabled.root.minHeight} - ${vars.base.enabled.prefixIcon.size}) * 0.5 - ${vars.base.enabled.root.paddingY}`;
const buttonBleedAmount = `(${vars.base.enabled.button.targetHeight} - ${vars.base.enabled.button.lineHeight}) * 0.5`;

const pageBanner = defineSlotRecipe({
  name: "page-banner",
  slots: ["root", "content", "body", "title", "description", "button", "closeButton"],
  base: {
    root: {
      boxSizing: "border-box",
      border: "none",
      fontFamily: "inherit",
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
      // remove line-height difference on actionable page banners (<button>)
      fontSize: "unset",

      display: "flex",
      alignItems: "flex-start",
      textAlign: "start",
      width: "100%",
      minHeight: vars.base.enabled.root.minHeight,

      paddingLeft: vars.base.enabled.root.paddingX,
      paddingRight: vars.base.enabled.root.paddingX,
      paddingTop: vars.base.enabled.root.paddingY,
      paddingBottom: vars.base.enabled.root.paddingY,

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
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      justifyContent: "space-between",
      flexGrow: 1,

      gap: vars.base.enabled.content.gap,
    },
    body: {
      lineHeight: vars.base.enabled.description.lineHeight,

      flexGrow: 1,
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
    button: {
      fontFamily: "inherit",
      border: "none",
      backgroundColor: "transparent",
      cursor: "pointer",

      display: "flex",
      alignItems: "center",

      margin: `calc(${buttonBleedAmount} * -1)`,
      padding: `calc(${buttonBleedAmount})`,

      fontSize: vars.base.enabled.button.fontSize,
      lineHeight: vars.base.enabled.button.lineHeight,
      fontWeight: vars.base.enabled.button.fontWeight,
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
    tone: "neutral",
    variant: "weak",
  },
  variants: {
    variant: {
      weak: {},
      solid: {},
    },
    tone: {
      neutral: {},
      informative: {},
      positive: {},
      warning: {},
      critical: {},
      magic: {},
    },
  },
  compoundVariants: [
    {
      tone: "neutral",
      variant: "weak",
      css: {
        root: {
          backgroundColor: vars.toneNeutralVariantWeak.enabled.root.color,

          ...prefixIcon({
            color: vars.toneNeutralVariantWeak.enabled.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.toneNeutralVariantWeak.enabled.suffixIcon.color,
          }),

          [pseudo(":is(button)", active)]: {
            backgroundColor: vars.toneNeutralVariantWeak.pressed.root.color,
          },
        },
        title: {
          color: vars.toneNeutralVariantWeak.enabled.title.color,
        },
        description: {
          color: vars.toneNeutralVariantWeak.enabled.description.color,
        },
        button: {
          color: vars.toneNeutralVariantWeak.enabled.button.color,
        },
      },
    },
    {
      tone: "neutral",
      variant: "solid",
      css: {
        root: {
          backgroundColor: vars.toneNeutralVariantSolid.enabled.root.color,

          ...prefixIcon({
            color: vars.toneNeutralVariantSolid.enabled.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.toneNeutralVariantSolid.enabled.suffixIcon.color,
          }),

          [pseudo(":is(button)", active)]: {
            backgroundColor: vars.toneNeutralVariantSolid.pressed.root.color,
          },
        },
        title: {
          color: vars.toneNeutralVariantSolid.enabled.title.color,
        },
        description: {
          color: vars.toneNeutralVariantSolid.enabled.description.color,
        },
        button: {
          color: vars.toneNeutralVariantSolid.enabled.button.color,
        },
      },
    },
    {
      tone: "informative",
      variant: "weak",
      css: {
        root: {
          backgroundColor: vars.toneInformativeVariantWeak.enabled.root.color,

          ...prefixIcon({
            color: vars.toneInformativeVariantWeak.enabled.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.toneInformativeVariantWeak.enabled.suffixIcon.color,
          }),

          [pseudo(":is(button)", active)]: {
            backgroundColor: vars.toneInformativeVariantWeak.pressed.root.color,
          },
        },
        title: {
          color: vars.toneInformativeVariantWeak.enabled.title.color,
        },
        description: {
          color: vars.toneInformativeVariantWeak.enabled.description.color,
        },
        button: {
          color: vars.toneInformativeVariantWeak.enabled.button.color,
        },
      },
    },
    {
      tone: "informative",
      variant: "solid",
      css: {
        root: {
          backgroundColor: vars.toneInformativeVariantSolid.enabled.root.color,

          ...prefixIcon({
            color: vars.toneInformativeVariantSolid.enabled.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.toneInformativeVariantSolid.enabled.suffixIcon.color,
          }),

          [pseudo(":is(button)", active)]: {
            backgroundColor: vars.toneInformativeVariantSolid.pressed.root.color,
          },
        },
        title: {
          color: vars.toneInformativeVariantSolid.enabled.title.color,
        },
        description: {
          color: vars.toneInformativeVariantSolid.enabled.description.color,
        },
        button: {
          color: vars.toneInformativeVariantSolid.enabled.button.color,
        },
      },
    },
    {
      tone: "positive",
      variant: "weak",
      css: {
        root: {
          backgroundColor: vars.tonePositiveVariantWeak.enabled.root.color,

          ...prefixIcon({
            color: vars.tonePositiveVariantWeak.enabled.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.tonePositiveVariantWeak.enabled.suffixIcon.color,
          }),

          [pseudo(":is(button)", active)]: {
            backgroundColor: vars.tonePositiveVariantWeak.pressed.root.color,
          },
        },
        title: {
          color: vars.tonePositiveVariantWeak.enabled.title.color,
        },
        description: {
          color: vars.tonePositiveVariantWeak.enabled.description.color,
        },
        button: {
          color: vars.tonePositiveVariantWeak.enabled.button.color,
        },
      },
    },
    {
      tone: "positive",
      variant: "solid",
      css: {
        root: {
          backgroundColor: vars.tonePositiveVariantSolid.enabled.root.color,

          ...prefixIcon({
            color: vars.tonePositiveVariantSolid.enabled.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.tonePositiveVariantSolid.enabled.suffixIcon.color,
          }),

          [pseudo(":is(button)", active)]: {
            backgroundColor: vars.tonePositiveVariantSolid.pressed.root.color,
          },
        },
        title: {
          color: vars.tonePositiveVariantSolid.enabled.title.color,
        },
        description: {
          color: vars.tonePositiveVariantSolid.enabled.description.color,
        },
        button: {
          color: vars.tonePositiveVariantSolid.enabled.button.color,
        },
      },
    },
    {
      tone: "warning",
      variant: "weak",
      css: {
        root: {
          backgroundColor: vars.toneWarningVariantWeak.enabled.root.color,

          ...prefixIcon({
            color: vars.toneWarningVariantWeak.enabled.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.toneWarningVariantWeak.enabled.suffixIcon.color,
          }),

          [pseudo(":is(button)", active)]: {
            backgroundColor: vars.toneWarningVariantWeak.pressed.root.color,
          },
        },
        title: {
          color: vars.toneWarningVariantWeak.enabled.title.color,
        },
        description: {
          color: vars.toneWarningVariantWeak.enabled.description.color,
        },
        button: {
          color: vars.toneWarningVariantWeak.enabled.button.color,
        },
      },
    },
    {
      tone: "warning",
      variant: "solid",
      css: {
        root: {
          backgroundColor: vars.toneWarningVariantSolid.enabled.root.color,

          ...prefixIcon({
            color: vars.toneWarningVariantSolid.enabled.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.toneWarningVariantSolid.enabled.suffixIcon.color,
          }),

          [pseudo(":is(button)", active)]: {
            backgroundColor: vars.toneWarningVariantSolid.pressed.root.color,
          },
        },
        title: {
          color: vars.toneWarningVariantSolid.enabled.title.color,
        },
        description: {
          color: vars.toneWarningVariantSolid.enabled.description.color,
        },
        button: {
          color: vars.toneWarningVariantSolid.enabled.button.color,
        },
      },
    },
    {
      tone: "critical",
      variant: "weak",
      css: {
        root: {
          backgroundColor: vars.toneCriticalVariantWeak.enabled.root.color,

          ...prefixIcon({
            color: vars.toneCriticalVariantWeak.enabled.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.toneCriticalVariantWeak.enabled.suffixIcon.color,
          }),

          [pseudo(":is(button)", active)]: {
            backgroundColor: vars.toneCriticalVariantWeak.pressed.root.color,
          },
        },
        title: {
          color: vars.toneCriticalVariantWeak.enabled.title.color,
        },
        description: {
          color: vars.toneCriticalVariantWeak.enabled.description.color,
        },
        button: {
          color: vars.toneCriticalVariantWeak.enabled.button.color,
        },
      },
    },
    {
      tone: "critical",
      variant: "solid",
      css: {
        root: {
          backgroundColor: vars.toneCriticalVariantSolid.enabled.root.color,

          ...prefixIcon({
            color: vars.toneCriticalVariantSolid.enabled.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.toneCriticalVariantSolid.enabled.suffixIcon.color,
          }),

          [pseudo(":is(button)", active)]: {
            backgroundColor: vars.toneCriticalVariantSolid.pressed.root.color,
          },
        },
        title: {
          color: vars.toneCriticalVariantSolid.enabled.title.color,
        },
        description: {
          color: vars.toneCriticalVariantSolid.enabled.description.color,
        },
        button: {
          color: vars.toneCriticalVariantSolid.enabled.button.color,
        },
      },
    },
    {
      tone: "magic",
      variant: "weak",
      css: {
        root: {
          backgroundImage: `linear-gradient(88deg, ${vars.toneMagicVariantWeak.enabled.root.gradient})`,

          ...prefixIcon({
            color: vars.toneMagicVariantWeak.enabled.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.toneMagicVariantWeak.enabled.suffixIcon.color,
          }),

          [pseudo(":is(button)", active)]: {
            backgroundImage: `linear-gradient(88deg, ${vars.toneMagicVariantWeak.pressed.root.gradient})`,
          },
        },
        title: {
          color: vars.toneMagicVariantWeak.enabled.title.color,
        },
        description: {
          color: vars.toneMagicVariantWeak.enabled.description.color,
        },
        button: {
          color: vars.toneMagicVariantWeak.enabled.button.color,
        },
      },
    },
  ],
});

export default pageBanner;

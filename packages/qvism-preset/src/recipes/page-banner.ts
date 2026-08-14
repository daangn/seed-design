import spec from "@seed-design/rootage-artifacts/components/page-banner";
import { pageBanner as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";
import { engaged, focusVisible, pseudo } from "../utils/pseudo";
import { prefixIcon, suffixIcon } from "../utils/icon";
import {
  createFocusRingRestStyles,
  createFocusRingStyles,
  FOCUS_RING_TRANSITION,
} from "../utils/focus-ring";
import { vars as tokens } from "../vars";

const closeButtonNegativeMargin = `(${vars.base.rest.suffixIcon.targetSize} - ${vars.base.rest.suffixIcon.size}) * -0.5`;
const prefixIconVerticalAdjustMargin = `(${vars.base.rest.root.minHeight} - ${vars.base.rest.prefixIcon.size}) * 0.5 - ${vars.base.rest.root.paddingY}`;
const buttonBleedAmount = `(${vars.base.rest.button.targetHeight} - ${vars.base.rest.button.lineHeight}) * 0.5`;

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
        transition: FOCUS_RING_TRANSITION,

        ...createFocusRingRestStyles({ position: "inside" }),
        [pseudo(focusVisible)]: createFocusRingStyles({ position: "inside" }),
      },
    },
    content: {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      justifyContent: "space-between",
      flexGrow: 1,

      gap: vars.base.rest.content.gap,
    },
    body: {
      lineHeight: vars.base.rest.description.lineHeight,

      flexGrow: 1,
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
    button: {
      fontFamily: "inherit",
      border: "none",
      backgroundColor: "transparent",
      cursor: "pointer",

      display: "flex",
      alignItems: "center",

      margin: `calc(${buttonBleedAmount} * -1)`,
      padding: `calc(${buttonBleedAmount})`,

      fontSize: vars.base.rest.button.fontSize,
      lineHeight: vars.base.rest.button.lineHeight,
      fontWeight: vars.base.rest.button.fontWeight,

      borderRadius: tokens.$radius.r1,
      transition: FOCUS_RING_TRANSITION,
      ...createFocusRingRestStyles({ position: "inside" }),
      [pseudo(focusVisible)]: createFocusRingStyles({ position: "inside" }),
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

      borderRadius: tokens.$radius.r1,
      transition: FOCUS_RING_TRANSITION,
      ...createFocusRingRestStyles({ position: "inside" }),
      [pseudo(focusVisible)]: createFocusRingStyles({ position: "inside" }),
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
          backgroundColor: vars.toneNeutralVariantWeak.rest.root.color,

          ...prefixIcon({
            color: vars.toneNeutralVariantWeak.rest.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.toneNeutralVariantWeak.rest.suffixIcon.color,
          }),

          [pseudo(":is(button)", engaged)]: {
            backgroundColor: vars.toneNeutralVariantWeak.pressed.root.color,
          },
        },
        title: {
          color: vars.toneNeutralVariantWeak.rest.title.color,
        },
        description: {
          color: vars.toneNeutralVariantWeak.rest.description.color,
        },
        button: {
          color: vars.toneNeutralVariantWeak.rest.button.color,
        },
      },
    },
    {
      tone: "neutral",
      variant: "solid",
      css: {
        root: {
          backgroundColor: vars.toneNeutralVariantSolid.rest.root.color,

          ...prefixIcon({
            color: vars.toneNeutralVariantSolid.rest.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.toneNeutralVariantSolid.rest.suffixIcon.color,
          }),

          [pseudo(":is(button)", engaged)]: {
            backgroundColor: vars.toneNeutralVariantSolid.pressed.root.color,
          },
        },
        title: {
          color: vars.toneNeutralVariantSolid.rest.title.color,
        },
        description: {
          color: vars.toneNeutralVariantSolid.rest.description.color,
        },
        button: {
          color: vars.toneNeutralVariantSolid.rest.button.color,
        },
      },
    },
    {
      tone: "informative",
      variant: "weak",
      css: {
        root: {
          backgroundColor: vars.toneInformativeVariantWeak.rest.root.color,

          ...prefixIcon({
            color: vars.toneInformativeVariantWeak.rest.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.toneInformativeVariantWeak.rest.suffixIcon.color,
          }),

          [pseudo(":is(button)", engaged)]: {
            backgroundColor: vars.toneInformativeVariantWeak.pressed.root.color,
          },
        },
        title: {
          color: vars.toneInformativeVariantWeak.rest.title.color,
        },
        description: {
          color: vars.toneInformativeVariantWeak.rest.description.color,
        },
        button: {
          color: vars.toneInformativeVariantWeak.rest.button.color,
        },
      },
    },
    {
      tone: "informative",
      variant: "solid",
      css: {
        root: {
          backgroundColor: vars.toneInformativeVariantSolid.rest.root.color,

          ...prefixIcon({
            color: vars.toneInformativeVariantSolid.rest.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.toneInformativeVariantSolid.rest.suffixIcon.color,
          }),

          [pseudo(":is(button)", engaged)]: {
            backgroundColor: vars.toneInformativeVariantSolid.pressed.root.color,
          },
        },
        title: {
          color: vars.toneInformativeVariantSolid.rest.title.color,
        },
        description: {
          color: vars.toneInformativeVariantSolid.rest.description.color,
        },
        button: {
          color: vars.toneInformativeVariantSolid.rest.button.color,
        },
      },
    },
    {
      tone: "positive",
      variant: "weak",
      css: {
        root: {
          backgroundColor: vars.tonePositiveVariantWeak.rest.root.color,

          ...prefixIcon({
            color: vars.tonePositiveVariantWeak.rest.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.tonePositiveVariantWeak.rest.suffixIcon.color,
          }),

          [pseudo(":is(button)", engaged)]: {
            backgroundColor: vars.tonePositiveVariantWeak.pressed.root.color,
          },
        },
        title: {
          color: vars.tonePositiveVariantWeak.rest.title.color,
        },
        description: {
          color: vars.tonePositiveVariantWeak.rest.description.color,
        },
        button: {
          color: vars.tonePositiveVariantWeak.rest.button.color,
        },
      },
    },
    {
      tone: "positive",
      variant: "solid",
      css: {
        root: {
          backgroundColor: vars.tonePositiveVariantSolid.rest.root.color,

          ...prefixIcon({
            color: vars.tonePositiveVariantSolid.rest.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.tonePositiveVariantSolid.rest.suffixIcon.color,
          }),

          [pseudo(":is(button)", engaged)]: {
            backgroundColor: vars.tonePositiveVariantSolid.pressed.root.color,
          },
        },
        title: {
          color: vars.tonePositiveVariantSolid.rest.title.color,
        },
        description: {
          color: vars.tonePositiveVariantSolid.rest.description.color,
        },
        button: {
          color: vars.tonePositiveVariantSolid.rest.button.color,
        },
      },
    },
    {
      tone: "warning",
      variant: "weak",
      css: {
        root: {
          backgroundColor: vars.toneWarningVariantWeak.rest.root.color,

          ...prefixIcon({
            color: vars.toneWarningVariantWeak.rest.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.toneWarningVariantWeak.rest.suffixIcon.color,
          }),

          [pseudo(":is(button)", engaged)]: {
            backgroundColor: vars.toneWarningVariantWeak.pressed.root.color,
          },
        },
        title: {
          color: vars.toneWarningVariantWeak.rest.title.color,
        },
        description: {
          color: vars.toneWarningVariantWeak.rest.description.color,
        },
        button: {
          color: vars.toneWarningVariantWeak.rest.button.color,
        },
      },
    },
    {
      tone: "warning",
      variant: "solid",
      css: {
        root: {
          backgroundColor: vars.toneWarningVariantSolid.rest.root.color,

          ...prefixIcon({
            color: vars.toneWarningVariantSolid.rest.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.toneWarningVariantSolid.rest.suffixIcon.color,
          }),

          [pseudo(":is(button)", engaged)]: {
            backgroundColor: vars.toneWarningVariantSolid.pressed.root.color,
          },
        },
        title: {
          color: vars.toneWarningVariantSolid.rest.title.color,
        },
        description: {
          color: vars.toneWarningVariantSolid.rest.description.color,
        },
        button: {
          color: vars.toneWarningVariantSolid.rest.button.color,
        },
      },
    },
    {
      tone: "critical",
      variant: "weak",
      css: {
        root: {
          backgroundColor: vars.toneCriticalVariantWeak.rest.root.color,

          ...prefixIcon({
            color: vars.toneCriticalVariantWeak.rest.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.toneCriticalVariantWeak.rest.suffixIcon.color,
          }),

          [pseudo(":is(button)", engaged)]: {
            backgroundColor: vars.toneCriticalVariantWeak.pressed.root.color,
          },
        },
        title: {
          color: vars.toneCriticalVariantWeak.rest.title.color,
        },
        description: {
          color: vars.toneCriticalVariantWeak.rest.description.color,
        },
        button: {
          color: vars.toneCriticalVariantWeak.rest.button.color,
        },
      },
    },
    {
      tone: "critical",
      variant: "solid",
      css: {
        root: {
          backgroundColor: vars.toneCriticalVariantSolid.rest.root.color,

          ...prefixIcon({
            color: vars.toneCriticalVariantSolid.rest.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.toneCriticalVariantSolid.rest.suffixIcon.color,
          }),

          [pseudo(":is(button)", engaged)]: {
            backgroundColor: vars.toneCriticalVariantSolid.pressed.root.color,
          },
        },
        title: {
          color: vars.toneCriticalVariantSolid.rest.title.color,
        },
        description: {
          color: vars.toneCriticalVariantSolid.rest.description.color,
        },
        button: {
          color: vars.toneCriticalVariantSolid.rest.button.color,
        },
      },
    },
    {
      tone: "magic",
      variant: "weak",
      css: {
        root: {
          backgroundImage: `linear-gradient(88deg, ${vars.toneMagicVariantWeak.rest.root.gradient})`,

          ...prefixIcon({
            color: vars.toneMagicVariantWeak.rest.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.toneMagicVariantWeak.rest.suffixIcon.color,
          }),

          [pseudo(":is(button)", engaged)]: {
            backgroundImage: `linear-gradient(88deg, ${vars.toneMagicVariantWeak.pressed.root.gradient})`,
          },
        },
        title: {
          color: vars.toneMagicVariantWeak.rest.title.color,
        },
        description: {
          color: vars.toneMagicVariantWeak.rest.description.color,
        },
        button: {
          color: vars.toneMagicVariantWeak.rest.button.color,
        },
      },
    },
  ],
  metadata: {
    variants: {
      variant: spec.data.schema.variants.variant,
      tone: spec.data.schema.variants.tone,
    },
  },
});

export default pageBanner;

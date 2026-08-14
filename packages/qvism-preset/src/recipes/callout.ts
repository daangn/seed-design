import { callout as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";
import { engaged, focusVisible, pseudo } from "../utils/pseudo";
import { prefixIcon, suffixIcon } from "../utils/icon";
import {
  createFocusRingRestStyles,
  createFocusRingStyles,
  FOCUS_RING_TRANSITION,
} from "../utils/focus-ring";
import { vars as tokens } from "../vars";
import spec from "@seed-design/rootage-artifacts/components/callout";

const callout = defineSlotRecipe({
  name: "callout",
  slots: ["root", "content", "title", "description", "link", "closeButton"],
  base: {
    root: {
      border: "none",
      boxSizing: "border-box",
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
      fontFamily: "inherit",
      // remove line-height difference on actionable callouts (<button>)
      fontSize: "unset",

      display: "flex",
      alignItems: "center",
      textAlign: "start",

      width: "100%",
      minHeight: vars.base.rest.root.minHeight,

      paddingInline: vars.base.rest.root.paddingX,
      paddingBlock: vars.base.rest.root.paddingY,

      gap: vars.base.rest.root.gap,

      borderRadius: vars.base.rest.root.cornerRadius,

      textDecoration: "none",

      ...prefixIcon({
        size: vars.base.rest.prefixIcon.size,
      }),
      ...suffixIcon({
        size: vars.base.rest.suffixIcon.size,
      }),

      [pseudo(":is(button, a)")]: {
        cursor: "pointer",
        transition: FOCUS_RING_TRANSITION,

        ...createFocusRingRestStyles(),
        [pseudo(focusVisible)]: createFocusRingStyles(),
      },
    },
    content: {
      marginRight: "auto",

      // we define lineHeight here because some reset.css sets default line-height
      // e.g. tailwind preflight sets * { line-height: 1.5 }
      lineHeight: vars.base.rest.description.lineHeight,
    },
    title: {
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

      [pseudo(":not(:last-child)::after")]: {
        content: '"  "',
        whiteSpace: "pre",
      },
    },
    link: {
      fontFamily: "inherit",
      display: "inline-block",
      backgroundColor: "transparent",
      padding: 0,
      border: "none",
      cursor: "pointer",

      fontSize: vars.base.rest.link.fontSize,
      lineHeight: vars.base.rest.link.lineHeight,
      fontWeight: vars.base.rest.link.fontWeight,
      textDecoration: "underline",
      textUnderlineOffset: "2px",

      transition: FOCUS_RING_TRANSITION,
      borderRadius: tokens.$radius.r1,
      ...createFocusRingRestStyles(),
      [pseudo(focusVisible)]: createFocusRingStyles(),
    },
    closeButton: {
      border: "none",
      backgroundColor: "transparent",
      padding: 0,
      cursor: "pointer",

      flexGrow: 0,
      flexShrink: 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",

      width: vars.base.rest.suffixIcon.targetSize,
      height: vars.base.rest.suffixIcon.targetSize,

      margin: `calc((${vars.base.rest.suffixIcon.targetSize} - ${vars.base.rest.suffixIcon.size}) * -0.5)`,

      borderRadius: vars.base.rest.root.cornerRadius,
      transition: FOCUS_RING_TRANSITION,
      ...createFocusRingRestStyles(),
      [pseudo(focusVisible)]: createFocusRingStyles(),
    },
  },
  defaultVariants: {
    tone: "neutral",
  },
  variants: {
    tone: {
      neutral: {
        root: {
          backgroundColor: vars.toneNeutral.rest.root.color,

          ...prefixIcon({
            color: vars.toneNeutral.rest.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.toneNeutral.rest.suffixIcon.color,
          }),

          [pseudo(":is(button, a)", engaged)]: {
            backgroundColor: vars.toneNeutral.pressed.root.color,
          },
        },
        title: {
          color: vars.toneNeutral.rest.title.color,
        },
        description: {
          color: vars.toneNeutral.rest.description.color,
        },
        link: {
          color: vars.toneNeutral.rest.link.color,
        },
      },
      informative: {
        root: {
          backgroundColor: vars.toneInformative.rest.root.color,

          ...prefixIcon({
            color: vars.toneInformative.rest.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.toneInformative.rest.suffixIcon.color,
          }),

          [pseudo(":is(button, a)", engaged)]: {
            backgroundColor: vars.toneInformative.pressed.root.color,
          },
        },
        title: {
          color: vars.toneInformative.rest.title.color,
        },
        description: {
          color: vars.toneInformative.rest.description.color,
        },
        link: {
          color: vars.toneInformative.rest.link.color,
        },
      },
      positive: {
        root: {
          backgroundColor: vars.tonePositive.rest.root.color,

          ...prefixIcon({
            color: vars.tonePositive.rest.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.tonePositive.rest.suffixIcon.color,
          }),

          [pseudo(":is(button, a)", engaged)]: {
            backgroundColor: vars.tonePositive.pressed.root.color,
          },
        },
        title: {
          color: vars.tonePositive.rest.title.color,
        },
        description: {
          color: vars.tonePositive.rest.description.color,
        },
        link: {
          color: vars.tonePositive.rest.link.color,
        },
      },
      warning: {
        root: {
          backgroundColor: vars.toneWarning.rest.root.color,

          ...prefixIcon({
            color: vars.toneWarning.rest.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.toneWarning.rest.suffixIcon.color,
          }),

          [pseudo(":is(button, a)", engaged)]: {
            backgroundColor: vars.toneWarning.pressed.root.color,
          },
        },
        title: {
          color: vars.toneWarning.rest.title.color,
        },
        description: {
          color: vars.toneWarning.rest.description.color,
        },
        link: {
          color: vars.toneWarning.rest.link.color,
        },
      },
      critical: {
        root: {
          backgroundColor: vars.toneCritical.rest.root.color,

          ...prefixIcon({
            color: vars.toneCritical.rest.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.toneCritical.rest.suffixIcon.color,
          }),

          [pseudo(":is(button, a)", engaged)]: {
            backgroundColor: vars.toneCritical.pressed.root.color,
          },
        },
        title: {
          color: vars.toneCritical.rest.title.color,
        },
        description: {
          color: vars.toneCritical.rest.description.color,
        },
        link: {
          color: vars.toneCritical.rest.link.color,
        },
      },
      magic: {
        root: {
          backgroundImage: `linear-gradient(88deg, ${vars.toneMagic.rest.root.gradient})`,

          ...prefixIcon({
            color: vars.toneMagic.rest.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.toneMagic.rest.suffixIcon.color,
          }),

          [pseudo(":is(button, a)", engaged)]: {
            backgroundImage: `linear-gradient(88deg, ${vars.toneMagic.pressed.root.gradient})`,
          },
        },
        title: {
          color: vars.toneMagic.rest.title.color,
        },
        description: {
          color: vars.toneMagic.rest.description.color,
        },
        link: {
          color: vars.toneMagic.rest.link.color,
        },
      },
    },
  },
  metadata: {
    variants: spec.data.schema.variants,
  },
});

export default callout;

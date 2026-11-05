import { calloutCloseButton as closeButtonVars, callout as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";
import { active, engaged, focusVisible, pseudo } from "../utils/pseudo";
import { createScaleFeedbackStyles, FEEDBACK_SCALE_TRANSITION } from "../utils/scale-feedback";
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
      minHeight: vars.base.enabled.root.minHeight,

      paddingInline: vars.base.enabled.root.paddingX,
      paddingBlock: vars.base.enabled.root.paddingY,

      gap: vars.base.enabled.root.gap,

      borderRadius: vars.base.enabled.root.cornerRadius,

      textDecoration: "none",

      ...prefixIcon({
        size: vars.base.enabled.prefixIcon.size,
      }),
      ...suffixIcon({
        size: vars.base.enabled.suffixIcon.size,
      }),

      // An actionable callout scales as a whole — background, stroke and content
      // together — so the focus ring may stay on the root and scale with it.
      [pseudo(":is(button, a)")]: {
        cursor: "pointer",
        transition: `${FEEDBACK_SCALE_TRANSITION}, ${FOCUS_RING_TRANSITION}`,

        [pseudo(active)]: createScaleFeedbackStyles(),

        ...createFocusRingRestStyles(),
        [pseudo(focusVisible)]: createFocusRingStyles(),
      },
    },
    content: {
      marginRight: "auto",

      // we define lineHeight here because some reset.css sets default line-height
      // e.g. tailwind preflight sets * { line-height: 1.5 }
      lineHeight: vars.base.enabled.description.lineHeight,
    },
    title: {
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

      fontSize: vars.base.enabled.link.fontSize,
      lineHeight: vars.base.enabled.link.lineHeight,
      fontWeight: vars.base.enabled.link.fontWeight,
      textDecoration: "underline",
      textUnderlineOffset: "2px",

      transition: FOCUS_RING_TRANSITION,
      borderRadius: tokens.$radius.r1,
      ...createFocusRingRestStyles(),
      [pseudo(focusVisible)]: createFocusRingStyles(),
    },
    closeButton: {
      border: "none",
      backgroundColor: closeButtonVars.base.enabled.root.color,
      padding: 0,
      cursor: "pointer",

      flexGrow: 0,
      flexShrink: 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",

      width: closeButtonVars.base.enabled.root.size,
      height: closeButtonVars.base.enabled.root.size,

      margin: `calc((${closeButtonVars.base.enabled.root.size} - ${closeButtonVars.base.enabled.icon.size}) * -0.5)`,

      borderRadius: closeButtonVars.base.enabled.root.cornerRadius,

      ...suffixIcon({
        size: closeButtonVars.base.enabled.icon.size,
      }),

      [pseudo(active)]: createScaleFeedbackStyles(),

      transition: `background-color ${closeButtonVars.base.enabled.root.colorDuration} ${closeButtonVars.base.enabled.root.colorTimingFunction}, ${FEEDBACK_SCALE_TRANSITION}, ${FOCUS_RING_TRANSITION}`,
      ...createFocusRingRestStyles(),
      [pseudo(focusVisible)]: createFocusRingStyles(),

      [pseudo(engaged)]: {
        backgroundColor: closeButtonVars.base.pressed.root.color,
      },
    },
  },
  defaultVariants: {
    tone: "neutral",
  },
  variants: {
    tone: {
      neutral: {
        root: {
          backgroundColor: vars.toneNeutral.enabled.root.color,

          ...prefixIcon({
            color: vars.toneNeutral.enabled.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.toneNeutral.enabled.suffixIcon.color,
          }),

          [pseudo(":is(button, a)", engaged)]: {
            backgroundColor: vars.toneNeutral.pressed.root.color,
          },
        },
        title: {
          color: vars.toneNeutral.enabled.title.color,
        },
        description: {
          color: vars.toneNeutral.enabled.description.color,
        },
        link: {
          color: vars.toneNeutral.enabled.link.color,
        },
        closeButton: suffixIcon({
          color: closeButtonVars.toneNeutral.enabled.icon.color,
        }),
      },
      informative: {
        root: {
          backgroundColor: vars.toneInformative.enabled.root.color,

          ...prefixIcon({
            color: vars.toneInformative.enabled.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.toneInformative.enabled.suffixIcon.color,
          }),

          [pseudo(":is(button, a)", engaged)]: {
            backgroundColor: vars.toneInformative.pressed.root.color,
          },
        },
        title: {
          color: vars.toneInformative.enabled.title.color,
        },
        description: {
          color: vars.toneInformative.enabled.description.color,
        },
        link: {
          color: vars.toneInformative.enabled.link.color,
        },
        closeButton: suffixIcon({
          color: closeButtonVars.toneInformative.enabled.icon.color,
        }),
      },
      positive: {
        root: {
          backgroundColor: vars.tonePositive.enabled.root.color,

          ...prefixIcon({
            color: vars.tonePositive.enabled.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.tonePositive.enabled.suffixIcon.color,
          }),

          [pseudo(":is(button, a)", engaged)]: {
            backgroundColor: vars.tonePositive.pressed.root.color,
          },
        },
        title: {
          color: vars.tonePositive.enabled.title.color,
        },
        description: {
          color: vars.tonePositive.enabled.description.color,
        },
        link: {
          color: vars.tonePositive.enabled.link.color,
        },
        closeButton: suffixIcon({
          color: closeButtonVars.tonePositive.enabled.icon.color,
        }),
      },
      warning: {
        root: {
          backgroundColor: vars.toneWarning.enabled.root.color,

          ...prefixIcon({
            color: vars.toneWarning.enabled.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.toneWarning.enabled.suffixIcon.color,
          }),

          [pseudo(":is(button, a)", engaged)]: {
            backgroundColor: vars.toneWarning.pressed.root.color,
          },
        },
        title: {
          color: vars.toneWarning.enabled.title.color,
        },
        description: {
          color: vars.toneWarning.enabled.description.color,
        },
        link: {
          color: vars.toneWarning.enabled.link.color,
        },
        closeButton: suffixIcon({
          color: closeButtonVars.toneWarning.enabled.icon.color,
        }),
      },
      critical: {
        root: {
          backgroundColor: vars.toneCritical.enabled.root.color,

          ...prefixIcon({
            color: vars.toneCritical.enabled.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.toneCritical.enabled.suffixIcon.color,
          }),

          [pseudo(":is(button, a)", engaged)]: {
            backgroundColor: vars.toneCritical.pressed.root.color,
          },
        },
        title: {
          color: vars.toneCritical.enabled.title.color,
        },
        description: {
          color: vars.toneCritical.enabled.description.color,
        },
        link: {
          color: vars.toneCritical.enabled.link.color,
        },
        closeButton: suffixIcon({
          color: closeButtonVars.toneCritical.enabled.icon.color,
        }),
      },
      magic: {
        root: {
          backgroundImage: `linear-gradient(88deg, ${vars.toneMagic.enabled.root.gradient.serialized})`,

          ...prefixIcon({
            color: vars.toneMagic.enabled.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.toneMagic.enabled.suffixIcon.color,
          }),

          [pseudo(":is(button, a)", engaged)]: {
            backgroundImage: `linear-gradient(88deg, ${vars.toneMagic.pressed.root.gradient.serialized})`,
          },
        },
        title: {
          color: vars.toneMagic.enabled.title.color,
        },
        description: {
          color: vars.toneMagic.enabled.description.color,
        },
        link: {
          color: vars.toneMagic.enabled.link.color,
        },
        closeButton: suffixIcon({
          color: closeButtonVars.toneMagic.enabled.icon.color,
        }),
      },
    },
  },
  metadata: {
    variants: spec.data.schema.variants,
  },
});

export default callout;

import { callout as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";
import { active, engaged, focusVisible, pseudo } from "../utils/pseudo";
import {
  createPressScaleCounterRestStyles,
  createPressScaleCounterStyles,
  createPressScaleRestStyles,
  createPressScaleStyles,
  PRESS_SCALE_TRANSITION,
} from "../utils/press-scale";
import { prefixIcon, suffixIcon } from "../utils/icon";
import {
  createFocusRingRestStyles,
  createFocusRingStyles,
  FOCUS_RING_TRANSITION,
} from "../utils/focus-ring";
import { vars as tokens } from "../vars";
import spec from "@seed-design/rootage-artifacts/components/callout.json" with { type: "json" };

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

      position: "relative",

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

      // An actionable callout scales as a whole on press, so the background sits
      // on a pseudo that cancels that scale: the card keeps its size while the
      // icon and text shrink together. The tone variants paint this layer — a
      // plain callout gets the same background, it just never scales.
      //
      // `isolation` and not a scale-induced stacking context: only the actionable
      // root scales, and a `z-index: -1` pseudo with no stacking context above it
      // paints behind the parent's own background instead of behind the content.
      isolation: "isolate",

      "&::before": {
        content: '""',
        position: "absolute",
        inset: 0,
        zIndex: -1,
        borderRadius: "inherit",

        transition: PRESS_SCALE_TRANSITION,
        ...createPressScaleCounterRestStyles(),
      },

      // The focus ring rides the counter-scale on a layer of its own: an `outline`
      // is painted with the box it sits on, so left on the root it would shrink
      // with the content and detach inward from the fixed background.
      "&::after": {
        content: '""',
        position: "absolute",
        inset: 0,
        borderRadius: "inherit",
        pointerEvents: "none",

        transition: `${PRESS_SCALE_TRANSITION}, ${FOCUS_RING_TRANSITION}`,
        ...createPressScaleCounterRestStyles(),
        ...createFocusRingRestStyles(),
      },

      ...prefixIcon({
        size: vars.base.enabled.prefixIcon.size,
      }),
      ...suffixIcon({
        size: vars.base.enabled.suffixIcon.size,
      }),

      [pseudo(":is(button, a)")]: {
        cursor: "pointer",
        transition: PRESS_SCALE_TRANSITION,

        ...createPressScaleRestStyles(),
      },

      [pseudo(":is(button, a)", active)]: createPressScaleStyles(),
      [pseudo(":is(button, a)", active, "::before")]: createPressScaleCounterStyles(),
      [pseudo(":is(button, a)", active, "::after")]: createPressScaleCounterStyles(),

      [pseudo(":is(button, a)", focusVisible, "::after")]: createFocusRingStyles(),
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
      backgroundColor: "transparent",
      padding: 0,
      cursor: "pointer",

      flexGrow: 0,
      flexShrink: 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",

      width: vars.base.enabled.suffixIcon.targetSize,
      height: vars.base.enabled.suffixIcon.targetSize,

      margin: `calc((${vars.base.enabled.suffixIcon.targetSize} - ${vars.base.enabled.suffixIcon.size}) * -0.5)`,

      borderRadius: vars.base.enabled.root.cornerRadius,

      // The button itself is transparent, so scaling the whole button scales only
      // its content (the icon).
      ...createPressScaleRestStyles(),
      [pseudo(active)]: { ...createPressScaleStyles() },

      transition: `${PRESS_SCALE_TRANSITION}, ${FOCUS_RING_TRANSITION}`,
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
          "&::before": {
            backgroundColor: vars.toneNeutral.enabled.root.color,
          },

          ...prefixIcon({
            color: vars.toneNeutral.enabled.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.toneNeutral.enabled.suffixIcon.color,
          }),

          [pseudo(":is(button, a)", engaged, "::before")]: {
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
      },
      informative: {
        root: {
          "&::before": {
            backgroundColor: vars.toneInformative.enabled.root.color,
          },

          ...prefixIcon({
            color: vars.toneInformative.enabled.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.toneInformative.enabled.suffixIcon.color,
          }),

          [pseudo(":is(button, a)", engaged, "::before")]: {
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
      },
      positive: {
        root: {
          "&::before": {
            backgroundColor: vars.tonePositive.enabled.root.color,
          },

          ...prefixIcon({
            color: vars.tonePositive.enabled.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.tonePositive.enabled.suffixIcon.color,
          }),

          [pseudo(":is(button, a)", engaged, "::before")]: {
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
      },
      warning: {
        root: {
          "&::before": {
            backgroundColor: vars.toneWarning.enabled.root.color,
          },

          ...prefixIcon({
            color: vars.toneWarning.enabled.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.toneWarning.enabled.suffixIcon.color,
          }),

          [pseudo(":is(button, a)", engaged, "::before")]: {
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
      },
      critical: {
        root: {
          "&::before": {
            backgroundColor: vars.toneCritical.enabled.root.color,
          },

          ...prefixIcon({
            color: vars.toneCritical.enabled.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.toneCritical.enabled.suffixIcon.color,
          }),

          [pseudo(":is(button, a)", engaged, "::before")]: {
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
      },
      magic: {
        root: {
          "&::before": {
            backgroundImage: `linear-gradient(88deg, ${vars.toneMagic.enabled.root.gradient})`,
          },

          ...prefixIcon({
            color: vars.toneMagic.enabled.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.toneMagic.enabled.suffixIcon.color,
          }),

          [pseudo(":is(button, a)", engaged, "::before")]: {
            backgroundImage: `linear-gradient(88deg, ${vars.toneMagic.pressed.root.gradient})`,
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
      },
    },
  },
  metadata: {
    variants: spec.data.schema.variants,
  },
});

export default callout;

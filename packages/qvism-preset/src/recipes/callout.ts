import { callout as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";
import { active, pseudo } from "../utils/pseudo";
import { prefixIcon, suffixIcon } from "../utils/icon";

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

      paddingLeft: vars.base.enabled.root.paddingX,
      paddingRight: vars.base.enabled.root.paddingX,
      paddingTop: vars.base.enabled.root.paddingY,
      paddingBottom: vars.base.enabled.root.paddingY,

      gap: vars.base.enabled.root.gap,

      borderRadius: vars.base.enabled.root.cornerRadius,

      textDecoration: "none",

      ...prefixIcon({
        size: vars.base.enabled.prefixIcon.size,
      }),
      ...suffixIcon({
        size: vars.base.enabled.suffixIcon.size,
      }),

      [pseudo(":is(button, a)")]: {
        cursor: "pointer",
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

          [pseudo(":is(button, a)", active)]: {
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
          backgroundColor: vars.toneInformative.enabled.root.color,

          ...prefixIcon({
            color: vars.toneInformative.enabled.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.toneInformative.enabled.suffixIcon.color,
          }),

          [pseudo(":is(button, a)", active)]: {
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
          backgroundColor: vars.tonePositive.enabled.root.color,

          ...prefixIcon({
            color: vars.tonePositive.enabled.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.tonePositive.enabled.suffixIcon.color,
          }),

          [pseudo(":is(button, a)", active)]: {
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
          backgroundColor: vars.toneWarning.enabled.root.color,

          ...prefixIcon({
            color: vars.toneWarning.enabled.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.toneWarning.enabled.suffixIcon.color,
          }),

          [pseudo(":is(button, a)", active)]: {
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
          backgroundColor: vars.toneCritical.enabled.root.color,

          ...prefixIcon({
            color: vars.toneCritical.enabled.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.toneCritical.enabled.suffixIcon.color,
          }),

          [pseudo(":is(button, a)", active)]: {
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
          backgroundImage: `linear-gradient(88deg, ${vars.toneMagic.enabled.root.gradient})`,

          ...prefixIcon({
            color: vars.toneMagic.enabled.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.toneMagic.enabled.suffixIcon.color,
          }),

          [pseudo(":is(button, a)", active)]: {
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
});

export default callout;

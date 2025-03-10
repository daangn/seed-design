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

      display: "flex",
      alignItems: "center",
      textAlign: "start",

      width: "100%",
      minHeight: vars.base.enabled.root.minHeight,

      paddingInline: vars.base.enabled.root.paddingX,
      paddingBlock: vars.base.enabled.root.paddingY,
      gap: vars.base.enabled.root.gap,

      borderRadius: vars.base.enabled.root.cornerRadius,

      ...prefixIcon({
        size: vars.base.enabled.prefixIcon.size,
      }),
      ...suffixIcon({
        size: vars.base.enabled.suffixIcon.size,
      }),

      [pseudo(":is(button)")]: {
        cursor: "pointer",
      },
    },
    content: {
      display: "inline-flex",
      marginInlineEnd: "auto",
    },
    title: {
      fontSize: vars.base.enabled.title.fontSize,
      lineHeight: vars.base.enabled.title.lineHeight,
      fontWeight: vars.base.enabled.title.fontWeight,
      marginInlineEnd: "1ch",
    },
    description: {
      fontSize: vars.base.enabled.description.fontSize,
      lineHeight: vars.base.enabled.description.lineHeight,
      fontWeight: vars.base.enabled.description.fontWeight,
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

      marginInlineStart: "1ch",
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

          [pseudo(":is(button)", active)]: {
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

          [pseudo(":is(button)", active)]: {
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
      warning: {
        root: {
          backgroundColor: vars.toneWarning.enabled.root.color,

          ...prefixIcon({
            color: vars.toneWarning.enabled.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.toneWarning.enabled.suffixIcon.color,
          }),

          [pseudo(":is(button)", active)]: {
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

          [pseudo(":is(button)", active)]: {
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
          backgroundColor: vars.toneMagic.enabled.root.color,

          ...prefixIcon({
            color: vars.toneMagic.enabled.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.toneMagic.enabled.suffixIcon.color,
          }),

          [pseudo(":is(button)", active)]: {
            backgroundColor: vars.toneMagic.pressed.root.color,
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

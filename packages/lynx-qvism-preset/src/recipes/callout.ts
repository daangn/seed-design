import { calloutCloseButton as closeButtonVars, callout as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";

const callout = defineSlotRecipe({
  name: "callout",
  slots: [
    "root",
    "content",
    "title",
    "description",
    "link",
    "closeButton",
    "prefixIcon",
    "suffixIcon",
  ],
  base: {
    root: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
      minHeight: vars.base.enabled.root.minHeight,
      paddingLeft: vars.base.enabled.root.paddingX,
      paddingRight: vars.base.enabled.root.paddingX,
      paddingTop: vars.base.enabled.root.paddingY,
      paddingBottom: vars.base.enabled.root.paddingY,
      gap: vars.base.enabled.root.gap,
      borderRadius: vars.base.enabled.root.cornerRadius,
    },
    content: {
      flexGrow: 1,
      flexShrink: 1,
      lineHeight: vars.base.enabled.description.lineHeight,
    },
    title: {
      fontSize: vars.base.enabled.title.fontSize,
      lineHeight: vars.base.enabled.title.lineHeight,
      fontWeight: vars.base.enabled.title.fontWeight,
    },
    description: {
      fontSize: vars.base.enabled.description.fontSize,
      lineHeight: vars.base.enabled.description.lineHeight,
      fontWeight: vars.base.enabled.description.fontWeight,
    },
    link: {
      fontSize: vars.base.enabled.link.fontSize,
      lineHeight: vars.base.enabled.link.lineHeight,
      fontWeight: vars.base.enabled.link.fontWeight,
      borderBottomWidth: "1px",
      borderBottomStyle: "solid",
    },
    closeButton: {
      flexGrow: 0,
      flexShrink: 0,
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      width: closeButtonVars.base.enabled.root.size,
      height: closeButtonVars.base.enabled.root.size,
      marginTop: `calc((${closeButtonVars.base.enabled.root.size} - ${closeButtonVars.base.enabled.icon.size}) * -0.5)`,
      marginRight: `calc((${closeButtonVars.base.enabled.root.size} - ${closeButtonVars.base.enabled.icon.size}) * -0.5)`,
      marginBottom: `calc((${closeButtonVars.base.enabled.root.size} - ${closeButtonVars.base.enabled.icon.size}) * -0.5)`,
      marginLeft: `calc((${closeButtonVars.base.enabled.root.size} - ${closeButtonVars.base.enabled.icon.size}) * -0.5)`,
      borderRadius: closeButtonVars.base.enabled.root.cornerRadius,
    },
    prefixIcon: {
      flexShrink: 0,
      width: vars.base.enabled.prefixIcon.size,
      height: vars.base.enabled.prefixIcon.size,
    },
    suffixIcon: {
      flexShrink: 0,
      width: vars.base.enabled.suffixIcon.size,
      height: vars.base.enabled.suffixIcon.size,
    },
  },
  variants: {
    tone: {
      neutral: {
        root: { backgroundColor: vars.toneNeutral.enabled.root.color },
        title: { color: vars.toneNeutral.enabled.title.color },
        description: { color: vars.toneNeutral.enabled.description.color },
        link: {
          color: vars.toneNeutral.enabled.link.color,
          borderBottomColor: vars.toneNeutral.enabled.link.color,
        },
        prefixIcon: { color: vars.toneNeutral.enabled.prefixIcon.color },
        suffixIcon: { color: vars.toneNeutral.enabled.suffixIcon.color },
      },
      informative: {
        root: { backgroundColor: vars.toneInformative.enabled.root.color },
        title: { color: vars.toneInformative.enabled.title.color },
        description: { color: vars.toneInformative.enabled.description.color },
        link: {
          color: vars.toneInformative.enabled.link.color,
          borderBottomColor: vars.toneInformative.enabled.link.color,
        },
        prefixIcon: { color: vars.toneInformative.enabled.prefixIcon.color },
        suffixIcon: { color: vars.toneInformative.enabled.suffixIcon.color },
      },
      positive: {
        root: { backgroundColor: vars.tonePositive.enabled.root.color },
        title: { color: vars.tonePositive.enabled.title.color },
        description: { color: vars.tonePositive.enabled.description.color },
        link: {
          color: vars.tonePositive.enabled.link.color,
          borderBottomColor: vars.tonePositive.enabled.link.color,
        },
        prefixIcon: { color: vars.tonePositive.enabled.prefixIcon.color },
        suffixIcon: { color: vars.tonePositive.enabled.suffixIcon.color },
      },
      warning: {
        root: { backgroundColor: vars.toneWarning.enabled.root.color },
        title: { color: vars.toneWarning.enabled.title.color },
        description: { color: vars.toneWarning.enabled.description.color },
        link: {
          color: vars.toneWarning.enabled.link.color,
          borderBottomColor: vars.toneWarning.enabled.link.color,
        },
        prefixIcon: { color: vars.toneWarning.enabled.prefixIcon.color },
        suffixIcon: { color: vars.toneWarning.enabled.suffixIcon.color },
      },
      critical: {
        root: { backgroundColor: vars.toneCritical.enabled.root.color },
        title: { color: vars.toneCritical.enabled.title.color },
        description: { color: vars.toneCritical.enabled.description.color },
        link: {
          color: vars.toneCritical.enabled.link.color,
          borderBottomColor: vars.toneCritical.enabled.link.color,
        },
        prefixIcon: { color: vars.toneCritical.enabled.prefixIcon.color },
        suffixIcon: { color: vars.toneCritical.enabled.suffixIcon.color },
      },
      magic: {
        root: {
          backgroundImage: `linear-gradient(88deg, ${vars.toneMagic.enabled.root.gradient.serialized})`,
        },
        title: { color: vars.toneMagic.enabled.title.color },
        description: { color: vars.toneMagic.enabled.description.color },
        link: {
          color: vars.toneMagic.enabled.link.color,
          borderBottomColor: vars.toneMagic.enabled.link.color,
        },
        prefixIcon: { color: vars.toneMagic.enabled.prefixIcon.color },
        suffixIcon: { color: vars.toneMagic.enabled.suffixIcon.color },
      },
    },
    pressed: {
      true: {},
      false: {},
    },
  },
  compoundVariants: [
    {
      tone: "neutral",
      pressed: true,
      css: { root: { backgroundColor: vars.toneNeutral.pressed.root.color } },
    },
    {
      tone: "informative",
      pressed: true,
      css: { root: { backgroundColor: vars.toneInformative.pressed.root.color } },
    },
    {
      tone: "positive",
      pressed: true,
      css: { root: { backgroundColor: vars.tonePositive.pressed.root.color } },
    },
    {
      tone: "warning",
      pressed: true,
      css: { root: { backgroundColor: vars.toneWarning.pressed.root.color } },
    },
    {
      tone: "critical",
      pressed: true,
      css: { root: { backgroundColor: vars.toneCritical.pressed.root.color } },
    },
    {
      tone: "magic",
      pressed: true,
      css: {
        root: {
          backgroundImage: `linear-gradient(88deg, ${vars.toneMagic.pressed.root.gradient.serialized})`,
        },
      },
    },
  ],
  defaultVariants: {
    tone: "neutral",
    pressed: false,
  },
});

export default callout;

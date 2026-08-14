import { badge as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";

const badge = defineSlotRecipe({
  name: "badge",
  slots: ["root", "label"],
  base: {
    root: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      flexShrink: 0,
      textAlign: "start",
    },
    label: {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      flexShrink: 1,
      maxWidth: "100%",
    },
  },
  variants: {
    size: {
      medium: {
        root: {
          maxWidth: vars.sizeMedium.rest.root.maxWidth,
          minHeight: vars.sizeMedium.rest.root.minHeight,
          paddingLeft: vars.sizeMedium.rest.root.paddingX,
          paddingRight: vars.sizeMedium.rest.root.paddingX,
          paddingTop: vars.sizeMedium.rest.root.paddingY,
          paddingBottom: vars.sizeMedium.rest.root.paddingY,
          borderRadius: vars.sizeMedium.rest.root.cornerRadius,
        },
        label: {
          fontSize: vars.sizeMedium.rest.label.fontSize,
          lineHeight: vars.sizeMedium.rest.label.lineHeight,
        },
      },
      large: {
        root: {
          maxWidth: vars.sizeLarge.rest.root.maxWidth,
          minHeight: vars.sizeLarge.rest.root.minHeight,
          paddingLeft: vars.sizeLarge.rest.root.paddingX,
          paddingRight: vars.sizeLarge.rest.root.paddingX,
          paddingTop: vars.sizeLarge.rest.root.paddingY,
          paddingBottom: vars.sizeLarge.rest.root.paddingY,
          borderRadius: vars.sizeLarge.rest.root.cornerRadius,
        },
        label: {
          fontSize: vars.sizeLarge.rest.label.fontSize,
          lineHeight: vars.sizeLarge.rest.label.lineHeight,
        },
      },
    },
    variant: {
      weak: {
        label: {
          fontWeight: vars.variantWeak.rest.label.fontWeight,
        },
      },
      solid: {
        label: {
          fontWeight: vars.variantSolid.rest.label.fontWeight,
        },
      },
      outline: {
        label: {
          fontWeight: vars.variantOutline.rest.label.fontWeight,
        },
      },
    },
    tone: {
      neutral: {},
      brand: {},
      informative: {},
      positive: {},
      warning: {},
      critical: {},
    },
  },
  compoundVariants: [
    {
      tone: "neutral",
      variant: "weak",
      css: {
        root: { backgroundColor: vars.variantWeakToneNeutral.rest.root.color },
        label: { color: vars.variantWeakToneNeutral.rest.label.color },
      },
    },
    {
      tone: "neutral",
      variant: "solid",
      css: {
        root: { backgroundColor: vars.variantSolidToneNeutral.rest.root.color },
        label: { color: vars.variantSolidToneNeutral.rest.label.color },
      },
    },
    {
      tone: "neutral",
      variant: "outline",
      css: {
        root: {
          boxShadow: `inset 0 0 0 ${vars.variantOutline.rest.root.strokeWidth} ${vars.variantOutlineToneNeutral.rest.root.strokeColor}`,
        },
        label: { color: vars.variantOutlineToneNeutral.rest.label.color },
      },
    },
    {
      tone: "brand",
      variant: "weak",
      css: {
        root: { backgroundColor: vars.variantWeakToneBrand.rest.root.color },
        label: { color: vars.variantWeakToneBrand.rest.label.color },
      },
    },
    {
      tone: "brand",
      variant: "solid",
      css: {
        root: { backgroundColor: vars.variantSolidToneBrand.rest.root.color },
        label: { color: vars.variantSolidToneBrand.rest.label.color },
      },
    },
    {
      tone: "brand",
      variant: "outline",
      css: {
        root: {
          boxShadow: `inset 0 0 0 ${vars.variantOutline.rest.root.strokeWidth} ${vars.variantOutlineToneBrand.rest.root.strokeColor}`,
        },
        label: { color: vars.variantOutlineToneBrand.rest.label.color },
      },
    },
    {
      tone: "informative",
      variant: "weak",
      css: {
        root: { backgroundColor: vars.variantWeakToneInformative.rest.root.color },
        label: { color: vars.variantWeakToneInformative.rest.label.color },
      },
    },
    {
      tone: "informative",
      variant: "solid",
      css: {
        root: { backgroundColor: vars.variantSolidToneInformative.rest.root.color },
        label: { color: vars.variantSolidToneInformative.rest.label.color },
      },
    },
    {
      tone: "informative",
      variant: "outline",
      css: {
        root: {
          boxShadow: `inset 0 0 0 ${vars.variantOutline.rest.root.strokeWidth} ${vars.variantOutlineToneInformative.rest.root.strokeColor}`,
        },
        label: { color: vars.variantOutlineToneInformative.rest.label.color },
      },
    },
    {
      tone: "positive",
      variant: "weak",
      css: {
        root: { backgroundColor: vars.variantWeakTonePositive.rest.root.color },
        label: { color: vars.variantWeakTonePositive.rest.label.color },
      },
    },
    {
      tone: "positive",
      variant: "solid",
      css: {
        root: { backgroundColor: vars.variantSolidTonePositive.rest.root.color },
        label: { color: vars.variantSolidTonePositive.rest.label.color },
      },
    },
    {
      tone: "positive",
      variant: "outline",
      css: {
        root: {
          boxShadow: `inset 0 0 0 ${vars.variantOutline.rest.root.strokeWidth} ${vars.variantOutlineTonePositive.rest.root.strokeColor}`,
        },
        label: { color: vars.variantOutlineTonePositive.rest.label.color },
      },
    },
    {
      tone: "warning",
      variant: "weak",
      css: {
        root: { backgroundColor: vars.variantWeakToneWarning.rest.root.color },
        label: { color: vars.variantWeakToneWarning.rest.label.color },
      },
    },
    {
      tone: "warning",
      variant: "solid",
      css: {
        root: { backgroundColor: vars.variantSolidToneWarning.rest.root.color },
        label: { color: vars.variantSolidToneWarning.rest.label.color },
      },
    },
    {
      tone: "warning",
      variant: "outline",
      css: {
        root: {
          boxShadow: `inset 0 0 0 ${vars.variantOutline.rest.root.strokeWidth} ${vars.variantOutlineToneWarning.rest.root.strokeColor}`,
        },
        label: { color: vars.variantOutlineToneWarning.rest.label.color },
      },
    },
    {
      tone: "critical",
      variant: "weak",
      css: {
        root: { backgroundColor: vars.variantWeakToneCritical.rest.root.color },
        label: { color: vars.variantWeakToneCritical.rest.label.color },
      },
    },
    {
      tone: "critical",
      variant: "solid",
      css: {
        root: { backgroundColor: vars.variantSolidToneCritical.rest.root.color },
        label: { color: vars.variantSolidToneCritical.rest.label.color },
      },
    },
    {
      tone: "critical",
      variant: "outline",
      css: {
        root: {
          boxShadow: `inset 0 0 0 ${vars.variantOutline.rest.root.strokeWidth} ${vars.variantOutlineToneCritical.rest.root.strokeColor}`,
        },
        label: { color: vars.variantOutlineToneCritical.rest.label.color },
      },
    },
  ],
  defaultVariants: {
    size: "medium",
    variant: "solid",
    tone: "neutral",
  },
});

export default badge;

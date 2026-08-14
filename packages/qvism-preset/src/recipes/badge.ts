import spec from "@seed-design/rootage-artifacts/components/badge";
import { badge as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";

const badge = defineSlotRecipe({
  name: "badge",
  slots: ["root", "label"],
  base: {
    root: {
      display: "inline-flex",
      boxSizing: "border-box",
      alignItems: "center",

      textTransform: "none",
      textAlign: "start",
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
      textDecoration: "none",
    },
    label: {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
  },
  variants: {
    size: {
      medium: {
        root: {
          // TODO: have some better way to derive `--seed-font-size-limit-min/max` and `108px`
          // NOTE: when updating vars.sizeMedium.rest.root.maxWidth, update 108px accordingly
          maxWidth: `clamp(calc(108px * var(--seed-font-size-limit-min)), ${vars.sizeMedium.rest.root.maxWidth}, calc(108px * var(--seed-font-size-limit-max)))`,
          minHeight: vars.sizeMedium.rest.root.minHeight,
          paddingInline: vars.sizeMedium.rest.root.paddingX,
          paddingBlock: vars.sizeMedium.rest.root.paddingY,
          borderRadius: vars.sizeMedium.rest.root.cornerRadius,

          fontSize: vars.sizeMedium.rest.label.fontSize,
          lineHeight: vars.sizeMedium.rest.label.lineHeight,
        },
      },
      large: {
        root: {
          // TODO: have some better way to derive `--seed-font-size-limit-min/max` and `120px`
          // NOTE: when updating vars.sizeLarge.rest.root.maxWidth, update 120px accordingly
          maxWidth: `clamp(calc(120px * var(--seed-font-size-limit-min)), ${vars.sizeLarge.rest.root.maxWidth}, calc(120px * var(--seed-font-size-limit-max)))`,
          minHeight: vars.sizeLarge.rest.root.minHeight,
          paddingInline: vars.sizeLarge.rest.root.paddingX,
          paddingBlock: vars.sizeLarge.rest.root.paddingY,
          borderRadius: vars.sizeLarge.rest.root.cornerRadius,

          fontSize: vars.sizeLarge.rest.label.fontSize,
          lineHeight: vars.sizeLarge.rest.label.lineHeight,
        },
      },
    },
    variant: {
      weak: {
        root: {
          fontWeight: vars.variantWeak.rest.label.fontWeight,
        },
      },
      solid: {
        root: {
          fontWeight: vars.variantSolid.rest.label.fontWeight,
        },
      },
      outline: {
        root: {
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
        root: {
          backgroundColor: vars.variantWeakToneNeutral.rest.root.color,
          color: vars.variantWeakToneNeutral.rest.label.color,
        },
      },
    },
    {
      tone: "neutral",
      variant: "solid",
      css: {
        root: {
          backgroundColor: vars.variantSolidToneNeutral.rest.root.color,
          color: vars.variantSolidToneNeutral.rest.label.color,
        },
      },
    },
    {
      tone: "neutral",
      variant: "outline",
      css: {
        root: {
          boxShadow: `inset 0 0 0 ${vars.variantOutline.rest.root.strokeWidth} ${vars.variantOutlineToneNeutral.rest.root.strokeColor}`,
          color: vars.variantOutlineToneNeutral.rest.label.color,
        },
      },
    },
    {
      tone: "brand",
      variant: "weak",
      css: {
        root: {
          backgroundColor: vars.variantWeakToneBrand.rest.root.color,
          color: vars.variantWeakToneBrand.rest.label.color,
        },
      },
    },
    {
      tone: "brand",
      variant: "solid",
      css: {
        root: {
          backgroundColor: vars.variantSolidToneBrand.rest.root.color,
          color: vars.variantSolidToneBrand.rest.label.color,
        },
      },
    },
    {
      tone: "brand",
      variant: "outline",
      css: {
        root: {
          boxShadow: `inset 0 0 0 ${vars.variantOutline.rest.root.strokeWidth} ${vars.variantOutlineToneBrand.rest.root.strokeColor}`,
          color: vars.variantOutlineToneBrand.rest.label.color,
        },
      },
    },
    {
      tone: "informative",
      variant: "weak",
      css: {
        root: {
          backgroundColor: vars.variantWeakToneInformative.rest.root.color,
          color: vars.variantWeakToneInformative.rest.label.color,
        },
      },
    },
    {
      tone: "informative",
      variant: "solid",
      css: {
        root: {
          backgroundColor: vars.variantSolidToneInformative.rest.root.color,
          color: vars.variantSolidToneInformative.rest.label.color,
        },
      },
    },
    {
      tone: "informative",
      variant: "outline",
      css: {
        root: {
          boxShadow: `inset 0 0 0 ${vars.variantOutline.rest.root.strokeWidth} ${vars.variantOutlineToneInformative.rest.root.strokeColor}`,
          color: vars.variantOutlineToneInformative.rest.label.color,
        },
      },
    },
    {
      tone: "positive",
      variant: "weak",
      css: {
        root: {
          backgroundColor: vars.variantWeakTonePositive.rest.root.color,
          color: vars.variantWeakTonePositive.rest.label.color,
        },
      },
    },
    {
      tone: "positive",
      variant: "solid",
      css: {
        root: {
          backgroundColor: vars.variantSolidTonePositive.rest.root.color,
          color: vars.variantSolidTonePositive.rest.label.color,
        },
      },
    },
    {
      tone: "positive",
      variant: "outline",
      css: {
        root: {
          boxShadow: `inset 0 0 0 ${vars.variantOutline.rest.root.strokeWidth} ${vars.variantOutlineTonePositive.rest.root.strokeColor}`,
          color: vars.variantOutlineTonePositive.rest.label.color,
        },
      },
    },
    {
      tone: "warning",
      variant: "weak",
      css: {
        root: {
          backgroundColor: vars.variantWeakToneWarning.rest.root.color,
          color: vars.variantWeakToneWarning.rest.label.color,
        },
      },
    },
    {
      tone: "warning",
      variant: "solid",
      css: {
        root: {
          backgroundColor: vars.variantSolidToneWarning.rest.root.color,
          color: vars.variantSolidToneWarning.rest.label.color,
        },
      },
    },
    {
      tone: "warning",
      variant: "outline",
      css: {
        root: {
          boxShadow: `inset 0 0 0 ${vars.variantOutline.rest.root.strokeWidth} ${vars.variantOutlineToneWarning.rest.root.strokeColor}`,
          color: vars.variantOutlineToneWarning.rest.label.color,
        },
      },
    },
    {
      tone: "critical",
      variant: "weak",
      css: {
        root: {
          backgroundColor: vars.variantWeakToneCritical.rest.root.color,
          color: vars.variantWeakToneCritical.rest.label.color,
        },
      },
    },
    {
      tone: "critical",
      variant: "solid",
      css: {
        root: {
          backgroundColor: vars.variantSolidToneCritical.rest.root.color,
          color: vars.variantSolidToneCritical.rest.label.color,
        },
      },
    },
    {
      tone: "critical",
      variant: "outline",
      css: {
        root: {
          boxShadow: `inset 0 0 0 ${vars.variantOutline.rest.root.strokeWidth} ${vars.variantOutlineToneCritical.rest.root.strokeColor}`,
          color: vars.variantOutlineToneCritical.rest.label.color,
        },
      },
    },
  ],
  defaultVariants: {
    size: "medium",
    variant: "solid",
    tone: "neutral",
  },
  metadata: {
    variants: {
      variant: spec.data.schema.variants.variant,
      tone: spec.data.schema.variants.tone,
    },
  },
});

export default badge;

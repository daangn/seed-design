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
          // NOTE: when updating vars.sizeMedium.enabled.root.maxWidth, update 108px accordingly
          maxWidth: `clamp(calc(108px * var(--seed-font-size-limit-min)), ${vars.sizeMedium.enabled.root.maxWidth}, calc(108px * var(--seed-font-size-limit-max)))`,
          minHeight: vars.sizeMedium.enabled.root.minHeight,
          paddingLeft: vars.sizeMedium.enabled.root.paddingX,
          paddingRight: vars.sizeMedium.enabled.root.paddingX,
          paddingTop: vars.sizeMedium.enabled.root.paddingY,
          paddingBottom: vars.sizeMedium.enabled.root.paddingY,
          borderRadius: vars.sizeMedium.enabled.root.cornerRadius,

          fontSize: vars.sizeMedium.enabled.label.fontSize,
          lineHeight: vars.sizeMedium.enabled.label.lineHeight,
        },
      },
      large: {
        root: {
          // TODO: have some better way to derive `--seed-font-size-limit-min/max` and `120px`
          // NOTE: when updating vars.sizeLarge.enabled.root.maxWidth, update 120px accordingly
          maxWidth: `clamp(calc(120px * var(--seed-font-size-limit-min)), ${vars.sizeLarge.enabled.root.maxWidth}, calc(120px * var(--seed-font-size-limit-max)))`,
          minHeight: vars.sizeLarge.enabled.root.minHeight,
          paddingLeft: vars.sizeLarge.enabled.root.paddingX,
          paddingRight: vars.sizeLarge.enabled.root.paddingX,
          paddingTop: vars.sizeLarge.enabled.root.paddingY,
          paddingBottom: vars.sizeLarge.enabled.root.paddingY,
          borderRadius: vars.sizeLarge.enabled.root.cornerRadius,

          fontSize: vars.sizeLarge.enabled.label.fontSize,
          lineHeight: vars.sizeLarge.enabled.label.lineHeight,
        },
      },
    },
    variant: {
      weak: {
        root: {
          fontWeight: vars.variantWeak.enabled.label.fontWeight,
        },
      },
      solid: {
        root: {
          fontWeight: vars.variantSolid.enabled.label.fontWeight,
        },
      },
      outline: {
        root: {
          fontWeight: vars.variantOutline.enabled.label.fontWeight,
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
          backgroundColor: vars.toneNeutralVariantWeak.enabled.root.color,
          color: vars.toneNeutralVariantWeak.enabled.label.color,
        },
      },
    },
    {
      tone: "neutral",
      variant: "solid",
      css: {
        root: {
          backgroundColor: vars.toneNeutralVariantSolid.enabled.root.color,
          color: vars.toneNeutralVariantSolid.enabled.label.color,
        },
      },
    },
    {
      tone: "neutral",
      variant: "outline",
      css: {
        root: {
          boxShadow: `inset 0 0 0 ${vars.variantOutline.enabled.root.strokeWidth} ${vars.toneNeutralVariantOutline.enabled.root.strokeColor}`,
          color: vars.toneNeutralVariantOutline.enabled.label.color,
        },
      },
    },
    {
      tone: "brand",
      variant: "weak",
      css: {
        root: {
          backgroundColor: vars.toneBrandVariantWeak.enabled.root.color,
          color: vars.toneBrandVariantWeak.enabled.label.color,
        },
      },
    },
    {
      tone: "brand",
      variant: "solid",
      css: {
        root: {
          backgroundColor: vars.toneBrandVariantSolid.enabled.root.color,
          color: vars.toneBrandVariantSolid.enabled.label.color,
        },
      },
    },
    {
      tone: "brand",
      variant: "outline",
      css: {
        root: {
          boxShadow: `inset 0 0 0 ${vars.variantOutline.enabled.root.strokeWidth} ${vars.toneBrandVariantOutline.enabled.root.strokeColor}`,
          color: vars.toneBrandVariantOutline.enabled.label.color,
        },
      },
    },
    {
      tone: "informative",
      variant: "weak",
      css: {
        root: {
          backgroundColor: vars.toneInformativeVariantWeak.enabled.root.color,
          color: vars.toneInformativeVariantWeak.enabled.label.color,
        },
      },
    },
    {
      tone: "informative",
      variant: "solid",
      css: {
        root: {
          backgroundColor: vars.toneInformativeVariantSolid.enabled.root.color,
          color: vars.toneInformativeVariantSolid.enabled.label.color,
        },
      },
    },
    {
      tone: "informative",
      variant: "outline",
      css: {
        root: {
          boxShadow: `inset 0 0 0 ${vars.variantOutline.enabled.root.strokeWidth} ${vars.toneInformativeVariantOutline.enabled.root.strokeColor}`,
          color: vars.toneInformativeVariantOutline.enabled.label.color,
        },
      },
    },
    {
      tone: "positive",
      variant: "weak",
      css: {
        root: {
          backgroundColor: vars.tonePositiveVariantWeak.enabled.root.color,
          color: vars.tonePositiveVariantWeak.enabled.label.color,
        },
      },
    },
    {
      tone: "positive",
      variant: "solid",
      css: {
        root: {
          backgroundColor: vars.tonePositiveVariantSolid.enabled.root.color,
          color: vars.tonePositiveVariantSolid.enabled.label.color,
        },
      },
    },
    {
      tone: "positive",
      variant: "outline",
      css: {
        root: {
          boxShadow: `inset 0 0 0 ${vars.variantOutline.enabled.root.strokeWidth} ${vars.tonePositiveVariantOutline.enabled.root.strokeColor}`,
          color: vars.tonePositiveVariantOutline.enabled.label.color,
        },
      },
    },
    {
      tone: "warning",
      variant: "weak",
      css: {
        root: {
          backgroundColor: vars.toneWarningVariantWeak.enabled.root.color,
          color: vars.toneWarningVariantWeak.enabled.label.color,
        },
      },
    },
    {
      tone: "warning",
      variant: "solid",
      css: {
        root: {
          backgroundColor: vars.toneWarningVariantSolid.enabled.root.color,
          color: vars.toneWarningVariantSolid.enabled.label.color,
        },
      },
    },
    {
      tone: "warning",
      variant: "outline",
      css: {
        root: {
          boxShadow: `inset 0 0 0 ${vars.variantOutline.enabled.root.strokeWidth} ${vars.toneWarningVariantOutline.enabled.root.strokeColor}`,
          color: vars.toneWarningVariantOutline.enabled.label.color,
        },
      },
    },
    {
      tone: "critical",
      variant: "weak",
      css: {
        root: {
          backgroundColor: vars.toneCriticalVariantWeak.enabled.root.color,
          color: vars.toneCriticalVariantWeak.enabled.label.color,
        },
      },
    },
    {
      tone: "critical",
      variant: "solid",
      css: {
        root: {
          backgroundColor: vars.toneCriticalVariantSolid.enabled.root.color,
          color: vars.toneCriticalVariantSolid.enabled.label.color,
        },
      },
    },
    {
      tone: "critical",
      variant: "outline",
      css: {
        root: {
          boxShadow: `inset 0 0 0 ${vars.variantOutline.enabled.root.strokeWidth} ${vars.toneCriticalVariantOutline.enabled.root.strokeColor}`,
          color: vars.toneCriticalVariantOutline.enabled.label.color,
        },
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

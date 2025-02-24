import { badge as vars } from "../vars/component";
import { defineRecipe } from "../utils/define";

const badge = defineRecipe({
  name: "badge",
  slots: ["root"],
  base: {
    root: {
      display: "inline-flex",
      boxSizing: "border-box",
      alignItems: "center",
      justifyContent: "center",

      textTransform: "none",
      textAlign: "start",
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
      textDecoration: "none",
    },
  },
  variants: {
    size: {
      medium: {
        root: {
          minHeight: vars.sizeMedium.enabled.root.minHeight,
          paddingInline: vars.sizeMedium.enabled.root.paddingX,
          paddingBlock: vars.sizeMedium.enabled.root.paddingY,

          fontSize: vars.sizeMedium.enabled.label.fontSize,
          lineHeight: vars.sizeMedium.enabled.label.lineHeight,
        },
      },
      large: {
        root: {
          minHeight: vars.sizeLarge.enabled.root.minHeight,
          paddingInline: vars.sizeLarge.enabled.root.paddingX,
          paddingBlock: vars.sizeLarge.enabled.root.paddingY,

          fontSize: vars.sizeLarge.enabled.label.fontSize,
          lineHeight: vars.sizeLarge.enabled.label.lineHeight,
        },
      },
    },
    shape: {
      rectangle: {},
      pill: {
        root: {
          borderRadius: vars.shapePill.enabled.root.cornerRadius,
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
      critical: {},
    },
  },
  compoundVariants: [
    {
      shape: "rectangle",
      size: "medium",
      css: {
        root: {
          borderRadius: vars.shapeRectangleSizeMedium.enabled.root.cornerRadius,
        },
      },
    },
    {
      shape: "rectangle",
      size: "large",
      css: {
        root: {
          borderRadius: vars.shapeRectangleSizeLarge.enabled.root.cornerRadius,
        },
      },
    },
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
    shape: "rectangle",
    variant: "solid",
    tone: "neutral",
  },
});

export default badge;

import { badge as vars } from "@seed-design/vars/component";
import { defineRecipe } from "./helper";

export const badge = defineRecipe({
  name: "badge",
  slots: ["root", "label"],
  base: {
    root: {
      display: "inline-flex",
      boxSizing: "border-box",

      textTransform: "none",
      textAlign: "start",
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
    },
  },
  variants: {
    size: {
      medium: {
        root: {
          minHeight: vars.sizeMedium.enabled.root.minHeight,
          paddingInline: vars.sizeMedium.enabled.root.paddingX,
          paddingBlock: vars.sizeMedium.enabled.root.paddingY,
          fontSize: vars.sizeMedium.enabled.root.fontSize,
        },
      },
      small: {
        root: {
          minHeight: vars.sizeSmall.enabled.root.minHeight,
          paddingInline: vars.sizeSmall.enabled.root.paddingX,
          paddingBlock: vars.sizeSmall.enabled.root.paddingY,
          fontSize: vars.sizeSmall.enabled.root.fontSize,
        },
      },
    },
    shape: {
      rectangle: {},
      pill: {
        root: {
          borderRadius: vars.shapePill.enabled.root.borderRadius,
        },
      },
    },
    variant: {
      soft: {
        label: {
          fontWeight: vars.variantSoft.enabled.label.fontWeight,
        },
      },
      solid: {
        label: {
          fontWeight: vars.variantSolid.enabled.label.fontWeight,
        },
      },
      outlined: {
        root: {
          borderStyle: "solid",
          borderWidth: vars.variantOutlined.enabled.root.borderWidth,
        },
        label: {
          fontWeight: vars.variantOutlined.enabled.label.fontWeight,
        },
      },
    },
    tone: {
      neutral: {},
      brand: {},
      informative: {},
      positive: {},
      danger: {},
    },
  },
  compoundVariants: [
    {
      shape: "rectangle",
      size: "medium",
      css: {
        root: {
          borderRadius: vars.shapeRectangleSizeMedium.enabled.root.borderRadius,
        },
      },
    },
    {
      shape: "rectangle",
      size: "small",
      css: {
        root: {
          borderRadius: vars.shapeRectangleSizeSmall.enabled.root.borderRadius,
        },
      },
    },
    {
      tone: "neutral",
      variant: "soft",
      css: {
        root: {
          backgroundColor: vars.toneNeutralVariantSoft.enabled.root.color,
        },
        label: {
          color: vars.toneNeutralVariantSoft.enabled.label.color,
        },
      },
    },
    {
      tone: "neutral",
      variant: "solid",
      css: {
        root: {
          backgroundColor: vars.toneNeutralVariantSolid.enabled.root.color,
        },
        label: {
          color: vars.toneNeutralVariantSolid.enabled.label.color,
        },
      },
    },
    {
      tone: "neutral",
      variant: "outlined",
      css: {
        root: {
          borderColor: vars.toneNeutralVariantOutlined.enabled.root.strokeColor,
        },
        label: {
          color: vars.toneNeutralVariantOutlined.enabled.label.color,
        },
      },
    },
    {
      tone: "brand",
      variant: "soft",
      css: {
        root: {
          backgroundColor: vars.toneBrandVariantSoft.enabled.root.color,
        },
        label: {
          color: vars.toneBrandVariantSoft.enabled.label.color,
        },
      },
    },
    {
      tone: "brand",
      variant: "solid",
      css: {
        root: {
          backgroundColor: vars.toneBrandVariantSolid.enabled.root.color,
        },
        label: {
          color: vars.toneBrandVariantSolid.enabled.label.color,
        },
      },
    },
    {
      tone: "brand",
      variant: "outlined",
      css: {
        root: {
          borderColor: vars.toneBrandVariantOutlined.enabled.root.strokeColor,
        },
        label: {
          color: vars.toneBrandVariantOutlined.enabled.label.color,
        },
      },
    },
    {
      tone: "informative",
      variant: "soft",
      css: {
        root: {
          backgroundColor: vars.toneInformativeVariantSoft.enabled.root.color,
        },
        label: {
          color: vars.toneInformativeVariantSoft.enabled.label.color,
        },
      },
    },
    {
      tone: "informative",
      variant: "solid",
      css: {
        root: {
          backgroundColor: vars.toneInformativeVariantSolid.enabled.root.color,
        },
        label: {
          color: vars.toneInformativeVariantSolid.enabled.label.color,
        },
      },
    },
    {
      tone: "informative",
      variant: "outlined",
      css: {
        root: {
          borderColor: vars.toneInformativeVariantOutlined.enabled.root.strokeColor,
        },
        label: {
          color: vars.toneInformativeVariantOutlined.enabled.label.color,
        },
      },
    },
    {
      tone: "positive",
      variant: "soft",
      css: {
        root: {
          backgroundColor: vars.tonePositiveVariantSoft.enabled.root.color,
        },
        label: {
          color: vars.tonePositiveVariantSoft.enabled.label.color,
        },
      },
    },
    {
      tone: "positive",
      variant: "solid",
      css: {
        root: {
          backgroundColor: vars.tonePositiveVariantSolid.enabled.root.color,
        },
        label: {
          color: vars.tonePositiveVariantSolid.enabled.label.color,
        },
      },
    },
    {
      tone: "positive",
      variant: "outlined",
      css: {
        root: {
          borderColor: vars.tonePositiveVariantOutlined.enabled.root.strokeColor,
        },
        label: {
          color: vars.tonePositiveVariantOutlined.enabled.label.color,
        },
      },
    },
    {
      tone: "danger",
      variant: "soft",
      css: {
        root: {
          backgroundColor: vars.toneDangerVariantSoft.enabled.root.color,
        },
        label: {
          color: vars.toneDangerVariantSoft.enabled.label.color,
        },
      },
    },
    {
      tone: "danger",
      variant: "solid",
      css: {
        root: {
          backgroundColor: vars.toneDangerVariantSolid.enabled.root.color,
        },
        label: {
          color: vars.toneDangerVariantSolid.enabled.label.color,
        },
      },
    },
    {
      tone: "danger",
      variant: "outlined",
      css: {
        root: {
          borderColor: vars.toneDangerVariantOutlined.enabled.root.strokeColor,
        },
        label: {
          color: vars.toneDangerVariantOutlined.enabled.label.color,
        },
      },
    },
  ],
});

export default badge;

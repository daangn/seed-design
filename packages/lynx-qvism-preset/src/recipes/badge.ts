import * as duration from "../vars/duration";
import * as scale from "../vars/scale";
import * as timingFunction from "../vars/timing-function";
import { badge as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";

const badge = defineSlotRecipe({
  name: "badge",
  slots: ["root", "prefix", "label", "action"],
  base: {
    root: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      minWidth: 0,
      flexShrink: 1,
      overflow: "hidden",
      textAlign: "start",
    },
    prefix: {
      display: "flex",
      flexDirection: "row",
      flexShrink: 0,
      alignItems: "center",
      justifyContent: "center",
      color: "inherit",
      "--seed-icon-size": "100%",
      "--seed-icon-color": "currentColor",
    },
    label: {
      minWidth: 0,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      flexShrink: 1,
    },
    action: {
      display: "flex",
      flexDirection: "row",
      flexShrink: 0,
      alignItems: "center",
      justifyContent: "center",
      color: "inherit",
      "--seed-icon-size": "100%",
      "--seed-icon-color": "currentColor",
      transform: "scale(1)",
      transition: `transform ${duration.pressedScale} ${timingFunction.pressedScale}`,
    },
  },
  variants: {
    size: {
      medium: {
        root: {
          minHeight: vars.sizeMedium.enabled.root.minHeight,
          paddingLeft: vars.sizeMedium.enabled.root.paddingX,
          paddingRight: vars.sizeMedium.enabled.root.paddingX,
          paddingTop: vars.sizeMedium.enabled.root.paddingY,
          paddingBottom: vars.sizeMedium.enabled.root.paddingY,
          borderRadius: vars.sizeMedium.enabled.root.cornerRadius,
          gap: vars.sizeMedium.enabled.root.gap,
        },
        label: {
          fontSize: vars.sizeMedium.enabled.label.fontSize,
          lineHeight: vars.sizeMedium.enabled.label.lineHeight,
        },
        prefix: {
          width: vars.sizeMedium.enabled.prefix.size,
          height: vars.sizeMedium.enabled.prefix.size,
        },
        action: {
          width: vars.sizeMedium.enabled.action.size,
          height: vars.sizeMedium.enabled.action.size,
        },
      },
      large: {
        root: {
          minHeight: vars.sizeLarge.enabled.root.minHeight,
          paddingLeft: vars.sizeLarge.enabled.root.paddingX,
          paddingRight: vars.sizeLarge.enabled.root.paddingX,
          paddingTop: vars.sizeLarge.enabled.root.paddingY,
          paddingBottom: vars.sizeLarge.enabled.root.paddingY,
          borderRadius: vars.sizeLarge.enabled.root.cornerRadius,
          gap: vars.sizeLarge.enabled.root.gap,
        },
        label: {
          fontSize: vars.sizeLarge.enabled.label.fontSize,
          lineHeight: vars.sizeLarge.enabled.label.lineHeight,
        },
        prefix: {
          width: vars.sizeLarge.enabled.prefix.size,
          height: vars.sizeLarge.enabled.prefix.size,
        },
        action: {
          width: vars.sizeLarge.enabled.action.size,
          height: vars.sizeLarge.enabled.action.size,
        },
      },
    },
    variant: {
      weak: {
        label: {
          fontWeight: vars.variantWeak.enabled.label.fontWeight,
        },
      },
      solid: {
        label: {
          fontWeight: vars.variantSolid.enabled.label.fontWeight,
        },
      },
      outline: {
        label: {
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
    pressed: {
      true: {},
      false: {},
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
        label: { color: vars.toneNeutralVariantWeak.enabled.label.color },
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
        label: { color: vars.toneNeutralVariantSolid.enabled.label.color },
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
        label: { color: vars.toneNeutralVariantOutline.enabled.label.color },
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
        label: { color: vars.toneBrandVariantWeak.enabled.label.color },
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
        label: { color: vars.toneBrandVariantSolid.enabled.label.color },
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
        label: { color: vars.toneBrandVariantOutline.enabled.label.color },
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
        label: { color: vars.toneInformativeVariantWeak.enabled.label.color },
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
        label: { color: vars.toneInformativeVariantSolid.enabled.label.color },
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
        label: { color: vars.toneInformativeVariantOutline.enabled.label.color },
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
        label: { color: vars.tonePositiveVariantWeak.enabled.label.color },
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
        label: { color: vars.tonePositiveVariantSolid.enabled.label.color },
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
        label: { color: vars.tonePositiveVariantOutline.enabled.label.color },
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
        label: { color: vars.toneWarningVariantWeak.enabled.label.color },
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
        label: { color: vars.toneWarningVariantSolid.enabled.label.color },
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
        label: { color: vars.toneWarningVariantOutline.enabled.label.color },
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
        label: { color: vars.toneCriticalVariantWeak.enabled.label.color },
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
        label: { color: vars.toneCriticalVariantSolid.enabled.label.color },
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
        label: { color: vars.toneCriticalVariantOutline.enabled.label.color },
      },
    },
    {
      size: "medium",
      pressed: true,
      css: {
        action: { transform: `scale(${scale.s95})` },
      },
    },
    {
      size: "large",
      pressed: true,
      css: {
        action: { transform: `scale(${scale.s95})` },
      },
    },
  ],
  defaultVariants: {
    size: "medium",
    variant: "solid",
    tone: "neutral",
    pressed: false,
  },
});

export default badge;

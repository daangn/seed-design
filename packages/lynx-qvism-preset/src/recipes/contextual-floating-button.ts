import { contextualFloatingButton as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";

const ROOT_COLOR_TRANSITION = `background-color ${vars.base.enabled.root.colorDuration} ${vars.base.enabled.root.colorTimingFunction}`;

/**
 * Lynx-specific ContextualFloatingButton recipe.
 *
 * Scale Feedback owns the root transform on the main thread, so this recipe
 * intentionally transitions color only. The component supplies `pressed` from
 * usePressTap and makes disabled/loading interactions inert.
 */
const contextualFloatingButton = defineSlotRecipe({
  name: "contextual-floating-button",
  slots: ["root", "content", "text", "prefixIcon", "icon", "loadingIndicator"],
  base: {
    root: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      width: "fit-content",
      borderRadius: vars.base.enabled.root.cornerRadius,
      boxShadow: vars.base.enabled.root.shadow,
      "--size": vars.base.enabled.progressCircle.size,
      "--thickness": vars.base.enabled.progressCircle.thickness,
      transition: ROOT_COLOR_TRANSITION,
    },
    content: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      opacity: 1,
    },
    prefixIcon: {
      flexShrink: 0,
    },
    icon: {
      flexShrink: 0,
    },
    loadingIndicator: {
      position: "absolute",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
  },
  variants: {
    variant: {
      solid: {
        root: {
          background: vars.variantSolid.enabled.root.color,
          "--track-color": vars.variantSolid.enabled.progressCircle.trackColor,
          "--range-color": vars.variantSolid.enabled.progressCircle.rangeColor,
        },
        text: { color: vars.variantSolid.enabled.label.color },
        prefixIcon: { color: vars.variantSolid.enabled.prefixIcon.color },
        icon: { color: vars.variantSolid.enabled.icon.color },
      },
      layer: {
        root: {
          background: vars.variantLayer.enabled.root.color,
          "--track-color": vars.variantLayer.enabled.progressCircle.trackColor,
          "--range-color": vars.variantLayer.enabled.progressCircle.rangeColor,
        },
        text: { color: vars.variantLayer.enabled.label.color },
        prefixIcon: { color: vars.variantLayer.enabled.prefixIcon.color },
        icon: { color: vars.variantLayer.enabled.icon.color },
      },
    },
    layout: {
      withText: {
        root: {
          minHeight: vars.layoutWithText.enabled.root.minHeight,
          paddingTop: vars.layoutWithText.enabled.root.paddingY,
          paddingRight: vars.layoutWithText.enabled.root.paddingX,
          paddingBottom: vars.layoutWithText.enabled.root.paddingY,
          paddingLeft: vars.layoutWithText.enabled.root.paddingX,
        },
        content: { gap: vars.layoutWithText.enabled.root.gap },
        text: {
          fontSize: vars.layoutWithText.enabled.label.fontSize,
          lineHeight: vars.layoutWithText.enabled.label.lineHeight,
          fontWeight: vars.layoutWithText.enabled.label.fontWeight,
        },
        prefixIcon: {
          width: vars.layoutWithText.enabled.prefixIcon.size,
          height: vars.layoutWithText.enabled.prefixIcon.size,
        },
      },
      iconOnly: {
        root: {
          width: vars.layoutIconOnly.enabled.root.size,
          height: vars.layoutIconOnly.enabled.root.size,
        },
        icon: {
          width: vars.layoutIconOnly.enabled.icon.size,
          height: vars.layoutIconOnly.enabled.icon.size,
        },
      },
    },
    pressed: {
      true: {},
      false: {},
    },
    disabled: {
      true: {},
      false: {},
    },
    loading: {
      true: { content: { opacity: 0 } },
      false: {},
    },
  },
  compoundVariants: [
    // Source order establishes the ActionButton state priority: loading > disabled > pressed.
    {
      variant: "solid",
      pressed: true,
      css: { root: { background: vars.variantSolid.pressed.root.color } },
    },
    {
      variant: "layer",
      pressed: true,
      css: { root: { background: vars.variantLayer.pressed.root.color } },
    },
    {
      variant: "solid",
      disabled: true,
      css: {
        root: { background: vars.variantSolid.disabled.root.color },
        text: { color: vars.variantSolid.disabled.label.color },
        prefixIcon: { color: vars.variantSolid.disabled.prefixIcon.color },
        icon: { color: vars.variantSolid.disabled.icon.color },
      },
    },
    {
      variant: "layer",
      disabled: true,
      css: {
        root: { background: vars.variantLayer.disabled.root.color },
        text: { color: vars.variantLayer.disabled.label.color },
        prefixIcon: { color: vars.variantLayer.disabled.prefixIcon.color },
        icon: { color: vars.variantLayer.disabled.icon.color },
      },
    },
    {
      variant: "solid",
      loading: true,
      css: { root: { background: vars.variantSolid.loading.root.color } },
    },
    {
      variant: "layer",
      loading: true,
      css: { root: { background: vars.variantLayer.loading.root.color } },
    },
  ],
  defaultVariants: {
    variant: "solid",
    layout: "withText",
    pressed: false,
    disabled: false,
    loading: false,
  },
});

export default contextualFloatingButton;

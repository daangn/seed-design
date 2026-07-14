import spec from "@seed-design/rootage-artifacts/components/input-button.json" with {
  type: "json",
};
import { inputButton as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";
import { active, pseudo, engaged, focusVisible, invalid, not, readOnly } from "../utils/pseudo";
import {
  createFocusRingRestStyles,
  createFocusRingStyles,
  FOCUS_RING_TRANSITION,
} from "../utils/focus-ring";
import { onlyIcon } from "../utils/icon";
import { vars as tokens } from "../vars";
import { breakpoints } from "../utils/breakpoint";

const inputButton = defineSlotRecipe({
  name: "input-button",
  slots: [
    "root",
    "layout",
    "value",
    "placeholder",
    "button",
    "prefixText",
    "prefixIcon",
    "suffixText",
    "suffixIcon",
    "clearButton",
  ],
  base: {
    root: {
      display: "flex",
      width: "100%",
      alignItems: "center",

      boxSizing: "border-box",

      position: "relative",
      isolation: "isolate",

      // press signal for the layout layer — custom properties inherit, so the layout
      // slot can consume this without any state forwarding in React. Keyed on
      // [data-active] only (not native :active): the press state comes from the
      // button overlay, matching the pressed background, and must not fire when a
      // sibling like clearButton is pressed.
      [pseudo(not("[data-disabled]"), not(readOnly), "[data-active]")]: {
        "--input-button-pressed-scale": vars.base.pressed.root.contentScale,
      },
    },
    // layout layer — flex row holding the field content (everything but the button
    // overlay); scales as a whole on press while the background stays on button.
    // Composed explicitly via FieldButton.Layout; compositions without it skip the scale.
    layout: {
      display: "flex",
      alignItems: "center",
      flexGrow: 1,

      // gap is defined per size variant on root (a no-op there once content moves
      // into this slot) — inherit it instead of duplicating the size variants.
      gap: "inherit",

      // allow shrinking below max-content so the value keeps truncating
      minWidth: 0,

      // Individual `scale` over `transform: scale()` — progressive enhancement for Chrome 104+ (older browsers just skip the pressed scale).
      // The pressed value is inherited from root, so press detection stays on the
      // interactive element itself (same signal as the pressed background).
      scale: "var(--input-button-pressed-scale, 1)",

      transition: `scale ${vars.base.enabled.root.contentScaleDuration} ${vars.base.enabled.root.contentScaleTimingFunction}`,
    },
    button: {
      position: "absolute",
      zIndex: -1,

      inset: 0,

      cursor: "pointer",

      border: "none",
      padding: 0,

      backgroundColor: vars.base.enabled.root.color,

      boxShadow: `inset 0 0 0 ${vars.base.enabled.root.strokeWidth} ${vars.base.enabled.root.strokeColor}`,

      transition: `background-color ${vars.base.enabled.root.colorDuration} ${vars.base.enabled.root.colorTimingFunction}, ${FOCUS_RING_TRANSITION}`,

      "&::after": {
        content: '""',
        position: "absolute",
        inset: 0,
        borderRadius: "inherit",
        borderStyle: "solid",
        borderColor: "transparent",
        borderWidth: vars.base.invalid.root.strokeWidth,

        transition: `border-color ${vars.base.enabled.root.strokeDuration} ${vars.base.enabled.root.strokeTimingFunction}`,

        pointerEvents: "none",
      },

      [pseudo("[data-disabled]")]: {
        cursor: "not-allowed",
        backgroundColor: vars.base.disabled.root.color,
      },

      [pseudo(not("[data-disabled]"), not(readOnly), engaged)]: {
        backgroundColor: vars.base.pressed.root.color,
      },

      [pseudo(readOnly, not("[data-disabled]"))]: {
        cursor: "default",
        backgroundColor: vars.base.readonly.root.color,
      },

      ...createFocusRingRestStyles(),
      [pseudo(focusVisible)]: createFocusRingStyles(),

      [pseudo(invalid, "::after")]: {
        borderWidth: vars.base.invalid.root.strokeWidth,
        borderColor: vars.base.invalid.root.strokeColor,
      },
    },
    value: {
      fontWeight: vars.base.enabled.value.fontWeight,

      color: vars.base.enabled.value.color,

      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",

      flexGrow: 1,

      pointerEvents: "none",

      [pseudo("[data-disabled]")]: {
        color: vars.base.disabled.value.color,
      },

      [pseudo(readOnly, not("[data-disabled]"))]: {
        color: vars.base.readonly.value.color,
      },
    },
    placeholder: {
      fontWeight: vars.base.enabled.placeholder.fontWeight,

      color: vars.base.enabled.placeholder.color,

      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",

      flexGrow: 1,

      pointerEvents: "none",

      [pseudo("[data-disabled]")]: {
        color: vars.base.disabled.placeholder.color,
      },

      [pseudo(readOnly, not("[data-disabled]"))]: {
        color: vars.base.readonly.placeholder.color,
      },
    },
    prefixText: {
      fontWeight: vars.base.enabled.prefixText.fontWeight,

      color: vars.base.enabled.prefixText.color,

      pointerEvents: "none",

      [pseudo("[data-disabled]")]: {
        color: vars.base.disabled.prefixText.color,
      },
    },
    prefixIcon: {
      flexShrink: 0,

      color: vars.base.enabled.prefixIcon.color,

      pointerEvents: "none",

      [pseudo("[data-disabled]")]: {
        color: vars.base.disabled.prefixIcon.color,
      },
    },
    suffixText: {
      fontWeight: vars.base.enabled.suffixText.fontWeight,

      color: vars.base.enabled.suffixText.color,

      pointerEvents: "none",

      [pseudo("[data-disabled]")]: {
        color: vars.base.disabled.suffixText.color,
      },
    },
    suffixIcon: {
      flexShrink: 0,

      color: vars.base.enabled.suffixIcon.color,

      pointerEvents: "none",

      [pseudo("[data-disabled]")]: {
        color: vars.base.disabled.suffixIcon.color,
      },
    },
    clearButton: {
      cursor: "pointer",

      border: "none",
      backgroundColor: "transparent",

      padding: 0,

      borderRadius: tokens.$radius.full,

      // Individual `scale` over `transform: scale()` — progressive enhancement for Chrome 104+ (older browsers just skip the pressed scale).
      scale: "1",

      transition: `scale ${vars.base.enabled.clearButton.scaleDuration} ${vars.base.enabled.clearButton.scaleTimingFunction}, ${FOCUS_RING_TRANSITION}`,
      ...createFocusRingRestStyles(),
      [pseudo(focusVisible)]: createFocusRingStyles(),

      ...onlyIcon({
        color: vars.base.enabled.clearButton.color,
      }),

      [pseudo(active)]: {
        scale: vars.base.pressed.clearButton.scale,
      },
    },
  },
  variants: {
    size: {
      large: {
        root: {
          height: vars.sizeLarge.enabled.root.height,
          gap: vars.sizeLarge.enabled.root.gap,
          paddingInline: vars.sizeLarge.enabled.root.paddingX,
        },
        button: {
          borderRadius: vars.sizeLarge.enabled.root.cornerRadius,
        },
        value: {
          fontSize: vars.sizeLarge.enabled.value.fontSize,
          lineHeight: vars.sizeLarge.enabled.value.lineHeight,
        },
        placeholder: {
          fontSize: vars.sizeLarge.enabled.placeholder.fontSize,
          lineHeight: vars.sizeLarge.enabled.placeholder.lineHeight,
        },
        prefixText: {
          fontSize: vars.sizeLarge.enabled.prefixText.fontSize,
          lineHeight: vars.sizeLarge.enabled.prefixText.lineHeight,
        },
        prefixIcon: {
          width: vars.sizeLarge.enabled.prefixIcon.size,
          height: vars.sizeLarge.enabled.prefixIcon.size,
        },
        suffixText: {
          fontSize: vars.sizeLarge.enabled.suffixText.fontSize,
          lineHeight: vars.sizeLarge.enabled.suffixText.lineHeight,
        },
        suffixIcon: {
          width: vars.sizeLarge.enabled.suffixIcon.size,
          height: vars.sizeLarge.enabled.suffixIcon.size,
        },
        clearButton: onlyIcon({
          size: vars.sizeLarge.enabled.clearButton.size,
        }),
      },
      medium: {
        root: {
          height: vars.sizeMedium.enabled.root.height,
          gap: vars.sizeMedium.enabled.root.gap,
          paddingInline: vars.sizeMedium.enabled.root.paddingX,
        },
        button: {
          borderRadius: vars.sizeMedium.enabled.root.cornerRadius,
        },
        value: {
          fontSize: vars.sizeMedium.enabled.value.fontSize,
          lineHeight: vars.sizeMedium.enabled.value.lineHeight,
        },
        placeholder: {
          fontSize: vars.sizeMedium.enabled.placeholder.fontSize,
          lineHeight: vars.sizeMedium.enabled.placeholder.lineHeight,
        },
        prefixText: {
          fontSize: vars.sizeMedium.enabled.prefixText.fontSize,
          lineHeight: vars.sizeMedium.enabled.prefixText.lineHeight,
        },
        prefixIcon: {
          width: vars.sizeMedium.enabled.prefixIcon.size,
          height: vars.sizeMedium.enabled.prefixIcon.size,
        },
        suffixText: {
          fontSize: vars.sizeMedium.enabled.suffixText.fontSize,
          lineHeight: vars.sizeMedium.enabled.suffixText.lineHeight,
        },
        suffixIcon: {
          width: vars.sizeMedium.enabled.suffixIcon.size,
          height: vars.sizeMedium.enabled.suffixIcon.size,
        },
        clearButton: onlyIcon({
          size: vars.sizeMedium.enabled.clearButton.size,
        }),
      },
      responsive: {
        root: {
          height: vars.sizeLarge.enabled.root.height,
          gap: vars.sizeLarge.enabled.root.gap,
          paddingInline: vars.sizeLarge.enabled.root.paddingX,

          [breakpoints.up("lg")]: {
            height: vars.sizeMedium.enabled.root.height,
            gap: vars.sizeMedium.enabled.root.gap,
            paddingInline: vars.sizeMedium.enabled.root.paddingX,
          },
        },
        button: {
          borderRadius: vars.sizeLarge.enabled.root.cornerRadius,

          [breakpoints.up("lg")]: {
            borderRadius: vars.sizeMedium.enabled.root.cornerRadius,
          },
        },
        value: {
          fontSize: vars.sizeLarge.enabled.value.fontSize,
          lineHeight: vars.sizeLarge.enabled.value.lineHeight,

          [breakpoints.up("lg")]: {
            fontSize: vars.sizeMedium.enabled.value.fontSize,
            lineHeight: vars.sizeMedium.enabled.value.lineHeight,
          },
        },
        placeholder: {
          fontSize: vars.sizeLarge.enabled.placeholder.fontSize,
          lineHeight: vars.sizeLarge.enabled.placeholder.lineHeight,

          [breakpoints.up("lg")]: {
            fontSize: vars.sizeMedium.enabled.placeholder.fontSize,
            lineHeight: vars.sizeMedium.enabled.placeholder.lineHeight,
          },
        },
        prefixText: {
          fontSize: vars.sizeLarge.enabled.prefixText.fontSize,
          lineHeight: vars.sizeLarge.enabled.prefixText.lineHeight,

          [breakpoints.up("lg")]: {
            fontSize: vars.sizeMedium.enabled.prefixText.fontSize,
            lineHeight: vars.sizeMedium.enabled.prefixText.lineHeight,
          },
        },
        prefixIcon: {
          width: vars.sizeLarge.enabled.prefixIcon.size,
          height: vars.sizeLarge.enabled.prefixIcon.size,

          [breakpoints.up("lg")]: {
            width: vars.sizeMedium.enabled.prefixIcon.size,
            height: vars.sizeMedium.enabled.prefixIcon.size,
          },
        },
        suffixText: {
          fontSize: vars.sizeLarge.enabled.suffixText.fontSize,
          lineHeight: vars.sizeLarge.enabled.suffixText.lineHeight,

          [breakpoints.up("lg")]: {
            fontSize: vars.sizeMedium.enabled.suffixText.fontSize,
            lineHeight: vars.sizeMedium.enabled.suffixText.lineHeight,
          },
        },
        suffixIcon: {
          width: vars.sizeLarge.enabled.suffixIcon.size,
          height: vars.sizeLarge.enabled.suffixIcon.size,

          [breakpoints.up("lg")]: {
            width: vars.sizeMedium.enabled.suffixIcon.size,
            height: vars.sizeMedium.enabled.suffixIcon.size,
          },
        },
        clearButton: {
          ...onlyIcon({
            size: vars.sizeLarge.enabled.clearButton.size,
          }),

          [breakpoints.up("lg")]: onlyIcon({
            size: vars.sizeMedium.enabled.clearButton.size,
          }),
        },
      },
    },
  },
  defaultVariants: {
    size: "large",
  },
  metadata: {
    variants: {
      ...spec.data.schema.variants,
      size: {
        ...spec.data.schema.variants.size,
        values: {
          ...spec.data.schema.variants.size.values,
          responsive: {
            description:
              "뷰포트 너비에 따라 적용되는 사이즈가 달라집니다. Breakpoint `lg` 미만에서는 `large`, `lg` 이상에서는 `medium`으로 적용됩니다.",
          },
        },
      },
    },
  },
});

export default inputButton;

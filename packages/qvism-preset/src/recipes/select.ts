import selectSpec from "@seed-design/rootage-artifacts/components/select.json" with {
  type: "json",
};
import selectTriggerSpec from "@seed-design/rootage-artifacts/components/select-trigger.json" with {
  type: "json",
};
import selectItemSpec from "@seed-design/rootage-artifacts/components/select-item.json" with {
  type: "json",
};
import {
  select as selectVars,
  selectTrigger as selectTriggerVars,
  selectItem as selectItemVars,
} from "../vars/component";
import { defineSlotRecipe } from "../utils/define";
import {
  active,
  before,
  disabled,
  engaged,
  focus,
  focusVisible,
  hidden,
  invalid,
  not,
  open,
  pseudo,
  readOnly,
} from "../utils/pseudo";
import { enterAnimation, exitAnimation } from "../utils/animation";
import {
  createFocusRingRestStyles,
  createFocusRingStyles,
  FOCUS_RING_TRANSITION,
} from "../utils/focus-ring";
import { prefixIcon } from "../utils/icon";
import { breakpoints } from "../utils/breakpoint";

const SELECT_TRANSFORM_ORIGIN = "--seed-select-transform-origin";
const SELECT_AVAILABLE_HEIGHT = "--seed-select-available-height";
const SELECT_REFERENCE_WIDTH = "--seed-select-reference-width";

// Active-option / pressed background. In a select-only combobox the list items
// never receive real DOM focus (focus stays on the combobox via
// `aria-activedescendant`), so the highlight is keyed off `[data-highlighted]`
// rather than `:focus-visible`. That single active option is moved by both keyboard
// navigation and pointer hover, so the highlight always tracks exactly one option —
// never two. `:active` layers press feedback on top; on touch,
// where there is no hover, it is the only pointer feedback an option gets.
const highlightedItem = {
  backgroundColor: selectItemVars.base.pressed.root.color,
  insetInline: selectItemVars.base.pressed.root.marginX,
  borderRadius: selectItemVars.base.pressed.root.cornerRadius,
};

/**
 * Select trigger — the `role="combobox"` button whose text content is the
 * selected value. It contains its value directly, so the interactive layer is
 * merged into `root` (there is no separate absolute-overlay interactive slot).
 */
export const selectTrigger = defineSlotRecipe({
  name: "select-trigger",
  slots: ["root", "value", "placeholder", "prefixText", "prefixIcon", "suffixIcon"],
  base: {
    root: {
      display: "flex",
      width: "100%",
      alignItems: "center",

      boxSizing: "border-box",

      position: "relative",
      isolation: "isolate",

      cursor: "pointer",
      margin: 0,
      border: "none",
      fontFamily: "inherit",

      backgroundColor: selectTriggerVars.base.enabled.root.color,

      boxShadow: `inset 0 0 0 ${selectTriggerVars.base.enabled.root.strokeWidth} ${selectTriggerVars.base.enabled.root.strokeColor}`,

      transition: `background-color ${selectTriggerVars.base.enabled.root.colorDuration} ${selectTriggerVars.base.enabled.root.colorTimingFunction}, ${FOCUS_RING_TRANSITION}`,

      "&::after": {
        content: '""',
        position: "absolute",
        inset: 0,
        borderRadius: "inherit",
        borderStyle: "solid",
        borderColor: "transparent",
        borderWidth: selectTriggerVars.base.invalid.root.strokeWidth,

        transition: `border-color ${selectTriggerVars.base.enabled.root.strokeDuration} ${selectTriggerVars.base.enabled.root.strokeTimingFunction}`,

        pointerEvents: "none",
      },

      [pseudo("[data-disabled]")]: {
        cursor: "not-allowed",
        backgroundColor: selectTriggerVars.base.disabled.root.color,
      },

      [pseudo(not("[data-disabled]"), not(readOnly), engaged)]: {
        backgroundColor: selectTriggerVars.base.pressed.root.color,
      },

      [pseudo(readOnly, not("[data-disabled]"))]: {
        cursor: "default",
        backgroundColor: selectTriggerVars.base.readonly.root.color,
      },

      ...createFocusRingRestStyles(),
      [pseudo(focusVisible)]: createFocusRingStyles(),

      [pseudo(invalid, "::after")]: {
        borderWidth: selectTriggerVars.base.invalid.root.strokeWidth,
        borderColor: selectTriggerVars.base.invalid.root.strokeColor,
      },
    },
    value: {
      fontWeight: selectTriggerVars.base.enabled.value.fontWeight,

      color: selectTriggerVars.base.enabled.value.color,

      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      textAlign: "start",

      flexGrow: 1,

      pointerEvents: "none",

      [pseudo("[data-disabled]")]: {
        color: selectTriggerVars.base.disabled.value.color,
      },

      [pseudo(readOnly, not("[data-disabled]"))]: {
        color: selectTriggerVars.base.readonly.value.color,
      },
    },
    placeholder: {
      fontWeight: selectTriggerVars.base.enabled.placeholder.fontWeight,

      color: selectTriggerVars.base.enabled.placeholder.color,

      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      textAlign: "start",

      flexGrow: 1,

      pointerEvents: "none",

      [pseudo("[data-disabled]")]: {
        color: selectTriggerVars.base.disabled.placeholder.color,
      },

      [pseudo(readOnly, not("[data-disabled]"))]: {
        color: selectTriggerVars.base.readonly.placeholder.color,
      },
    },
    prefixText: {
      flexShrink: 0,

      fontWeight: selectTriggerVars.base.enabled.prefixText.fontWeight,

      color: selectTriggerVars.base.enabled.prefixText.color,

      pointerEvents: "none",

      [pseudo("[data-disabled]")]: {
        color: selectTriggerVars.base.disabled.prefixText.color,
      },
    },
    prefixIcon: {
      flexShrink: 0,

      color: selectTriggerVars.base.enabled.prefixIcon.color,

      pointerEvents: "none",

      [pseudo("[data-disabled]")]: {
        color: selectTriggerVars.base.disabled.prefixIcon.color,
      },
    },
    suffixIcon: {
      flexShrink: 0,

      color: selectTriggerVars.base.enabled.suffixIcon.color,

      pointerEvents: "none",

      transform: "rotate(0deg)",
      transition: `transform ${selectTriggerVars.base.enabled.suffixIcon.rotateDuration} ${selectTriggerVars.base.enabled.suffixIcon.rotateTimingFunction}`,

      [pseudo(open)]: {
        transform: "rotate(180deg)",
      },

      [pseudo("[data-disabled]")]: {
        color: selectTriggerVars.base.disabled.suffixIcon.color,
      },
    },
  },
  variants: {
    size: {
      large: {
        root: {
          height: selectTriggerVars.sizeLarge.enabled.root.height,
          gap: selectTriggerVars.sizeLarge.enabled.root.gap,
          paddingInline: selectTriggerVars.sizeLarge.enabled.root.paddingX,
          borderRadius: selectTriggerVars.sizeLarge.enabled.root.cornerRadius,
        },
        value: {
          fontSize: selectTriggerVars.sizeLarge.enabled.value.fontSize,
          lineHeight: selectTriggerVars.sizeLarge.enabled.value.lineHeight,
        },
        placeholder: {
          fontSize: selectTriggerVars.sizeLarge.enabled.placeholder.fontSize,
          lineHeight: selectTriggerVars.sizeLarge.enabled.placeholder.lineHeight,
        },
        prefixText: {
          fontSize: selectTriggerVars.sizeLarge.enabled.prefixText.fontSize,
          lineHeight: selectTriggerVars.sizeLarge.enabled.prefixText.lineHeight,
        },
        prefixIcon: {
          width: selectTriggerVars.sizeLarge.enabled.prefixIcon.size,
          height: selectTriggerVars.sizeLarge.enabled.prefixIcon.size,
        },
        suffixIcon: {
          width: selectTriggerVars.sizeLarge.enabled.suffixIcon.size,
          height: selectTriggerVars.sizeLarge.enabled.suffixIcon.size,
        },
      },
      medium: {
        root: {
          height: selectTriggerVars.sizeMedium.enabled.root.height,
          gap: selectTriggerVars.sizeMedium.enabled.root.gap,
          paddingInline: selectTriggerVars.sizeMedium.enabled.root.paddingX,
          borderRadius: selectTriggerVars.sizeMedium.enabled.root.cornerRadius,
        },
        value: {
          fontSize: selectTriggerVars.sizeMedium.enabled.value.fontSize,
          lineHeight: selectTriggerVars.sizeMedium.enabled.value.lineHeight,
        },
        placeholder: {
          fontSize: selectTriggerVars.sizeMedium.enabled.placeholder.fontSize,
          lineHeight: selectTriggerVars.sizeMedium.enabled.placeholder.lineHeight,
        },
        prefixText: {
          fontSize: selectTriggerVars.sizeMedium.enabled.prefixText.fontSize,
          lineHeight: selectTriggerVars.sizeMedium.enabled.prefixText.lineHeight,
        },
        prefixIcon: {
          width: selectTriggerVars.sizeMedium.enabled.prefixIcon.size,
          height: selectTriggerVars.sizeMedium.enabled.prefixIcon.size,
        },
        suffixIcon: {
          width: selectTriggerVars.sizeMedium.enabled.suffixIcon.size,
          height: selectTriggerVars.sizeMedium.enabled.suffixIcon.size,
        },
      },
      responsive: {
        root: {
          height: selectTriggerVars.sizeLarge.enabled.root.height,
          gap: selectTriggerVars.sizeLarge.enabled.root.gap,
          paddingInline: selectTriggerVars.sizeLarge.enabled.root.paddingX,
          borderRadius: selectTriggerVars.sizeLarge.enabled.root.cornerRadius,

          [breakpoints.up("lg")]: {
            height: selectTriggerVars.sizeMedium.enabled.root.height,
            gap: selectTriggerVars.sizeMedium.enabled.root.gap,
            paddingInline: selectTriggerVars.sizeMedium.enabled.root.paddingX,
            borderRadius: selectTriggerVars.sizeMedium.enabled.root.cornerRadius,
          },
        },
        value: {
          fontSize: selectTriggerVars.sizeLarge.enabled.value.fontSize,
          lineHeight: selectTriggerVars.sizeLarge.enabled.value.lineHeight,

          [breakpoints.up("lg")]: {
            fontSize: selectTriggerVars.sizeMedium.enabled.value.fontSize,
            lineHeight: selectTriggerVars.sizeMedium.enabled.value.lineHeight,
          },
        },
        placeholder: {
          fontSize: selectTriggerVars.sizeLarge.enabled.placeholder.fontSize,
          lineHeight: selectTriggerVars.sizeLarge.enabled.placeholder.lineHeight,

          [breakpoints.up("lg")]: {
            fontSize: selectTriggerVars.sizeMedium.enabled.placeholder.fontSize,
            lineHeight: selectTriggerVars.sizeMedium.enabled.placeholder.lineHeight,
          },
        },
        prefixText: {
          fontSize: selectTriggerVars.sizeLarge.enabled.prefixText.fontSize,
          lineHeight: selectTriggerVars.sizeLarge.enabled.prefixText.lineHeight,

          [breakpoints.up("lg")]: {
            fontSize: selectTriggerVars.sizeMedium.enabled.prefixText.fontSize,
            lineHeight: selectTriggerVars.sizeMedium.enabled.prefixText.lineHeight,
          },
        },
        prefixIcon: {
          width: selectTriggerVars.sizeLarge.enabled.prefixIcon.size,
          height: selectTriggerVars.sizeLarge.enabled.prefixIcon.size,

          [breakpoints.up("lg")]: {
            width: selectTriggerVars.sizeMedium.enabled.prefixIcon.size,
            height: selectTriggerVars.sizeMedium.enabled.prefixIcon.size,
          },
        },
        suffixIcon: {
          width: selectTriggerVars.sizeLarge.enabled.suffixIcon.size,
          height: selectTriggerVars.sizeLarge.enabled.suffixIcon.size,

          [breakpoints.up("lg")]: {
            width: selectTriggerVars.sizeMedium.enabled.suffixIcon.size,
            height: selectTriggerVars.sizeMedium.enabled.suffixIcon.size,
          },
        },
      },
    },
  },
  defaultVariants: {
    size: "large",
  },
  metadata: {
    variants: {
      size: {
        ...selectTriggerSpec.data.schema.variants.size,
        values: {
          ...selectTriggerSpec.data.schema.variants.size.values,
          responsive: {
            description:
              "뷰포트 너비에 따라 적용되는 사이즈가 달라집니다. Breakpoint `lg` 미만에서는 `large`, `lg` 이상에서는 `medium`으로 적용됩니다.",
          },
        },
      },
    },
  },
});

/**
 * Select — the floating listbox container. `content`/`positioner`/`scrollArea`
 * hold the popup surface and scrolling; `group`/`groupLabel` (and the `divider`
 * between groups) organize the options folded in from `selectItem`.
 */
export const select = defineSlotRecipe({
  name: "select",
  slots: ["positioner", "content", "scrollArea", "group", "groupLabel"],
  base: {
    positioner: {
      // helps the listbox open at the top of the stackflow stack; it won't have any AppScreen on top of it
      "--select-z-index": "99999",
      zIndex: "calc(var(--select-z-index) + var(--z-index-offset, 0))",
      outline: "none",
    },
    content: {
      width: `var(${SELECT_REFERENCE_WIDTH})`,
      borderRadius: selectVars.base.enabled.root.cornerRadius,
      background: selectVars.base.enabled.root.color,
      boxShadow: selectVars.base.enabled.root.shadow,
      transformOrigin: `var(${SELECT_TRANSFORM_ORIGIN})`,

      overflow: "hidden",

      [pseudo(open)]: {
        ...enterAnimation({
          scale: selectVars.base.enabled.root.enterScale,
          opacity: selectVars.base.enabled.root.enterOpacity,
          duration: selectVars.base.enabled.root.enterDuration,
          timingFunction: selectVars.base.enabled.root.enterTimingFunction,
        }),
      },

      [pseudo(not(open))]: {
        ...exitAnimation({
          scale: selectVars.base.enabled.root.exitScale,
          opacity: selectVars.base.enabled.root.exitOpacity,
          duration: selectVars.base.enabled.root.exitDuration,
          timingFunction: selectVars.base.enabled.root.exitTimingFunction,
        }),
      },

      [pseudo("[data-instant]")]: {
        animationDuration: "0s",
      },

      [pseudo(hidden)]: {
        display: "none !important",
      },

      [pseudo(focus)]: {
        outline: "none",
      },
    },
    scrollArea: {
      overflowY: "auto",
      maxHeight: `min(${selectVars.base.enabled.root.maxHeight}, var(${SELECT_AVAILABLE_HEIGHT}, ${selectVars.base.enabled.root.maxHeight}))`,
      boxSizing: "border-box",

      paddingBlock: selectVars.base.enabled.root.paddingY,

      display: "flex",
      flexDirection: "column",
      gap: selectVars.base.enabled.root.gap,
    },
    group: {
      display: "flex",
      flexDirection: "column",

      "& + &::before": {
        content: '""',
        display: "block",
        marginInline: selectVars.base.enabled.divider.marginX,
        marginBottom: selectVars.base.enabled.root.gap,
        height: selectVars.base.enabled.divider.height,
        flexShrink: 0,
        backgroundColor: selectVars.base.enabled.divider.color,
      },
    },
    groupLabel: {
      color: selectVars.base.enabled.groupLabel.color,
    },
  },
  variants: {
    size: {
      large: {
        groupLabel: {
          paddingBlock: selectVars.sizeLarge.enabled.groupLabel.paddingY,
          paddingInline: selectVars.sizeLarge.enabled.groupLabel.paddingX,

          fontSize: selectVars.sizeLarge.enabled.groupLabel.fontSize,
          lineHeight: selectVars.sizeLarge.enabled.groupLabel.lineHeight,
          fontWeight: selectVars.sizeLarge.enabled.groupLabel.fontWeight,
        },
      },
      medium: {
        groupLabel: {
          paddingBlock: selectVars.sizeMedium.enabled.groupLabel.paddingY,
          paddingInline: selectVars.sizeMedium.enabled.groupLabel.paddingX,

          fontSize: selectVars.sizeMedium.enabled.groupLabel.fontSize,
          lineHeight: selectVars.sizeMedium.enabled.groupLabel.lineHeight,
          fontWeight: selectVars.sizeMedium.enabled.groupLabel.fontWeight,
        },
      },
      responsive: {
        groupLabel: {
          paddingBlock: selectVars.sizeLarge.enabled.groupLabel.paddingY,
          paddingInline: selectVars.sizeLarge.enabled.groupLabel.paddingX,

          fontSize: selectVars.sizeLarge.enabled.groupLabel.fontSize,
          lineHeight: selectVars.sizeLarge.enabled.groupLabel.lineHeight,
          fontWeight: selectVars.sizeLarge.enabled.groupLabel.fontWeight,

          [breakpoints.up("lg")]: {
            paddingBlock: selectVars.sizeMedium.enabled.groupLabel.paddingY,
            paddingInline: selectVars.sizeMedium.enabled.groupLabel.paddingX,

            fontSize: selectVars.sizeMedium.enabled.groupLabel.fontSize,
            lineHeight: selectVars.sizeMedium.enabled.groupLabel.lineHeight,
            fontWeight: selectVars.sizeMedium.enabled.groupLabel.fontWeight,
          },
        },
      },
    },
  },
  defaultVariants: {
    size: "large",
  },
  metadata: {
    variants: {
      size: {
        ...selectSpec.data.schema.variants.size,
        values: {
          ...selectSpec.data.schema.variants.size.values,
          responsive: {
            description:
              "뷰포트 너비에 따라 적용되는 사이즈가 달라집니다. Breakpoint `lg` 미만에서는 `large`, `lg` 이상에서는 `medium`으로 적용됩니다.",
          },
        },
      },
    },
  },
});

/**
 * Select item — a single option row. Its prefix icon folds into `root`
 * via the icon utilities (a select option has no independent use or `tone`);
 * `indicator` marks the selected option.
 */
export const selectItem = defineSlotRecipe({
  name: "select-item",
  slots: ["root", "body", "label", "description", "indicator"],
  base: {
    root: {
      position: "relative",
      scrollMarginBlock: selectVars.base.enabled.root.paddingY,

      display: "flex",
      alignItems: "center",

      paddingInline: selectItemVars.base.enabled.root.paddingX,

      outline: "none",
      cursor: "default",
      userSelect: "none",
      background: "none",
      border: "none",
      fontFamily: "inherit",
      color: "inherit",
      textDecoration: "none",
      margin: 0,
      textAlign: "start",

      isolation: "isolate",

      ...prefixIcon({
        color: selectItemVars.base.enabled.prefixIcon.color,
      }),

      "&::before": {
        content: '""',
        position: "absolute",
        inset: 0,
        zIndex: -1,

        transition: `background-color ${selectItemVars.base.enabled.root.colorDuration} ${selectItemVars.base.enabled.root.colorTimingFunction}, inset-inline ${selectItemVars.base.enabled.root.marginDuration} ${selectItemVars.base.enabled.root.marginTimingFunction}`,
      },

      [pseudo(not(disabled), active, before)]: highlightedItem,
      [pseudo(not(disabled), "[data-highlighted]", before)]: highlightedItem,

      [pseudo(disabled)]: {
        cursor: "not-allowed",

        ...prefixIcon({
          color: selectItemVars.base.disabled.prefixIcon.color,
        }),
      },
    },
    body: {
      display: "flex",
      flexDirection: "column",

      flexGrow: 1,
      gap: selectItemVars.base.enabled.body.gap,
    },
    label: {
      fontWeight: selectItemVars.base.enabled.label.fontWeight,
      color: selectItemVars.base.enabled.label.color,

      [pseudo(disabled)]: {
        color: selectItemVars.base.disabled.label.color,
      },
    },
    description: {
      fontWeight: selectItemVars.base.enabled.description.fontWeight,
      color: selectItemVars.base.enabled.description.color,

      [pseudo(disabled)]: {
        color: selectItemVars.base.disabled.description.color,
      },
    },
    indicator: {
      flexShrink: 0,

      color: selectItemVars.base.enabled.indicator.color,

      [pseudo(disabled)]: {
        color: selectItemVars.base.disabled.indicator.color,
      },
    },
  },
  variants: {
    size: {
      large: {
        root: {
          paddingBlock: selectItemVars.sizeLarge.enabled.root.paddingY,

          gap: selectItemVars.sizeLarge.enabled.root.gap,

          ...prefixIcon({
            size: selectItemVars.sizeLarge.enabled.prefixIcon.size,
          }),
        },
        label: {
          fontSize: selectItemVars.sizeLarge.enabled.label.fontSize,
          lineHeight: selectItemVars.sizeLarge.enabled.label.lineHeight,
        },
        description: {
          fontSize: selectItemVars.sizeLarge.enabled.description.fontSize,
          lineHeight: selectItemVars.sizeLarge.enabled.description.lineHeight,
        },
        indicator: {
          width: selectItemVars.sizeLarge.enabled.indicator.size,
          height: selectItemVars.sizeLarge.enabled.indicator.size,
        },
      },
      medium: {
        root: {
          paddingBlock: selectItemVars.sizeMedium.enabled.root.paddingY,

          gap: selectItemVars.sizeMedium.enabled.root.gap,

          ...prefixIcon({
            size: selectItemVars.sizeMedium.enabled.prefixIcon.size,
          }),
        },
        label: {
          fontSize: selectItemVars.sizeMedium.enabled.label.fontSize,
          lineHeight: selectItemVars.sizeMedium.enabled.label.lineHeight,
        },
        description: {
          fontSize: selectItemVars.sizeMedium.enabled.description.fontSize,
          lineHeight: selectItemVars.sizeMedium.enabled.description.lineHeight,
        },
        indicator: {
          width: selectItemVars.sizeMedium.enabled.indicator.size,
          height: selectItemVars.sizeMedium.enabled.indicator.size,
        },
      },
      responsive: {
        root: {
          paddingBlock: selectItemVars.sizeLarge.enabled.root.paddingY,

          gap: selectItemVars.sizeLarge.enabled.root.gap,

          ...prefixIcon({
            size: selectItemVars.sizeLarge.enabled.prefixIcon.size,
          }),

          [breakpoints.up("lg")]: {
            paddingBlock: selectItemVars.sizeMedium.enabled.root.paddingY,

            gap: selectItemVars.sizeMedium.enabled.root.gap,

            ...prefixIcon({
              size: selectItemVars.sizeMedium.enabled.prefixIcon.size,
            }),
          },
        },
        label: {
          fontSize: selectItemVars.sizeLarge.enabled.label.fontSize,
          lineHeight: selectItemVars.sizeLarge.enabled.label.lineHeight,

          [breakpoints.up("lg")]: {
            fontSize: selectItemVars.sizeMedium.enabled.label.fontSize,
            lineHeight: selectItemVars.sizeMedium.enabled.label.lineHeight,
          },
        },
        description: {
          fontSize: selectItemVars.sizeLarge.enabled.description.fontSize,
          lineHeight: selectItemVars.sizeLarge.enabled.description.lineHeight,

          [breakpoints.up("lg")]: {
            fontSize: selectItemVars.sizeMedium.enabled.description.fontSize,
            lineHeight: selectItemVars.sizeMedium.enabled.description.lineHeight,
          },
        },
        indicator: {
          width: selectItemVars.sizeLarge.enabled.indicator.size,
          height: selectItemVars.sizeLarge.enabled.indicator.size,

          [breakpoints.up("lg")]: {
            width: selectItemVars.sizeMedium.enabled.indicator.size,
            height: selectItemVars.sizeMedium.enabled.indicator.size,
          },
        },
      },
    },
  },
  defaultVariants: {
    size: "large",
  },
  metadata: {
    variants: {
      size: {
        ...selectItemSpec.data.schema.variants.size,
        values: {
          ...selectItemSpec.data.schema.variants.size.values,
          responsive: {
            description:
              "뷰포트 너비에 따라 적용되는 사이즈가 달라집니다. Breakpoint `lg` 미만에서는 `large`, `lg` 이상에서는 `medium`으로 적용됩니다.",
          },
        },
      },
    },
  },
});

import selectSpec from "@seed-design/rootage-artifacts/components/select";
import selectTriggerSpec from "@seed-design/rootage-artifacts/components/select-trigger";
import selectItemSpec from "@seed-design/rootage-artifacts/components/select-item";
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
import { breakpoints } from "../utils/breakpoint";

const SELECT_TRANSFORM_ORIGIN = "--seed-select-transform-origin";
const SELECT_AVAILABLE_HEIGHT = "--seed-select-available-height";
const SELECT_REFERENCE_WIDTH = "--seed-select-reference-width";

export const selectTrigger = defineSlotRecipe({
  name: "select-trigger",
  slots: ["root", "value", "placeholder", "prefixIcon", "suffixIcon"],
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

      backgroundColor: selectTriggerVars.base.rest.root.color,

      boxShadow: `inset 0 0 0 ${selectTriggerVars.base.rest.root.strokeWidth} ${selectTriggerVars.base.rest.root.strokeColor}`,

      transition: `background-color ${selectTriggerVars.base.rest.root.colorDuration} ${selectTriggerVars.base.rest.root.colorTimingFunction}, ${FOCUS_RING_TRANSITION}`,

      "&::after": {
        content: '""',
        position: "absolute",
        inset: 0,
        borderRadius: "inherit",
        borderStyle: "solid",
        borderColor: "transparent",
        borderWidth: selectTriggerVars.base.invalid.root.strokeWidth,

        transition: `border-color ${selectTriggerVars.base.rest.root.strokeDuration} ${selectTriggerVars.base.rest.root.strokeTimingFunction}`,

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
      fontWeight: selectTriggerVars.base.rest.value.fontWeight,

      color: selectTriggerVars.base.rest.value.color,

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
      fontWeight: selectTriggerVars.base.rest.placeholder.fontWeight,

      color: selectTriggerVars.base.rest.placeholder.color,

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
    prefixIcon: {
      flexShrink: 0,

      color: selectTriggerVars.base.rest.prefixIcon.color,

      pointerEvents: "none",

      [pseudo("[data-disabled]")]: {
        color: selectTriggerVars.base.disabled.prefixIcon.color,
      },
    },
    suffixIcon: {
      flexShrink: 0,

      color: selectTriggerVars.base.rest.suffixIcon.color,

      pointerEvents: "none",

      transform: "rotate(0deg)",
      transition: `transform ${selectTriggerVars.base.rest.suffixIcon.closeRotateDuration} ${selectTriggerVars.base.rest.suffixIcon.closeRotateTimingFunction}`,

      [pseudo(open)]: {
        transform: "rotate(180deg)",
        transition: `transform ${selectTriggerVars.base.rest.suffixIcon.openRotateDuration} ${selectTriggerVars.base.rest.suffixIcon.openRotateTimingFunction}`,
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
          height: selectTriggerVars.sizeLarge.rest.root.height,
          gap: selectTriggerVars.sizeLarge.rest.root.gap,
          paddingInline: selectTriggerVars.sizeLarge.rest.root.paddingX,
          borderRadius: selectTriggerVars.sizeLarge.rest.root.cornerRadius,
        },
        value: {
          fontSize: selectTriggerVars.sizeLarge.rest.value.fontSize,
          lineHeight: selectTriggerVars.sizeLarge.rest.value.lineHeight,
        },
        placeholder: {
          fontSize: selectTriggerVars.sizeLarge.rest.placeholder.fontSize,
          lineHeight: selectTriggerVars.sizeLarge.rest.placeholder.lineHeight,
        },
        prefixIcon: {
          width: selectTriggerVars.sizeLarge.rest.prefixIcon.size,
          height: selectTriggerVars.sizeLarge.rest.prefixIcon.size,
        },
        suffixIcon: {
          width: selectTriggerVars.sizeLarge.rest.suffixIcon.size,
          height: selectTriggerVars.sizeLarge.rest.suffixIcon.size,
        },
      },
      medium: {
        root: {
          height: selectTriggerVars.sizeMedium.rest.root.height,
          gap: selectTriggerVars.sizeMedium.rest.root.gap,
          paddingInline: selectTriggerVars.sizeMedium.rest.root.paddingX,
          borderRadius: selectTriggerVars.sizeMedium.rest.root.cornerRadius,
        },
        value: {
          fontSize: selectTriggerVars.sizeMedium.rest.value.fontSize,
          lineHeight: selectTriggerVars.sizeMedium.rest.value.lineHeight,
        },
        placeholder: {
          fontSize: selectTriggerVars.sizeMedium.rest.placeholder.fontSize,
          lineHeight: selectTriggerVars.sizeMedium.rest.placeholder.lineHeight,
        },
        prefixIcon: {
          width: selectTriggerVars.sizeMedium.rest.prefixIcon.size,
          height: selectTriggerVars.sizeMedium.rest.prefixIcon.size,
        },
        suffixIcon: {
          width: selectTriggerVars.sizeMedium.rest.suffixIcon.size,
          height: selectTriggerVars.sizeMedium.rest.suffixIcon.size,
        },
      },
      responsive: {
        root: {
          height: selectTriggerVars.sizeLarge.rest.root.height,
          gap: selectTriggerVars.sizeLarge.rest.root.gap,
          paddingInline: selectTriggerVars.sizeLarge.rest.root.paddingX,
          borderRadius: selectTriggerVars.sizeLarge.rest.root.cornerRadius,

          [breakpoints.up("lg")]: {
            height: selectTriggerVars.sizeMedium.rest.root.height,
            gap: selectTriggerVars.sizeMedium.rest.root.gap,
            paddingInline: selectTriggerVars.sizeMedium.rest.root.paddingX,
            borderRadius: selectTriggerVars.sizeMedium.rest.root.cornerRadius,
          },
        },
        value: {
          fontSize: selectTriggerVars.sizeLarge.rest.value.fontSize,
          lineHeight: selectTriggerVars.sizeLarge.rest.value.lineHeight,

          [breakpoints.up("lg")]: {
            fontSize: selectTriggerVars.sizeMedium.rest.value.fontSize,
            lineHeight: selectTriggerVars.sizeMedium.rest.value.lineHeight,
          },
        },
        placeholder: {
          fontSize: selectTriggerVars.sizeLarge.rest.placeholder.fontSize,
          lineHeight: selectTriggerVars.sizeLarge.rest.placeholder.lineHeight,

          [breakpoints.up("lg")]: {
            fontSize: selectTriggerVars.sizeMedium.rest.placeholder.fontSize,
            lineHeight: selectTriggerVars.sizeMedium.rest.placeholder.lineHeight,
          },
        },
        prefixIcon: {
          width: selectTriggerVars.sizeLarge.rest.prefixIcon.size,
          height: selectTriggerVars.sizeLarge.rest.prefixIcon.size,

          [breakpoints.up("lg")]: {
            width: selectTriggerVars.sizeMedium.rest.prefixIcon.size,
            height: selectTriggerVars.sizeMedium.rest.prefixIcon.size,
          },
        },
        suffixIcon: {
          width: selectTriggerVars.sizeLarge.rest.suffixIcon.size,
          height: selectTriggerVars.sizeLarge.rest.suffixIcon.size,

          [breakpoints.up("lg")]: {
            width: selectTriggerVars.sizeMedium.rest.suffixIcon.size,
            height: selectTriggerVars.sizeMedium.rest.suffixIcon.size,
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
      borderRadius: selectVars.base.rest.root.cornerRadius,
      background: selectVars.base.rest.root.color,
      boxShadow: selectVars.base.rest.root.shadow,
      transformOrigin: `var(${SELECT_TRANSFORM_ORIGIN})`,

      overflow: "hidden",

      [pseudo(open)]: {
        ...enterAnimation({
          scale: selectVars.base.rest.root.enterScale,
          opacity: selectVars.base.rest.root.enterOpacity,
          duration: selectVars.base.rest.root.enterDuration,
          timingFunction: selectVars.base.rest.root.enterTimingFunction,
        }),
      },

      [pseudo(not(open))]: {
        ...exitAnimation({
          scale: selectVars.base.rest.root.exitScale,
          opacity: selectVars.base.rest.root.exitOpacity,
          duration: selectVars.base.rest.root.exitDuration,
          timingFunction: selectVars.base.rest.root.exitTimingFunction,
        }),
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
      maxHeight: `min(${selectVars.base.rest.root.maxHeight}, var(${SELECT_AVAILABLE_HEIGHT}, ${selectVars.base.rest.root.maxHeight}))`,
      boxSizing: "border-box",

      paddingBlock: selectVars.base.rest.root.paddingY,

      display: "flex",
      flexDirection: "column",
      gap: selectVars.base.rest.root.gap,
    },
    group: {
      display: "flex",
      flexDirection: "column",

      "& + &::before": {
        content: '""',
        display: "block",
        marginInline: selectVars.base.rest.divider.marginX,
        marginBottom: selectVars.base.rest.root.gap,
        height: selectVars.base.rest.divider.height,
        flexShrink: 0,
        backgroundColor: selectVars.base.rest.divider.color,
      },
    },
    groupLabel: {
      color: selectVars.base.rest.groupLabel.color,
    },
  },
  variants: {
    size: {
      large: {
        groupLabel: {
          paddingBlock: selectVars.sizeLarge.rest.groupLabel.paddingY,
          paddingInline: selectVars.sizeLarge.rest.groupLabel.paddingX,

          fontSize: selectVars.sizeLarge.rest.groupLabel.fontSize,
          lineHeight: selectVars.sizeLarge.rest.groupLabel.lineHeight,
          fontWeight: selectVars.sizeLarge.rest.groupLabel.fontWeight,
        },
      },
      medium: {
        groupLabel: {
          paddingBlock: selectVars.sizeMedium.rest.groupLabel.paddingY,
          paddingInline: selectVars.sizeMedium.rest.groupLabel.paddingX,

          fontSize: selectVars.sizeMedium.rest.groupLabel.fontSize,
          lineHeight: selectVars.sizeMedium.rest.groupLabel.lineHeight,
          fontWeight: selectVars.sizeMedium.rest.groupLabel.fontWeight,
        },
      },
      responsive: {
        groupLabel: {
          paddingBlock: selectVars.sizeLarge.rest.groupLabel.paddingY,
          paddingInline: selectVars.sizeLarge.rest.groupLabel.paddingX,

          fontSize: selectVars.sizeLarge.rest.groupLabel.fontSize,
          lineHeight: selectVars.sizeLarge.rest.groupLabel.lineHeight,
          fontWeight: selectVars.sizeLarge.rest.groupLabel.fontWeight,

          [breakpoints.up("lg")]: {
            paddingBlock: selectVars.sizeMedium.rest.groupLabel.paddingY,
            paddingInline: selectVars.sizeMedium.rest.groupLabel.paddingX,

            fontSize: selectVars.sizeMedium.rest.groupLabel.fontSize,
            lineHeight: selectVars.sizeMedium.rest.groupLabel.lineHeight,
            fontWeight: selectVars.sizeMedium.rest.groupLabel.fontWeight,
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

export const selectItem = defineSlotRecipe({
  name: "select-item",
  slots: ["root", "prefixIcon", "body", "label", "description", "indicator"],
  base: {
    root: {
      position: "relative",
      scrollMarginBlock: selectVars.base.rest.root.paddingY,

      display: "flex",
      alignItems: "center",

      paddingInline: selectItemVars.base.rest.root.paddingX,

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

      "&::before": {
        content: '""',
        position: "absolute",
        inset: 0,
        zIndex: -1,

        borderRadius: selectItemVars.base.rest.root.cornerRadius,

        transition: `background-color ${selectItemVars.base.rest.root.colorDuration} ${selectItemVars.base.rest.root.colorTimingFunction}, inset-inline ${selectItemVars.base.rest.root.marginDuration} ${selectItemVars.base.rest.root.marginTimingFunction}`,
      },

      // Active-option / pressed background. In a select-only combobox the list items
      // never receive real DOM focus (focus stays on the combobox via
      // `aria-activedescendant`), so the highlight is keyed off `[data-highlighted]`
      // rather than `:focus-visible`. That single active option is moved by both keyboard
      // navigation and pointer hover, so the highlight always tracks exactly one option —
      // never two. `:active` layers press feedback on top; on touch,
      // where there is no hover, it is the only pointer feedback an option gets.
      [pseudo(not(disabled), active, before)]: {
        backgroundColor: selectItemVars.base.pressed.root.color,
        insetInline: selectItemVars.base.pressed.root.marginX,
      },
      [pseudo(not(disabled), "[data-highlighted]", before)]: {
        backgroundColor: selectItemVars.base.pressed.root.color,
        insetInline: selectItemVars.base.pressed.root.marginX,
      },

      [pseudo(disabled)]: {
        cursor: "not-allowed",
      },
    },
    prefixIcon: {
      flexShrink: 0,

      color: selectItemVars.base.rest.prefixIcon.color,

      [pseudo(disabled)]: {
        color: selectItemVars.base.disabled.prefixIcon.color,
      },
    },
    body: {
      display: "flex",
      flexDirection: "column",

      flexGrow: 1,
      gap: selectItemVars.base.rest.body.gap,
    },
    label: {
      fontWeight: selectItemVars.base.rest.label.fontWeight,
      color: selectItemVars.base.rest.label.color,

      [pseudo(disabled)]: {
        color: selectItemVars.base.disabled.label.color,
      },
    },
    description: {
      fontWeight: selectItemVars.base.rest.description.fontWeight,
      color: selectItemVars.base.rest.description.color,

      [pseudo(disabled)]: {
        color: selectItemVars.base.disabled.description.color,
      },
    },
    indicator: {
      flexShrink: 0,

      color: selectItemVars.base.rest.indicator.color,

      [pseudo(disabled)]: {
        color: selectItemVars.base.disabled.indicator.color,
      },
    },
  },
  variants: {
    size: {
      large: {
        root: {
          paddingBlock: selectItemVars.sizeLarge.rest.root.paddingY,

          gap: selectItemVars.sizeLarge.rest.root.gap,
        },
        prefixIcon: {
          width: selectItemVars.sizeLarge.rest.prefixIcon.size,
          height: selectItemVars.sizeLarge.rest.prefixIcon.size,
        },
        label: {
          fontSize: selectItemVars.sizeLarge.rest.label.fontSize,
          lineHeight: selectItemVars.sizeLarge.rest.label.lineHeight,
        },
        description: {
          fontSize: selectItemVars.sizeLarge.rest.description.fontSize,
          lineHeight: selectItemVars.sizeLarge.rest.description.lineHeight,
        },
        indicator: {
          width: selectItemVars.sizeLarge.rest.indicator.size,
          height: selectItemVars.sizeLarge.rest.indicator.size,
        },
      },
      medium: {
        root: {
          paddingBlock: selectItemVars.sizeMedium.rest.root.paddingY,

          gap: selectItemVars.sizeMedium.rest.root.gap,
        },
        prefixIcon: {
          width: selectItemVars.sizeMedium.rest.prefixIcon.size,
          height: selectItemVars.sizeMedium.rest.prefixIcon.size,
        },
        label: {
          fontSize: selectItemVars.sizeMedium.rest.label.fontSize,
          lineHeight: selectItemVars.sizeMedium.rest.label.lineHeight,
        },
        description: {
          fontSize: selectItemVars.sizeMedium.rest.description.fontSize,
          lineHeight: selectItemVars.sizeMedium.rest.description.lineHeight,
        },
        indicator: {
          width: selectItemVars.sizeMedium.rest.indicator.size,
          height: selectItemVars.sizeMedium.rest.indicator.size,
        },
      },
      responsive: {
        root: {
          paddingBlock: selectItemVars.sizeLarge.rest.root.paddingY,

          gap: selectItemVars.sizeLarge.rest.root.gap,

          [breakpoints.up("lg")]: {
            paddingBlock: selectItemVars.sizeMedium.rest.root.paddingY,

            gap: selectItemVars.sizeMedium.rest.root.gap,
          },
        },
        prefixIcon: {
          width: selectItemVars.sizeLarge.rest.prefixIcon.size,
          height: selectItemVars.sizeLarge.rest.prefixIcon.size,

          [breakpoints.up("lg")]: {
            width: selectItemVars.sizeMedium.rest.prefixIcon.size,
            height: selectItemVars.sizeMedium.rest.prefixIcon.size,
          },
        },
        label: {
          fontSize: selectItemVars.sizeLarge.rest.label.fontSize,
          lineHeight: selectItemVars.sizeLarge.rest.label.lineHeight,

          [breakpoints.up("lg")]: {
            fontSize: selectItemVars.sizeMedium.rest.label.fontSize,
            lineHeight: selectItemVars.sizeMedium.rest.label.lineHeight,
          },
        },
        description: {
          fontSize: selectItemVars.sizeLarge.rest.description.fontSize,
          lineHeight: selectItemVars.sizeLarge.rest.description.lineHeight,

          [breakpoints.up("lg")]: {
            fontSize: selectItemVars.sizeMedium.rest.description.fontSize,
            lineHeight: selectItemVars.sizeMedium.rest.description.lineHeight,
          },
        },
        indicator: {
          width: selectItemVars.sizeLarge.rest.indicator.size,
          height: selectItemVars.sizeLarge.rest.indicator.size,

          [breakpoints.up("lg")]: {
            width: selectItemVars.sizeMedium.rest.indicator.size,
            height: selectItemVars.sizeMedium.rest.indicator.size,
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

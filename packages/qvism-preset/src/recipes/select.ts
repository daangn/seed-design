import selectSpec from "@seed-design/rootage-artifacts/components/select.json" with {
  type: "json",
};
import { select as selectVars } from "../vars/component";
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
import { onlyIcon, prefixIcon, suffixIcon } from "../utils/icon";
import { breakpoints } from "../utils/breakpoint";

const SELECT_TRANSFORM_ORIGIN = "--seed-select-transform-origin";
const SELECT_AVAILABLE_HEIGHT = "--seed-select-available-height";
const SELECT_REFERENCE_WIDTH = "--seed-select-reference-width";

// Active-option / pressed background. In a select-only combobox the list items
// never receive real DOM focus (focus stays on the combobox via
// `aria-activedescendant`), so the highlight is keyed off `[data-highlighted]`
// rather than `:focus-visible`. That single active option is moved by both keyboard
// navigation and pointer hover (focusItemOnHover), so the highlight always tracks
// exactly one option — never two. `:active` layers press feedback on top; on touch,
// where there is no hover, it is the only pointer feedback an option gets.
const highlightedItem = {
  backgroundColor: selectVars.base.pressed.item.color,
  left: selectVars.base.pressed.item.marginX,
  right: selectVars.base.pressed.item.marginX,
  borderRadius: selectVars.base.pressed.item.cornerRadius,
};

/**
 * Select — one recipe covering both surfaces of a select-only combobox:
 *
 * - The trigger (`root`, `value`, `placeholder`, `prefix/suffixIcon`) copies the
 *   Input Button visual, applied to a single `role="combobox"` button whose text
 *   content is the selected value. The Input Button uses an absolute-overlay
 *   `button` slot to allow rich value content; a select-only combobox instead
 *   contains its value directly, so the interactive layer is merged into `root`.
 * - The popup (`content` and the `item*` slots) copies the Menu container visual
 *   (floating listbox) and folds the option slots in, since a select option has no
 *   independent use or `tone`. Sizes are remapped to the Select vocabulary:
 *   `large` = Menu `medium`, `medium` = Menu `small`.
 */
export const select = defineSlotRecipe({
  name: "select",
  slots: [
    "root",
    "value",
    "placeholder",
    "prefixIcon",
    "suffixIcon",
    "positioner",
    "content",
    "scrollArea",
    "group",
    "groupLabel",
    "item",
    "itemBody",
    "itemLabel",
    "itemDescription",
    "itemIndicator",
  ],
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

      backgroundColor: selectVars.base.enabled.root.color,

      boxShadow: `inset 0 0 0 ${selectVars.base.enabled.root.strokeWidth} ${selectVars.base.enabled.root.strokeColor}`,

      transition: `background-color ${selectVars.base.enabled.root.colorDuration} ${selectVars.base.enabled.root.colorTimingFunction}, ${FOCUS_RING_TRANSITION}`,

      "&::after": {
        content: '""',
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        borderRadius: "inherit",
        borderStyle: "solid",
        borderColor: "transparent",
        borderWidth: selectVars.base.invalid.root.strokeWidth,

        transition: `border-color ${selectVars.base.enabled.root.strokeDuration} ${selectVars.base.enabled.root.strokeTimingFunction}`,

        pointerEvents: "none",
      },

      [pseudo("[data-disabled]")]: {
        cursor: "not-allowed",
        backgroundColor: selectVars.base.disabled.root.color,
      },

      [pseudo(not("[data-disabled]"), not(readOnly), engaged)]: {
        backgroundColor: selectVars.base.pressed.root.color,
      },

      [pseudo(readOnly, not("[data-disabled]"))]: {
        cursor: "default",
        backgroundColor: selectVars.base.readonly.root.color,
      },

      ...createFocusRingRestStyles(),
      [pseudo(focusVisible)]: createFocusRingStyles(),

      [pseudo(invalid, "::after")]: {
        borderWidth: selectVars.base.invalid.root.strokeWidth,
        borderColor: selectVars.base.invalid.root.strokeColor,
      },
    },
    value: {
      fontWeight: selectVars.base.enabled.value.fontWeight,

      color: selectVars.base.enabled.value.color,

      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      textAlign: "start",

      flexGrow: 1,

      pointerEvents: "none",

      [pseudo("[data-disabled]")]: {
        color: selectVars.base.disabled.value.color,
      },

      [pseudo(readOnly, not("[data-disabled]"))]: {
        color: selectVars.base.readonly.value.color,
      },
    },
    placeholder: {
      fontWeight: selectVars.base.enabled.placeholder.fontWeight,

      color: selectVars.base.enabled.placeholder.color,

      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      textAlign: "start",

      flexGrow: 1,

      pointerEvents: "none",

      [pseudo("[data-disabled]")]: {
        color: selectVars.base.disabled.placeholder.color,
      },

      [pseudo(readOnly, not("[data-disabled]"))]: {
        color: selectVars.base.readonly.placeholder.color,
      },
    },
    prefixIcon: {
      flexShrink: 0,

      color: selectVars.base.enabled.prefixIcon.color,

      pointerEvents: "none",

      [pseudo("[data-disabled]")]: {
        color: selectVars.base.disabled.prefixIcon.color,
      },
    },
    suffixIcon: {
      flexShrink: 0,

      color: selectVars.base.enabled.suffixIcon.color,

      pointerEvents: "none",

      transform: "rotate(0deg)",
      transition: `transform ${selectVars.base.enabled.suffixIcon.rotateDuration} ${selectVars.base.enabled.suffixIcon.rotateTimingFunction}`,

      [pseudo(open)]: {
        transform: "rotate(180deg)",
      },

      [pseudo("[data-disabled]")]: {
        color: selectVars.base.disabled.suffixIcon.color,
      },
    },
    positioner: {
      // helps the listbox open at the top of the stackflow stack; it won't have any AppScreen on top of it
      "--select-z-index": "99999",
      zIndex: "calc(var(--select-z-index) + var(--z-index-offset, 0))",
      outline: "none",
    },
    content: {
      borderRadius: selectVars.base.enabled.content.cornerRadius,
      background: selectVars.base.enabled.content.color,
      boxShadow: selectVars.base.enabled.content.shadow,
      transformOrigin: `var(${SELECT_TRANSFORM_ORIGIN})`,

      overflow: "hidden",

      [pseudo(open)]: {
        ...enterAnimation({
          scale: selectVars.base.enabled.content.enterScale,
          opacity: selectVars.base.enabled.content.enterOpacity,
          duration: selectVars.base.enabled.content.enterDuration,
          timingFunction: selectVars.base.enabled.content.enterTimingFunction,
        }),
      },

      [pseudo(not(open))]: {
        ...exitAnimation({
          scale: selectVars.base.enabled.content.exitScale,
          opacity: selectVars.base.enabled.content.exitOpacity,
          duration: selectVars.base.enabled.content.exitDuration,
          timingFunction: selectVars.base.enabled.content.exitTimingFunction,
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
      maxHeight: `min(${selectVars.base.enabled.content.maxHeight}, var(${SELECT_AVAILABLE_HEIGHT}, ${selectVars.base.enabled.content.maxHeight}))`,
      boxSizing: "border-box",

      paddingTop: selectVars.base.enabled.content.paddingY,
      paddingBottom: selectVars.base.enabled.content.paddingY,

      display: "flex",
      flexDirection: "column",
      gap: selectVars.base.enabled.content.gap,
    },
    group: {
      display: "flex",
      flexDirection: "column",

      "& + &::before": {
        content: '""',
        display: "block",
        marginLeft: selectVars.base.enabled.divider.marginX,
        marginRight: selectVars.base.enabled.divider.marginX,
        marginBottom: selectVars.base.enabled.content.gap,
        height: selectVars.base.enabled.divider.height,
        flexShrink: 0,
        backgroundColor: selectVars.base.enabled.divider.color,
      },
    },
    groupLabel: {
      color: selectVars.base.enabled.groupLabel.color,
    },
    item: {
      position: "relative",
      scrollMarginTop: selectVars.base.enabled.content.paddingY,
      scrollMarginBottom: selectVars.base.enabled.content.paddingY,

      display: "flex",
      alignItems: "center",

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
        color: selectVars.base.enabled.itemPrefixIcon.color,
      }),
      ...suffixIcon({
        color: selectVars.base.enabled.itemSuffixIcon.color,
      }),

      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: -1,

        transitionProperty: "background-color, left, right, border-radius",
        transitionDuration: selectVars.base.enabled.item.colorDuration,
        transitionTimingFunction: selectVars.base.enabled.item.colorTimingFunction,
      },

      [pseudo(not(disabled), active, before)]: highlightedItem,
      [pseudo(not(disabled), "[data-highlighted]", before)]: highlightedItem,

      [pseudo(disabled)]: {
        cursor: "not-allowed",

        ...prefixIcon({
          color: selectVars.base.disabled.itemPrefixIcon.color,
        }),

        ...suffixIcon({
          color: selectVars.base.disabled.itemSuffixIcon.color,
        }),
      },
    },
    itemBody: {
      display: "flex",
      flexDirection: "column",

      flexGrow: 1,
      gap: selectVars.base.enabled.itemBody.gap,
    },
    itemLabel: {
      fontWeight: selectVars.base.enabled.itemLabel.fontWeight,
      color: selectVars.base.enabled.itemLabel.color,

      [pseudo(disabled)]: {
        color: selectVars.base.disabled.itemLabel.color,
      },
    },
    itemDescription: {
      fontWeight: selectVars.base.enabled.itemDescription.fontWeight,
      color: selectVars.base.enabled.itemDescription.color,

      [pseudo(disabled)]: {
        color: selectVars.base.disabled.itemDescription.color,
      },
    },
    itemIndicator: {
      flexShrink: 0,

      ...onlyIcon({
        color: selectVars.base.enabled.itemIndicator.color,
      }),

      [pseudo(disabled)]: onlyIcon({
        color: selectVars.base.disabled.itemIndicator.color,
      }),
    },
  },
  variants: {
    size: {
      large: {
        root: {
          height: selectVars.sizeLarge.enabled.root.height,
          gap: selectVars.sizeLarge.enabled.root.gap,
          paddingLeft: selectVars.sizeLarge.enabled.root.paddingX,
          paddingRight: selectVars.sizeLarge.enabled.root.paddingX,
          borderRadius: selectVars.sizeLarge.enabled.root.cornerRadius,
        },
        value: {
          fontSize: selectVars.sizeLarge.enabled.value.fontSize,
          lineHeight: selectVars.sizeLarge.enabled.value.lineHeight,
        },
        placeholder: {
          fontSize: selectVars.sizeLarge.enabled.placeholder.fontSize,
          lineHeight: selectVars.sizeLarge.enabled.placeholder.lineHeight,
        },
        prefixIcon: {
          width: selectVars.sizeLarge.enabled.prefixIcon.size,
          height: selectVars.sizeLarge.enabled.prefixIcon.size,
        },
        suffixIcon: {
          width: selectVars.sizeLarge.enabled.suffixIcon.size,
          height: selectVars.sizeLarge.enabled.suffixIcon.size,
        },
        content: {
          width: `var(${SELECT_REFERENCE_WIDTH}, ${selectVars.sizeLarge.enabled.content.width})`,
        },
        groupLabel: {
          paddingTop: selectVars.sizeLarge.enabled.groupLabel.paddingY,
          paddingBottom: selectVars.sizeLarge.enabled.groupLabel.paddingY,
          paddingLeft: selectVars.sizeLarge.enabled.groupLabel.paddingX,
          paddingRight: selectVars.sizeLarge.enabled.groupLabel.paddingX,

          fontSize: selectVars.sizeLarge.enabled.groupLabel.fontSize,
          lineHeight: selectVars.sizeLarge.enabled.groupLabel.lineHeight,
          fontWeight: selectVars.sizeLarge.enabled.groupLabel.fontWeight,
        },
        item: {
          paddingTop: selectVars.sizeLarge.enabled.item.paddingY,
          paddingBottom: selectVars.sizeLarge.enabled.item.paddingY,
          paddingLeft: selectVars.sizeLarge.enabled.item.paddingX,
          paddingRight: selectVars.sizeLarge.enabled.item.paddingX,

          gap: selectVars.sizeLarge.enabled.item.gap,

          ...prefixIcon({
            size: selectVars.sizeLarge.enabled.itemPrefixIcon.size,
          }),

          ...suffixIcon({
            size: selectVars.sizeLarge.enabled.itemSuffixIcon.size,
          }),
        },
        itemLabel: {
          fontSize: selectVars.sizeLarge.enabled.itemLabel.fontSize,
          lineHeight: selectVars.sizeLarge.enabled.itemLabel.lineHeight,
        },
        itemDescription: {
          fontSize: selectVars.sizeLarge.enabled.itemDescription.fontSize,
          lineHeight: selectVars.sizeLarge.enabled.itemDescription.lineHeight,
        },
        itemIndicator: onlyIcon({
          size: selectVars.sizeLarge.enabled.itemIndicator.size,
        }),
      },
      medium: {
        root: {
          height: selectVars.sizeMedium.enabled.root.height,
          gap: selectVars.sizeMedium.enabled.root.gap,
          paddingLeft: selectVars.sizeMedium.enabled.root.paddingX,
          paddingRight: selectVars.sizeMedium.enabled.root.paddingX,
          borderRadius: selectVars.sizeMedium.enabled.root.cornerRadius,
        },
        value: {
          fontSize: selectVars.sizeMedium.enabled.value.fontSize,
          lineHeight: selectVars.sizeMedium.enabled.value.lineHeight,
        },
        placeholder: {
          fontSize: selectVars.sizeMedium.enabled.placeholder.fontSize,
          lineHeight: selectVars.sizeMedium.enabled.placeholder.lineHeight,
        },
        prefixIcon: {
          width: selectVars.sizeMedium.enabled.prefixIcon.size,
          height: selectVars.sizeMedium.enabled.prefixIcon.size,
        },
        suffixIcon: {
          width: selectVars.sizeMedium.enabled.suffixIcon.size,
          height: selectVars.sizeMedium.enabled.suffixIcon.size,
        },
        content: {
          width: `var(${SELECT_REFERENCE_WIDTH}, ${selectVars.sizeMedium.enabled.content.width})`,
        },
        groupLabel: {
          paddingTop: selectVars.sizeMedium.enabled.groupLabel.paddingY,
          paddingBottom: selectVars.sizeMedium.enabled.groupLabel.paddingY,
          paddingLeft: selectVars.sizeMedium.enabled.groupLabel.paddingX,
          paddingRight: selectVars.sizeMedium.enabled.groupLabel.paddingX,

          fontSize: selectVars.sizeMedium.enabled.groupLabel.fontSize,
          lineHeight: selectVars.sizeMedium.enabled.groupLabel.lineHeight,
          fontWeight: selectVars.sizeMedium.enabled.groupLabel.fontWeight,
        },
        item: {
          paddingTop: selectVars.sizeMedium.enabled.item.paddingY,
          paddingBottom: selectVars.sizeMedium.enabled.item.paddingY,
          paddingLeft: selectVars.sizeMedium.enabled.item.paddingX,
          paddingRight: selectVars.sizeMedium.enabled.item.paddingX,

          gap: selectVars.sizeMedium.enabled.item.gap,

          ...prefixIcon({
            size: selectVars.sizeMedium.enabled.itemPrefixIcon.size,
          }),

          ...suffixIcon({
            size: selectVars.sizeMedium.enabled.itemSuffixIcon.size,
          }),
        },
        itemLabel: {
          fontSize: selectVars.sizeMedium.enabled.itemLabel.fontSize,
          lineHeight: selectVars.sizeMedium.enabled.itemLabel.lineHeight,
        },
        itemDescription: {
          fontSize: selectVars.sizeMedium.enabled.itemDescription.fontSize,
          lineHeight: selectVars.sizeMedium.enabled.itemDescription.lineHeight,
        },
        itemIndicator: onlyIcon({
          size: selectVars.sizeMedium.enabled.itemIndicator.size,
        }),
      },
      responsive: {
        root: {
          height: selectVars.sizeLarge.enabled.root.height,
          gap: selectVars.sizeLarge.enabled.root.gap,
          paddingLeft: selectVars.sizeLarge.enabled.root.paddingX,
          paddingRight: selectVars.sizeLarge.enabled.root.paddingX,
          borderRadius: selectVars.sizeLarge.enabled.root.cornerRadius,

          [breakpoints.up("lg")]: {
            height: selectVars.sizeMedium.enabled.root.height,
            gap: selectVars.sizeMedium.enabled.root.gap,
            paddingLeft: selectVars.sizeMedium.enabled.root.paddingX,
            paddingRight: selectVars.sizeMedium.enabled.root.paddingX,
            borderRadius: selectVars.sizeMedium.enabled.root.cornerRadius,
          },
        },
        value: {
          fontSize: selectVars.sizeLarge.enabled.value.fontSize,
          lineHeight: selectVars.sizeLarge.enabled.value.lineHeight,

          [breakpoints.up("lg")]: {
            fontSize: selectVars.sizeMedium.enabled.value.fontSize,
            lineHeight: selectVars.sizeMedium.enabled.value.lineHeight,
          },
        },
        placeholder: {
          fontSize: selectVars.sizeLarge.enabled.placeholder.fontSize,
          lineHeight: selectVars.sizeLarge.enabled.placeholder.lineHeight,

          [breakpoints.up("lg")]: {
            fontSize: selectVars.sizeMedium.enabled.placeholder.fontSize,
            lineHeight: selectVars.sizeMedium.enabled.placeholder.lineHeight,
          },
        },
        prefixIcon: {
          width: selectVars.sizeLarge.enabled.prefixIcon.size,
          height: selectVars.sizeLarge.enabled.prefixIcon.size,

          [breakpoints.up("lg")]: {
            width: selectVars.sizeMedium.enabled.prefixIcon.size,
            height: selectVars.sizeMedium.enabled.prefixIcon.size,
          },
        },
        suffixIcon: {
          width: selectVars.sizeLarge.enabled.suffixIcon.size,
          height: selectVars.sizeLarge.enabled.suffixIcon.size,

          [breakpoints.up("lg")]: {
            width: selectVars.sizeMedium.enabled.suffixIcon.size,
            height: selectVars.sizeMedium.enabled.suffixIcon.size,
          },
        },
        content: {
          width: `var(${SELECT_REFERENCE_WIDTH}, ${selectVars.sizeLarge.enabled.content.width})`,

          [breakpoints.up("lg")]: {
            width: `var(${SELECT_REFERENCE_WIDTH}, ${selectVars.sizeMedium.enabled.content.width})`,
          },
        },
        groupLabel: {
          paddingTop: selectVars.sizeLarge.enabled.groupLabel.paddingY,
          paddingBottom: selectVars.sizeLarge.enabled.groupLabel.paddingY,
          paddingLeft: selectVars.sizeLarge.enabled.groupLabel.paddingX,
          paddingRight: selectVars.sizeLarge.enabled.groupLabel.paddingX,

          fontSize: selectVars.sizeLarge.enabled.groupLabel.fontSize,
          lineHeight: selectVars.sizeLarge.enabled.groupLabel.lineHeight,
          fontWeight: selectVars.sizeLarge.enabled.groupLabel.fontWeight,

          [breakpoints.up("lg")]: {
            paddingTop: selectVars.sizeMedium.enabled.groupLabel.paddingY,
            paddingBottom: selectVars.sizeMedium.enabled.groupLabel.paddingY,
            paddingLeft: selectVars.sizeMedium.enabled.groupLabel.paddingX,
            paddingRight: selectVars.sizeMedium.enabled.groupLabel.paddingX,

            fontSize: selectVars.sizeMedium.enabled.groupLabel.fontSize,
            lineHeight: selectVars.sizeMedium.enabled.groupLabel.lineHeight,
            fontWeight: selectVars.sizeMedium.enabled.groupLabel.fontWeight,
          },
        },
        item: {
          paddingTop: selectVars.sizeLarge.enabled.item.paddingY,
          paddingBottom: selectVars.sizeLarge.enabled.item.paddingY,
          paddingLeft: selectVars.sizeLarge.enabled.item.paddingX,
          paddingRight: selectVars.sizeLarge.enabled.item.paddingX,

          gap: selectVars.sizeLarge.enabled.item.gap,

          ...prefixIcon({
            size: selectVars.sizeLarge.enabled.itemPrefixIcon.size,
          }),

          ...suffixIcon({
            size: selectVars.sizeLarge.enabled.itemSuffixIcon.size,
          }),

          [breakpoints.up("lg")]: {
            paddingTop: selectVars.sizeMedium.enabled.item.paddingY,
            paddingBottom: selectVars.sizeMedium.enabled.item.paddingY,
            paddingLeft: selectVars.sizeMedium.enabled.item.paddingX,
            paddingRight: selectVars.sizeMedium.enabled.item.paddingX,

            gap: selectVars.sizeMedium.enabled.item.gap,

            ...prefixIcon({
              size: selectVars.sizeMedium.enabled.itemPrefixIcon.size,
            }),

            ...suffixIcon({
              size: selectVars.sizeMedium.enabled.itemSuffixIcon.size,
            }),
          },
        },
        itemLabel: {
          fontSize: selectVars.sizeLarge.enabled.itemLabel.fontSize,
          lineHeight: selectVars.sizeLarge.enabled.itemLabel.lineHeight,

          [breakpoints.up("lg")]: {
            fontSize: selectVars.sizeMedium.enabled.itemLabel.fontSize,
            lineHeight: selectVars.sizeMedium.enabled.itemLabel.lineHeight,
          },
        },
        itemDescription: {
          fontSize: selectVars.sizeLarge.enabled.itemDescription.fontSize,
          lineHeight: selectVars.sizeLarge.enabled.itemDescription.lineHeight,

          [breakpoints.up("lg")]: {
            fontSize: selectVars.sizeMedium.enabled.itemDescription.fontSize,
            lineHeight: selectVars.sizeMedium.enabled.itemDescription.lineHeight,
          },
        },
        itemIndicator: {
          ...onlyIcon({
            size: selectVars.sizeLarge.enabled.itemIndicator.size,
          }),

          [breakpoints.up("lg")]: onlyIcon({
            size: selectVars.sizeMedium.enabled.itemIndicator.size,
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

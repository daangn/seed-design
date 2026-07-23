import { menuSheetItem as vars, menuSheet as rootVars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";
import { active, engaged, focusVisible, pseudo } from "../utils/pseudo";
import { prefixIcon } from "../utils/icon";
import {
  createPressScaleCounterRestStyles,
  createPressScaleCounterStyles,
  createPressScaleRestStyles,
  createPressScaleStyles,
  PRESS_SCALE_TRANSITION,
} from "../utils/press-scale";
import {
  createFocusRingRestStyles,
  createFocusRingStyles,
  FOCUS_RING_TRANSITION,
} from "../utils/focus-ring";
import spec from "@seed-design/rootage-artifacts/components/menu-sheet-item.json" with {
  type: "json",
};

const menuSheetItem = defineSlotRecipe({
  name: "menu-sheet-item",
  slots: ["root", "content", "label", "description"],
  base: {
    root: {
      display: "flex",
      alignItems: "center",

      minHeight: vars.base.enabled.root.minHeight,
      paddingInline: vars.base.enabled.root.paddingX,
      paddingBlock: vars.base.enabled.root.paddingY,
      gap: vars.base.enabled.root.gap,

      // iOS 15 has default margin on buttons
      margin: 0,

      border: "none",
      fontFamily: "inherit",

      // Both consumers render a real <button>, and the row's own background now
      // lives on ::before. Without this reset the UA `buttonface` fill paints on
      // the element itself, square-cornered, and shows past the pseudo's rounded
      // first/last-child corners.
      background: "none",

      // The row scales as a whole on press; the background and divider live on
      // ::before and cancel that scale, so they stay flush with the neighbouring
      // rows instead of opening gaps between them.
      position: "relative",
      isolation: "isolate",

      "&::before": {
        content: '""',
        position: "absolute",
        inset: 0,
        zIndex: -1,

        backgroundColor: vars.base.enabled.root.color,
        boxShadow: `inset 0 calc(-1 * ${rootVars.base.enabled.divider.strokeBottomWidth}) 0 ${rootVars.base.enabled.divider.strokeColor}`,

        ...createPressScaleCounterRestStyles(),
        transition: PRESS_SCALE_TRANSITION,
      },

      [pseudo(engaged, "::before")]: {
        backgroundColor: vars.base.pressed.root.color,
      },

      // The focus ring is an `outline`, so it is painted with whatever box it sits
      // on and inherits that box's scale. On the row itself it would shrink with
      // the content and detach inward from the fixed background; on this
      // counter-scaled layer it stays glued to it. ::after rather than ::before
      // because the background pseudo sits at `z-index: -1` — an inside ring there
      // would be occluded by the content.
      "&::after": {
        content: '""',
        position: "absolute",
        inset: 0,
        pointerEvents: "none",

        ...createFocusRingRestStyles({ position: "inside" }),
        transition: `${PRESS_SCALE_TRANSITION}, ${FOCUS_RING_TRANSITION}`,

        ...createPressScaleCounterRestStyles(),
      },

      [pseudo(focusVisible, "::after")]: createFocusRingStyles({ position: "inside" }),

      ...createPressScaleRestStyles(),
      [pseudo(active)]: createPressScaleStyles(),
      [pseudo(active, "::before")]: createPressScaleCounterStyles(),
      [pseudo(active, "::after")]: createPressScaleCounterStyles(),

      // The group's corners are rounded here rather than by the group's own
      // `overflow: hidden`, which is therefore redundant and could be dropped —
      // but only as long as the element itself paints nothing square, i.e. only
      // while the `background: none` reset above stays. Verify both together.
      "&:first-child::before": {
        borderTopLeftRadius: rootVars.base.enabled.group.cornerRadius,
        borderTopRightRadius: rootVars.base.enabled.group.cornerRadius,
      },

      "&:last-child::before": {
        borderBottomLeftRadius: rootVars.base.enabled.group.cornerRadius,
        borderBottomRightRadius: rootVars.base.enabled.group.cornerRadius,
        boxShadow: "none",
      },

      transition: PRESS_SCALE_TRANSITION,

      ...prefixIcon({
        size: vars.base.enabled.prefixIcon.size,
      }),
    },
    content: {
      display: "flex",
      flexDirection: "column",

      gap: vars.base.enabled.content.gap,
    },
    label: {
      fontSize: vars.base.enabled.label.fontSize,
      lineHeight: vars.base.enabled.label.lineHeight,
      fontWeight: vars.base.enabled.label.fontWeight,
    },
    description: {
      fontSize: vars.base.enabled.description.fontSize,
      lineHeight: vars.base.enabled.description.lineHeight,
      fontWeight: vars.base.enabled.description.fontWeight,

      color: vars.base.enabled.description.color,
    },
  },
  variants: {
    tone: {
      neutral: {
        root: {
          ...prefixIcon({
            color: vars.toneNeutral.enabled.prefixIcon.color,
          }),
        },
        label: {
          color: vars.toneNeutral.enabled.label.color,
        },
      },
      critical: {
        root: {
          ...prefixIcon({
            color: vars.toneCritical.enabled.prefixIcon.color,
          }),
        },
        label: {
          color: vars.toneCritical.enabled.label.color,
        },
      },
    },
    labelAlign: {
      left: {
        content: {
          textAlign: "start",
        },
      },
      center: {
        root: {
          justifyContent: "center",
        },
        content: {
          alignItems: "center",
        },
      },
    },
  },
  defaultVariants: {
    tone: "neutral",
    labelAlign: "left",
  },
  metadata: {
    variants: spec.data.schema.variants,
  },
});

export default menuSheetItem;

import { timePicker as vars } from "../vars/component";
import {
  createFocusRingRestStyles,
  createFocusRingStyles,
  FOCUS_RING_TRANSITION,
} from "../utils/focus-ring";
import { focusVisible, pseudo, selected } from "../utils/pseudo";
import { defineSlotRecipe } from "../utils/define";

const columnBase = {
  flex: "0 0 auto",
  outline: "none",
  "&[data-disabled]": {
    "--seed-wheel-picker-selected-item-color": vars.base.enabled.item.color,
  },
  [`& ${selected}` as const]: {
    ...createFocusRingRestStyles({ position: "inside" }),
    borderRadius: vars.base.enabled.selectionIndicator.cornerRadius,
    transition: FOCUS_RING_TRANSITION,
  },
  [`&${pseudo(focusVisible)}:not([data-wheel-picker-pointer-focus]) ${selected}` as const]:
    createFocusRingStyles({ position: "inside" }),
};

const timePicker = defineSlotRecipe({
  name: "time-picker",
  slots: [
    "root",
    "scrollFog",
    "columns",
    "selectionIndicator",
    "periodColumn",
    "hourColumn",
    "minuteColumn",
    "item",
  ],
  base: {
    root: {
      width: "100%",
      "--seed-wheel-picker-selected-item-color": vars.base.selected.item.color,
    },
    scrollFog: {},
    columns: {},
    selectionIndicator: {
      borderRadius: vars.base.enabled.selectionIndicator.cornerRadius,
      backgroundColor: vars.base.enabled.selectionIndicator.color,
    },
    periodColumn: {
      ...columnBase,
    },
    hourColumn: {
      ...columnBase,
      "--seed-wheel-picker-item-justify-content": "flex-end",
    },
    minuteColumn: {
      ...columnBase,
    },
    item: {
      "--seed-wheel-picker-item-color": vars.base.enabled.item.color,
      paddingInline: vars.base.enabled.item.paddingX,
      fontSize: vars.base.enabled.item.fontSize,
      lineHeight: vars.base.enabled.item.lineHeight,
      fontWeight: vars.base.enabled.item.fontWeight,
      fontVariantNumeric: "tabular-nums",
    },
  },
  variants: {},
  defaultVariants: {},
});

export default timePicker;

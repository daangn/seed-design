import { timePicker as vars } from "../vars/component";
import { createFocusRingRestStyles, createFocusRingStyles } from "../utils/focus-ring";
import { focusVisible, pseudo } from "../utils/pseudo";
import { defineSlotRecipe } from "../utils/define";

const columnBase = {
  flex: "0 0 auto",
  outline: "none",
  ...createFocusRingRestStyles(),
  [pseudo(focusVisible)]: createFocusRingStyles(),
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
      height: vars.base.enabled.root.height,
    },
    scrollFog: {},
    columns: {
      justifyContent: "center",
    },
    selectionIndicator: {
      height: vars.base.enabled.selectionIndicator.height,
      borderRadius: vars.base.enabled.selectionIndicator.cornerRadius,
      backgroundColor: vars.base.enabled.selectionIndicator.color,
    },
    periodColumn: {
      ...columnBase,
    },
    hourColumn: {
      ...columnBase,
      "--seed-time-picker-item-justify-content": "flex-end",
    },
    minuteColumn: {
      ...columnBase,
    },
    item: {
      display: "flex",
      alignItems: "center",
      justifyContent: "var(--seed-time-picker-item-justify-content, center)",
      height: vars.base.enabled.item.height,
      paddingInline: vars.base.enabled.item.paddingX,
      color: vars.base.enabled.item.color,
      fontSize: vars.base.enabled.item.fontSize,
      lineHeight: vars.base.enabled.item.lineHeight,
      fontWeight: vars.base.enabled.item.fontWeight,
      fontVariantNumeric: "tabular-nums",
      userSelect: "none",

      "&[data-wheel-picker-indicator-overlap]": {
        color: "transparent",
        backgroundImage: `linear-gradient(to bottom, ${vars.base.enabled.item.color} 0%, ${vars.base.enabled.item.color} var(--seed-wheel-picker-indicator-overlap-start), ${vars.base.selected.item.color} var(--seed-wheel-picker-indicator-overlap-start), ${vars.base.selected.item.color} var(--seed-wheel-picker-indicator-overlap-end), ${vars.base.enabled.item.color} var(--seed-wheel-picker-indicator-overlap-end), ${vars.base.enabled.item.color} 100%)`,
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      },
    },
  },
  variants: {},
  defaultVariants: {},
});

export default timePicker;

import { timePicker as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";
import { WHEEL_PICKER_CUSTOM_PROPERTIES } from "./wheel-picker";

const columnBase = {
  flex: "0 0 auto",
  outline: "none",
  "&[data-disabled]": {
    [WHEEL_PICKER_CUSTOM_PROPERTIES.selectedItemColor]: vars.base.rest.item.color,
  },
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
      height: vars.base.rest.root.height,
      [WHEEL_PICKER_CUSTOM_PROPERTIES.selectedItemColor]: vars.base.selected.item.color,
      [WHEEL_PICKER_CUSTOM_PROPERTIES.selectionIndicatorCornerRadius]:
        vars.base.rest.selectionIndicator.cornerRadius,
    },
    scrollFog: {},
    columns: {},
    selectionIndicator: {
      borderRadius: vars.base.rest.selectionIndicator.cornerRadius,
      backgroundColor: vars.base.rest.selectionIndicator.color,
    },
    periodColumn: {
      ...columnBase,
    },
    hourColumn: {
      ...columnBase,
      [WHEEL_PICKER_CUSTOM_PROPERTIES.itemJustifyContent]: "flex-end",
    },
    minuteColumn: {
      ...columnBase,
    },
    item: {
      [WHEEL_PICKER_CUSTOM_PROPERTIES.itemColor]: vars.base.rest.item.color,
      paddingInline: vars.base.rest.item.paddingX,
      fontSize: vars.base.rest.item.fontSize,
      lineHeight: vars.base.rest.item.lineHeight,
      fontWeight: vars.base.rest.item.fontWeight,
      fontVariantNumeric: "tabular-nums",
    },
  },
  variants: {},
  defaultVariants: {},
});

export default timePicker;

import {
  createFocusRingRestStyles,
  createFocusRingStyles,
  FOCUS_RING_TRANSITION,
} from "../utils/focus-ring";
import { vars as tokens } from "../vars";
import { focusVisible, pseudo, selected } from "../utils/pseudo";
import { defineSlotRecipe } from "../utils/define";

export const WHEEL_PICKER_CUSTOM_PROPERTIES = {
  viewportSize: "--seed-wheel-picker-viewport-size",
  centerOffset: "--seed-wheel-picker-center-offset",
  itemSize: "--seed-wheel-picker-item-size",
  itemJustifyContent: "--seed-wheel-picker-item-justify-content",
  itemColor: "--seed-wheel-picker-item-color",
  selectedItemColor: "--seed-wheel-picker-selected-item-color",
  selectionIndicatorCornerRadius: "--seed-wheel-picker-selection-indicator-corner-radius",
  indicatorOverlapStart: "--seed-wheel-picker-indicator-overlap-start",
  indicatorOverlapEnd: "--seed-wheel-picker-indicator-overlap-end",
} as const;

const wheelPicker = defineSlotRecipe({
  name: "wheel-picker",
  slots: ["root", "scrollFog", "columns", "column", "item", "selectionIndicator"],
  base: {
    root: {
      position: "relative",
      height: `var(${WHEEL_PICKER_CUSTOM_PROPERTIES.viewportSize})`,
      overflow: "hidden",
    },
    scrollFog: {
      position: "relative",
      zIndex: 1,
      height: "100%",
      overflow: "hidden",
    },
    columns: {
      display: "flex",
      height: "100%",
      justifyContent: "center",
    },
    column: {
      boxSizing: "border-box",
      width: "max-content",
      height: "100%",
      overflowX: "hidden",
      overflowY: "auto",
      overscrollBehaviorX: "none",
      overscrollBehaviorY: "contain",
      scrollSnapType: "y mandatory",
      scrollbarWidth: "none",
      msOverflowStyle: "none",
      outline: "none",
      touchAction: "pan-y",
      cursor: "grab",
      paddingBlock: `var(${WHEEL_PICKER_CUSTOM_PROPERTIES.centerOffset})`,
      "&[data-disabled]": {
        overflowY: "hidden",
        cursor: "default",
      },
      "&[data-readonly]": {
        cursor: "default",
      },
      "&[data-wheel-picker-dragging]": {
        cursor: "grabbing",
        scrollSnapType: "none",
      },
      "&[data-wheel-picker-scrolling]": {
        scrollSnapType: "none",
      },
      "&::-webkit-scrollbar": {
        display: "none",
      },
      [`& ${selected}` as const]: {
        ...createFocusRingRestStyles({ position: "inside" }),
        borderRadius: `var(${WHEEL_PICKER_CUSTOM_PROPERTIES.selectionIndicatorCornerRadius}, 0)`,
        transition: FOCUS_RING_TRANSITION,
      },
      [`&${pseudo(focusVisible)}:not([data-wheel-picker-pointer-focus]) ${selected}` as const]:
        createFocusRingStyles({ position: "inside" }),
    },
    item: {
      display: "flex",
      height: `var(${WHEEL_PICKER_CUSTOM_PROPERTIES.itemSize})`,
      minHeight: `var(${WHEEL_PICKER_CUSTOM_PROPERTIES.itemSize})`,
      alignItems: "center",
      justifyContent: `var(${WHEEL_PICKER_CUSTOM_PROPERTIES.itemJustifyContent}, center)`,
      color: `var(${WHEEL_PICKER_CUSTOM_PROPERTIES.itemColor})`,
      scrollSnapAlign: "center",
      userSelect: "none",
      "&[data-wheel-picker-indicator-overlap]": {
        color: "transparent",
        backgroundImage: `linear-gradient(to bottom, var(${WHEEL_PICKER_CUSTOM_PROPERTIES.itemColor}) 0%, var(${WHEEL_PICKER_CUSTOM_PROPERTIES.itemColor}) var(${WHEEL_PICKER_CUSTOM_PROPERTIES.indicatorOverlapStart}), var(${WHEEL_PICKER_CUSTOM_PROPERTIES.selectedItemColor}) var(${WHEEL_PICKER_CUSTOM_PROPERTIES.indicatorOverlapStart}), var(${WHEEL_PICKER_CUSTOM_PROPERTIES.selectedItemColor}) var(${WHEEL_PICKER_CUSTOM_PROPERTIES.indicatorOverlapEnd}), var(${WHEEL_PICKER_CUSTOM_PROPERTIES.itemColor}) var(${WHEEL_PICKER_CUSTOM_PROPERTIES.indicatorOverlapEnd}), var(${WHEEL_PICKER_CUSTOM_PROPERTIES.itemColor}) 100%)`,
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      },
    },
    selectionIndicator: {
      position: "absolute",
      zIndex: 0,
      insetInline: tokens.$dimension.x4,
      top: "50%",
      height: `var(${WHEEL_PICKER_CUSTOM_PROPERTIES.itemSize})`,
      transform: "translateY(-50%)",
      pointerEvents: "none",
    },
  },
  variants: {},
  defaultVariants: {},
});

export default wheelPicker;

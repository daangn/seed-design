import { defineSlotRecipe } from "../utils/define";

const wheelPicker = defineSlotRecipe({
  name: "wheel-picker",
  slots: ["root", "scrollFog", "columns", "column", "item", "selectionIndicator"],
  base: {
    root: {
      position: "relative",
      height: "var(--seed-wheel-picker-viewport-size)",
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
      paddingBlock: "var(--seed-wheel-picker-center-offset)",
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
    },
    item: {
      display: "flex",
      height: "var(--seed-wheel-picker-item-size)",
      minHeight: "var(--seed-wheel-picker-item-size)",
      alignItems: "center",
      justifyContent: "var(--seed-wheel-picker-item-justify-content, center)",
      color: "var(--seed-wheel-picker-item-color)",
      scrollSnapAlign: "center",
      userSelect: "none",
      "&[data-wheel-picker-indicator-overlap]": {
        color: "transparent",
        backgroundImage:
          "linear-gradient(to bottom, var(--seed-wheel-picker-item-color) 0%, var(--seed-wheel-picker-item-color) var(--seed-wheel-picker-indicator-overlap-start), var(--seed-wheel-picker-selected-item-color) var(--seed-wheel-picker-indicator-overlap-start), var(--seed-wheel-picker-selected-item-color) var(--seed-wheel-picker-indicator-overlap-end), var(--seed-wheel-picker-item-color) var(--seed-wheel-picker-indicator-overlap-end), var(--seed-wheel-picker-item-color) 100%)",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      },
    },
    selectionIndicator: {
      position: "absolute",
      zIndex: 0,
      insetInline: 0,
      top: "50%",
      height: "var(--seed-wheel-picker-item-size)",
      transform: "translateY(-50%)",
      pointerEvents: "none",
    },
  },
  variants: {},
  defaultVariants: {},
});

export default wheelPicker;

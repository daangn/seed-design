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
      },
      "&[data-wheel-picker-scrolling]": {
        scrollSnapType: "none",
      },
      "&::-webkit-scrollbar": {
        display: "none",
      },
    },
    item: {
      height: "var(--seed-wheel-picker-item-size)",
      minHeight: "var(--seed-wheel-picker-item-size)",
      scrollSnapAlign: "center",
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

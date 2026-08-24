import {
  createFocusRingRestStyles,
  createFocusRingStyles,
  FOCUS_RING_TRANSITION,
} from "../utils/focus-ring";
import spec from "@seed-design/rootage-artifacts/components/wheel-picker";
import { defineSlotRecipe } from "../utils/define";
import { disabled, focusVisible, pseudo, selected } from "../utils/pseudo";
import { wheelPicker as vars } from "../vars/component";

export const WHEEL_PICKER_PUBLIC_CUSTOM_PROPERTIES = {
  viewportSize: "--seed-wheel-picker-public-viewport-size",
  centerOffset: "--seed-wheel-picker-public-center-offset",
  itemSize: "--seed-wheel-picker-public-item-size",
  scrollFogSize: "--seed-wheel-picker-public-scroll-fog-size",
  scrollFogMaxHeight: "--seed-wheel-picker-public-scroll-fog-max-height",
  itemColor: "--seed-wheel-picker-public-item-color",
  selectedItemColor: "--seed-wheel-picker-public-selected-item-color",
  indicatorOverlapStart: "--seed-wheel-picker-indicator-overlap-start",
  indicatorOverlapEnd: "--seed-wheel-picker-indicator-overlap-end",
} as const;

const wheelPickerPublic = defineSlotRecipe({
  name: "wheel-picker-public",
  slots: ["root", "scrollFog", "columns", "column", "item", "itemLabel", "selectionIndicator"],
  base: {
    root: {
      position: "relative",
      width: "100%",
      overflow: "hidden",
      backgroundColor: vars.base.enabled.root.color,
      [WHEEL_PICKER_PUBLIC_CUSTOM_PROPERTIES.itemColor]: vars.base.enabled.itemLabel.color,
      [WHEEL_PICKER_PUBLIC_CUSTOM_PROPERTIES.selectedItemColor]: vars.base.selected.itemLabel.color,
      [WHEEL_PICKER_PUBLIC_CUSTOM_PROPERTIES.scrollFogSize]: `min(calc(${vars.base.enabled.scrollFog.maxHeightFraction} * 100%), var(${WHEEL_PICKER_PUBLIC_CUSTOM_PROPERTIES.scrollFogMaxHeight}))`,
    },
    scrollFog: {
      position: "relative",
      zIndex: 1,
      height: "100%",
      overflow: "hidden",
    },
    columns: {
      display: "flex",
      width: "100%",
      height: "100%",
      justifyContent: "center",
    },
    column: {
      boxSizing: "border-box",
      flex: "1 1 0",
      minWidth: 0,
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
      paddingBlock: `var(${WHEEL_PICKER_PUBLIC_CUSTOM_PROPERTIES.centerOffset})`,
      [pseudo(disabled)]: {
        overflowY: "hidden",
        cursor: "default",
        [WHEEL_PICKER_PUBLIC_CUSTOM_PROPERTIES.itemColor]: vars.base.disabled.itemLabel.color,
        [WHEEL_PICKER_PUBLIC_CUSTOM_PROPERTIES.selectedItemColor]:
          vars.base.disabled.itemLabel.color,
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
        borderRadius: vars.base.enabled.selectionIndicator.cornerRadius,
        transition: FOCUS_RING_TRANSITION,
      },
      [`&${pseudo(focusVisible)}:not([data-wheel-picker-pointer-focus]) ${selected}` as const]:
        createFocusRingStyles({ position: "inside" }),
    },
    item: {
      display: "flex",
      height: `var(${WHEEL_PICKER_PUBLIC_CUSTOM_PROPERTIES.itemSize})`,
      minHeight: `var(${WHEEL_PICKER_PUBLIC_CUSTOM_PROPERTIES.itemSize})`,
      alignItems: "center",
      justifyContent: "center",
      color: `var(${WHEEL_PICKER_PUBLIC_CUSTOM_PROPERTIES.itemColor})`,
      scrollSnapAlign: "center",
      userSelect: "none",
      "&[data-wheel-picker-indicator-overlap]": {
        color: "transparent",
        backgroundImage: `linear-gradient(to bottom, var(${WHEEL_PICKER_PUBLIC_CUSTOM_PROPERTIES.itemColor}) 0%, var(${WHEEL_PICKER_PUBLIC_CUSTOM_PROPERTIES.itemColor}) var(${WHEEL_PICKER_PUBLIC_CUSTOM_PROPERTIES.indicatorOverlapStart}), var(${WHEEL_PICKER_PUBLIC_CUSTOM_PROPERTIES.selectedItemColor}) var(${WHEEL_PICKER_PUBLIC_CUSTOM_PROPERTIES.indicatorOverlapStart}), var(${WHEEL_PICKER_PUBLIC_CUSTOM_PROPERTIES.selectedItemColor}) var(${WHEEL_PICKER_PUBLIC_CUSTOM_PROPERTIES.indicatorOverlapEnd}), var(${WHEEL_PICKER_PUBLIC_CUSTOM_PROPERTIES.itemColor}) var(${WHEEL_PICKER_PUBLIC_CUSTOM_PROPERTIES.indicatorOverlapEnd}), var(${WHEEL_PICKER_PUBLIC_CUSTOM_PROPERTIES.itemColor}) 100%)`,
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      },
    },
    itemLabel: {
      boxSizing: "border-box",
      display: "flex",
      flexShrink: 0,
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
      paddingInline: vars.base.enabled.itemLabel.paddingX,
      fontWeight: vars.base.enabled.itemLabel.fontWeight,
      whiteSpace: "nowrap",
    },
    selectionIndicator: {
      position: "absolute",
      zIndex: 0,
      insetInline: vars.base.enabled.selectionIndicator.insetX,
      top: "50%",
      height: `var(${WHEEL_PICKER_PUBLIC_CUSTOM_PROPERTIES.itemSize})`,
      transform: "translateY(-50%)",
      borderRadius: vars.base.enabled.selectionIndicator.cornerRadius,
      backgroundColor: vars.base.enabled.selectionIndicator.color,
      pointerEvents: "none",
    },
  },
  variants: {
    size: {
      small: {
        root: {
          height: `var(${WHEEL_PICKER_PUBLIC_CUSTOM_PROPERTIES.viewportSize}, ${vars.sizeSmall.enabled.root.height})`,
          [WHEEL_PICKER_PUBLIC_CUSTOM_PROPERTIES.itemSize]: vars.sizeSmall.enabled.item.height,
          [WHEEL_PICKER_PUBLIC_CUSTOM_PROPERTIES.scrollFogMaxHeight]:
            vars.sizeSmall.enabled.scrollFog.maxHeight,
        },
        itemLabel: {
          fontSize: vars.sizeSmall.enabled.itemLabel.fontSize,
          lineHeight: vars.sizeSmall.enabled.itemLabel.lineHeight,
        },
      },
      medium: {
        root: {
          height: `var(${WHEEL_PICKER_PUBLIC_CUSTOM_PROPERTIES.viewportSize}, ${vars.sizeMedium.enabled.root.height})`,
          [WHEEL_PICKER_PUBLIC_CUSTOM_PROPERTIES.itemSize]: vars.sizeMedium.enabled.item.height,
          [WHEEL_PICKER_PUBLIC_CUSTOM_PROPERTIES.scrollFogMaxHeight]:
            vars.sizeMedium.enabled.scrollFog.maxHeight,
        },
        itemLabel: {
          fontSize: vars.sizeMedium.enabled.itemLabel.fontSize,
          lineHeight: vars.sizeMedium.enabled.itemLabel.lineHeight,
        },
      },
    },
  },
  defaultVariants: {
    size: "medium",
  },
  metadata: {
    variants: spec.data.schema.variants,
  },
});

export default wheelPickerPublic;

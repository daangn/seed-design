import { defineSlotRecipe } from "../utils/define";
import { wheelPicker as vars } from "../vars/component";

const wheelPicker = defineSlotRecipe({
  name: "wheel-picker",
  slots: [
    "root",
    "scrollFog",
    "columns",
    "column",
    "track",
    "sizingContent",
    "item",
    "itemLabel",
    "itemText",
    "selectionIndicator",
  ],
  base: {
    root: {
      position: "relative",
      width: "100%",
      zIndex: 0,
      overflow: "hidden",
      backgroundColor: vars.base.enabled.root.color,
    },
    scrollFog: {
      position: "relative",
      zIndex: 1,
      height: "100%",
      overflow: "hidden",
    },
    columns: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      height: "100%",
      justifyContent: "center",
    },
    column: {
      position: "relative",
      flexShrink: 0,
      width: "max-content",
      height: "100%",
    },
    track: {
      color: vars.base.enabled.itemLabel.color,
    },
    // absolute Track은 intrinsic 너비를 만들지 않으므로 실제 label을 flow 안에서도 한 번 렌더한다.
    sizingContent: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "max-content",
      height: 0,
      overflow: "hidden",
      opacity: 0,
      pointerEvents: "none",
    },
    item: {
      display: "flex",
      flexDirection: "row",
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
      color: vars.base.enabled.itemLabel.color,
      "& text": { color: vars.base.enabled.itemLabel.color },
    },
    itemLabel: {
      display: "flex",
      flexDirection: "row",
      flexShrink: 0,
      width: "max-content",
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
      paddingLeft: vars.base.enabled.itemLabel.paddingX,
      paddingRight: vars.base.enabled.itemLabel.paddingX,
      fontWeight: vars.base.enabled.itemLabel.fontWeight,
      color: vars.base.enabled.itemLabel.color,
    },
    itemText: {
      fontWeight: vars.base.enabled.itemLabel.fontWeight,
      color: vars.base.enabled.itemLabel.color,
    },
    selectionIndicator: {
      position: "absolute",
      zIndex: 0,
      left: vars.base.enabled.selectionIndicator.insetX,
      right: vars.base.enabled.selectionIndicator.insetX,
      top: "50%",
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
          height: `var(--seed-wheel-picker-viewport-size, ${vars.sizeSmall.enabled.root.height})`,
        },
        selectionIndicator: {
          height: `var(--seed-wheel-picker-item-size, ${vars.sizeSmall.enabled.selectionIndicator.height})`,
        },
        itemLabel: {
          fontSize: vars.sizeSmall.enabled.itemLabel.fontSize,
          lineHeight: vars.sizeSmall.enabled.itemLabel.lineHeight,
        },
        itemText: {
          fontSize: vars.sizeSmall.enabled.itemLabel.fontSize,
          lineHeight: vars.sizeSmall.enabled.itemLabel.lineHeight,
        },
      },
      medium: {
        root: {
          height: `var(--seed-wheel-picker-viewport-size, ${vars.sizeMedium.enabled.root.height})`,
        },
        selectionIndicator: {
          height: `var(--seed-wheel-picker-item-size, ${vars.sizeMedium.enabled.selectionIndicator.height})`,
        },
        itemLabel: {
          fontSize: vars.sizeMedium.enabled.itemLabel.fontSize,
          lineHeight: vars.sizeMedium.enabled.itemLabel.lineHeight,
        },
        itemText: {
          fontSize: vars.sizeMedium.enabled.itemLabel.fontSize,
          lineHeight: vars.sizeMedium.enabled.itemLabel.lineHeight,
        },
      },
    },
    selected: {
      true: {
        track: { color: vars.base.selected.itemLabel.color },
        item: {
          color: vars.base.selected.itemLabel.color,
          "& text": { color: vars.base.selected.itemLabel.color },
        },
        itemLabel: { color: vars.base.selected.itemLabel.color },
        itemText: { color: vars.base.selected.itemLabel.color },
      },
      false: {},
    },
    disabled: {
      true: {
        track: { color: vars.base.disabled.itemLabel.color },
        item: {
          color: vars.base.disabled.itemLabel.color,
          "& text": { color: vars.base.disabled.itemLabel.color },
        },
        itemLabel: { color: vars.base.disabled.itemLabel.color },
        itemText: { color: vars.base.disabled.itemLabel.color },
      },
      false: {},
    },
  },
  compoundVariants: [
    {
      selected: true,
      disabled: true,
      css: {
        track: { color: vars.base.disabled.itemLabel.color },
        item: {
          color: vars.base.disabled.itemLabel.color,
          "& text": { color: vars.base.disabled.itemLabel.color },
        },
        itemLabel: { color: vars.base.disabled.itemLabel.color },
        itemText: { color: vars.base.disabled.itemLabel.color },
      },
    },
  ],
  defaultVariants: {
    size: "medium",
    selected: false,
    disabled: false,
  },
});

export default wheelPicker;

import { editorToolbar as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";
import { pseudo, active } from "../utils/pseudo";

const editorToolbar = defineSlotRecipe({
  name: "editor-toolbar",
  slots: ["root", "item", "label", "icon", "prefixIcon"],
  base: {
    root: {
      display: "flex",
      alignItems: "center",
      backgroundColor: vars.base.enabled.root.color,
      minHeight: vars.base.enabled.root.minHeight,
      paddingInline: vars.base.enabled.root.paddingX,
      paddingBlock: vars.base.enabled.root.paddingY,
      gap: vars.base.enabled.root.gap,
      borderTopWidth: vars.base.enabled.root.strokeWidth,
      borderTopColor: vars.base.enabled.root.strokeColor,
      borderTopStyle: "solid",
      width: "100%",
      boxSizing: "border-box",
      overflowX: "auto",
      overflowY: "hidden",
      
      // Hide scrollbar but keep functionality
      scrollbarWidth: "none",
      [pseudo("&::-webkit-scrollbar")]: {
        display: "none",
      },
    },
    item: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      cursor: "pointer",
      backgroundColor: vars.base.enabled.item.color,
      minHeight: vars.base.enabled.item.minHeight,
      paddingInline: vars.base.enabled.item.paddingX,
      paddingBlock: vars.base.enabled.item.paddingY,
      gap: vars.base.enabled.item.gap,
      borderRadius: vars.base.enabled.item.cornerRadius,
      border: "none",
      outline: "none",
      userSelect: "none",
      transition: "background-color 0.2s ease",
      
      [pseudo(active)]: {
        backgroundColor: vars.base.pressed.item.color,
      },
      
      [pseudo("[data-selected]")]: {
        backgroundColor: vars.base.selected.item.color,
      },
    },
    label: {
      color: vars.base.enabled.label.color,
      fontWeight: vars.base.enabled.label.fontWeight,
      fontSize: vars.base.enabled.label.fontSize,
      lineHeight: vars.base.enabled.label.lineHeight,
      whiteSpace: "nowrap",
      
      [pseudo("[data-selected]")]: {
        fontWeight: vars.base.selected.label.fontWeight,
      },
    },
    icon: {
      color: vars.base.enabled.icon.color,
      width: vars.base.enabled.icon.size,
      height: vars.base.enabled.icon.size,
      flexShrink: 0,
    },
    prefixIcon: {
      color: vars.base.enabled.prefixIcon.color,
      width: vars.base.enabled.prefixIcon.size,
      height: vars.base.enabled.prefixIcon.size,
      flexShrink: 0,
    },
  },
  variants: {
    layout: {
      iconWithText: {},
      iconOnly: {
        item: {
          minWidth: vars.layoutIconOnly.enabled.item.minWidth,
          paddingInline: vars.layoutIconOnly.enabled.item.paddingX,
        },
      },
    },
    showKeyboard: {
      false: {
        root: {
          minHeight: vars.showKeyboardFalse.enabled.root.minHeight,
        },
      },
      true: {
        root: {
          minHeight: vars.showKeyboardTrue.enabled.root.minHeight,
        },
      },
    },
  },
  defaultVariants: {
    layout: "iconWithText",
    showKeyboard: false,
  },
});

export default editorToolbar;
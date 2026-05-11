import { switch as vars } from "../../vars/component";
import { defineLynxSlotRecipe } from "../../utils/define-lynx";

const switchRecipe = defineLynxSlotRecipe({
  name: "switch",
  slots: ["root", "label"],
  base: {
    root: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "relative",
    },
    label: {
      fontWeight: vars.base.enabled.label.fontWeight,
      color: vars.base.enabled.label.color,

      transition: `opacity ${vars.base.disabled.label.opacityDuration} ${vars.base.disabled.label.opacityTimingFunction}`,
    },
  },
  variants: {
    size: {
      32: {
        root: {
          minHeight: vars.size32.enabled.root.height,
          gap: vars.size32.enabled.root.gap,
        },
        label: {
          fontSize: vars.size32.enabled.label.fontSize,
          lineHeight: vars.size32.enabled.label.lineHeight,
        },
      },
      24: {
        root: {
          minHeight: vars.size24.enabled.root.height,
          gap: vars.size24.enabled.root.gap,
        },
        label: {
          fontSize: vars.size24.enabled.label.fontSize,
          lineHeight: vars.size24.enabled.label.lineHeight,
        },
      },
      16: {
        root: {
          minHeight: vars.size16.enabled.root.height,
          gap: vars.size16.enabled.root.gap,
        },
        label: {
          fontSize: vars.size16.enabled.label.fontSize,
          lineHeight: vars.size16.enabled.label.lineHeight,
        },
      },
    },
    disabled: {
      true: {
        label: {
          opacity: vars.base.disabled.label.opacity,
        },
      },
      false: {},
    },
  },
  defaultVariants: {
    size: 32,
    disabled: false,
  },
});

export default switchRecipe;

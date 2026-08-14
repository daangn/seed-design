import { switch as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";

const switchRecipe = defineSlotRecipe({
  name: "switch",
  slots: ["root", "label"],
  base: {
    root: {
      display: "flex",
      alignItems: "flex-start",
      position: "relative",
    },
    label: {
      fontWeight: vars.base.rest.label.fontWeight,
      color: vars.base.rest.label.color,

      transition: `opacity ${vars.base.disabled.label.opacityDuration} ${vars.base.disabled.label.opacityTimingFunction}`,
    },
  },
  variants: {
    size: {
      32: {
        root: {
          minHeight: vars.size32.rest.root.height,
          gap: vars.size32.rest.root.gap,
        },
        label: {
          fontSize: vars.size32.rest.label.fontSize,
          lineHeight: vars.size32.rest.label.lineHeight,
          marginTop: `calc(${vars.size32.rest.root.height} / 2 - ${vars.size32.rest.label.lineHeight} / 2)`,
        },
      },
      24: {
        root: {
          minHeight: vars.size24.rest.root.height,
          gap: vars.size24.rest.root.gap,
        },
        label: {
          fontSize: vars.size24.rest.label.fontSize,
          lineHeight: vars.size24.rest.label.lineHeight,
          marginTop: `calc(${vars.size24.rest.root.height} / 2 - ${vars.size24.rest.label.lineHeight} / 2)`,
        },
      },
      16: {
        root: {
          minHeight: vars.size16.rest.root.height,
          gap: vars.size16.rest.root.gap,
        },
        label: {
          fontSize: vars.size16.rest.label.fontSize,
          lineHeight: vars.size16.rest.label.lineHeight,
          marginTop: `calc(${vars.size16.rest.root.height} / 2 - ${vars.size16.rest.label.lineHeight} / 2)`,
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

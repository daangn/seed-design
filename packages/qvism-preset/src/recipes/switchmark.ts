import spec from "@seed-design/rootage-artifacts/components/switchmark.json" with {
  type: "json",
};
import { switchmark as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";
import { checked, disabled, focusVisible, pseudo } from "../utils/pseudo";
import {
  createFocusRingRestStyles,
  createFocusRingStyles,
  FOCUS_RING_TRANSITION,
} from "../utils/focus-ring";

const switchmarkRecipe = defineSlotRecipe({
  name: "switchmark",
  slots: ["root", "thumb"],
  base: {
    root: {
      boxSizing: "border-box",
      display: "block",
      position: "relative",

      borderRadius: vars.base.enabled.root.cornerRadius,
      background: vars.base.enabled.root.color,

      margin: "var(--switchmark-margin-top, 0) 0", // 수직 위치 보정

      transition: `background-color ${vars.base.enabled.root.colorDuration} ${vars.base.enabled.root.colorTimingFunction} ${vars.base.enabled.root.colorDelay}, opacity ${vars.base.disabled.root.opacityDuration} ${vars.base.disabled.root.opacityTimingFunction}, ${FOCUS_RING_TRANSITION}`,

      [pseudo(disabled)]: {
        opacity: vars.base.disabled.root.opacity,
      },

      ...createFocusRingRestStyles({ overridableBy: "--seed-focus-ring" }),
      [pseudo(focusVisible)]: createFocusRingStyles({ overridableBy: "--seed-focus-ring" }),
    },
    thumb: {
      borderRadius: vars.base.enabled.thumb.cornerRadius,

      // translateDuration & translateTimingFunction are defined in vars but not used
      transition: `transform ${vars.base.enabled.thumb.scaleDuration} ${vars.base.enabled.thumb.scaleTimingFunction}, background-color ${vars.base.enabled.thumb.colorDuration} ${vars.base.enabled.thumb.colorTimingFunction} ${vars.base.enabled.thumb.colorDelay}`,

      // defining 'scale' / 'translate' and else independently from 'transform' -> requires Chrome 104~ && Safari 14.1~
      transform: `scale(${vars.base.enabled.thumb.scale})`,
    },
  },
  variants: {
    tone: {
      neutral: {
        root: {
          [pseudo(checked)]: {
            background: vars.toneNeutral.enabledSelected.root.color,
          },
          [pseudo(disabled, checked)]: {
            background: vars.toneNeutral.disabledSelected.root.color,
          },
        },
        thumb: {
          background: vars.toneNeutral.enabled.thumb.color,

          [pseudo(disabled)]: {
            background: vars.toneNeutral.disabled.thumb.color,
          },
        },
      },
      brand: {
        root: {
          [pseudo(checked)]: {
            background: vars.toneBrand.enabledSelected.root.color,
          },
        },
        thumb: {
          background: vars.toneBrand.enabled.thumb.color,
        },
      },
    },
    size: {
      32: {
        root: {
          minWidth: vars.size32.enabled.root.width,
          minHeight: vars.size32.enabled.root.height,
          padding: `${vars.size32.enabled.root.paddingY} ${vars.size32.enabled.root.paddingX}`,
        },
        thumb: {
          width: vars.size32.enabled.thumb.width,
          height: vars.size32.enabled.thumb.height,

          [pseudo(checked)]: {
            transform: `scale(${vars.base.selected.thumb.scale}) translateX(calc(${vars.size32.enabled.root.width} - ${vars.size32.enabled.root.height}))`,
          },
        },
      },
      24: {
        root: {
          minWidth: vars.size24.enabled.root.width,
          minHeight: vars.size24.enabled.root.height,
          padding: `${vars.size24.enabled.root.paddingY} ${vars.size24.enabled.root.paddingX}`,
        },
        thumb: {
          width: vars.size24.enabled.thumb.width,
          height: vars.size24.enabled.thumb.height,

          [pseudo(checked)]: {
            transform: `scale(${vars.base.selected.thumb.scale}) translateX(calc(${vars.size24.enabled.root.width} - ${vars.size24.enabled.root.height}))`,
          },
        },
      },
      16: {
        root: {
          minWidth: vars.size16.enabled.root.width,
          minHeight: vars.size16.enabled.root.height,
          padding: `${vars.size16.enabled.root.paddingY} ${vars.size16.enabled.root.paddingX}`,
        },
        thumb: {
          width: vars.size16.enabled.thumb.width,
          height: vars.size16.enabled.thumb.height,

          [pseudo(checked)]: {
            transform: `scale(${vars.base.selected.thumb.scale}) translateX(calc(${vars.size16.enabled.root.width} - ${vars.size16.enabled.root.height}))`,
          },
        },
      },
    },
  },
  defaultVariants: {
    tone: "brand",
    size: 32,
  },
  metadata: {
    variants: {
      tone: spec.data.schema.variants.tone,
    },
  },
});

export default switchmarkRecipe;

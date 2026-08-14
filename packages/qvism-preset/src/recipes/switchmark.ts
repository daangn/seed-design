import spec from "@seed-design/rootage-artifacts/components/switchmark";
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

      borderRadius: vars.base.rest.root.cornerRadius,
      background: vars.base.rest.root.color,

      margin: "var(--switchmark-margin-top, 0) 0", // 수직 위치 보정

      transition: `background-color ${vars.base.rest.root.colorDuration} ${vars.base.rest.root.colorTimingFunction} ${vars.base.rest.root.colorDelay}, opacity ${vars.base.disabled.root.opacityDuration} ${vars.base.disabled.root.opacityTimingFunction}, ${FOCUS_RING_TRANSITION}`,

      [pseudo(disabled)]: {
        opacity: vars.base.disabled.root.opacity,
      },

      ...createFocusRingRestStyles({ overridableBy: "--seed-focus-ring" }),
      [pseudo(focusVisible)]: createFocusRingStyles({ overridableBy: "--seed-focus-ring" }),
    },
    thumb: {
      borderRadius: vars.base.rest.thumb.cornerRadius,

      // translateDuration & translateTimingFunction are defined in vars but not used
      transition: `transform ${vars.base.rest.thumb.scaleDuration} ${vars.base.rest.thumb.scaleTimingFunction}, background-color ${vars.base.rest.thumb.colorDuration} ${vars.base.rest.thumb.colorTimingFunction} ${vars.base.rest.thumb.colorDelay}`,

      // defining 'scale' / 'translate' and else independently from 'transform' -> requires Chrome 104~ && Safari 14.1~
      transform: `scale(${vars.base.rest.thumb.scale})`,
    },
  },
  variants: {
    tone: {
      neutral: {
        root: {
          [pseudo(checked)]: {
            background: vars.toneNeutral.selected.root.color,
          },
          [pseudo(disabled, checked)]: {
            background: vars.toneNeutral.selectedDisabled.root.color,
          },
        },
        thumb: {
          background: vars.toneNeutral.rest.thumb.color,

          [pseudo(disabled)]: {
            background: vars.toneNeutral.disabled.thumb.color,
          },
        },
      },
      brand: {
        root: {
          [pseudo(checked)]: {
            background: vars.toneBrand.selected.root.color,
          },
        },
        thumb: {
          background: vars.toneBrand.rest.thumb.color,
        },
      },
    },
    size: {
      32: {
        root: {
          minWidth: vars.size32.rest.root.width,
          minHeight: vars.size32.rest.root.height,
          padding: `${vars.size32.rest.root.paddingY} ${vars.size32.rest.root.paddingX}`,
        },
        thumb: {
          width: vars.size32.rest.thumb.width,
          height: vars.size32.rest.thumb.height,

          [pseudo(checked)]: {
            transform: `scale(${vars.base.selected.thumb.scale}) translateX(calc(${vars.size32.rest.root.width} - ${vars.size32.rest.root.height}))`,
          },
        },
      },
      24: {
        root: {
          minWidth: vars.size24.rest.root.width,
          minHeight: vars.size24.rest.root.height,
          padding: `${vars.size24.rest.root.paddingY} ${vars.size24.rest.root.paddingX}`,
        },
        thumb: {
          width: vars.size24.rest.thumb.width,
          height: vars.size24.rest.thumb.height,

          [pseudo(checked)]: {
            transform: `scale(${vars.base.selected.thumb.scale}) translateX(calc(${vars.size24.rest.root.width} - ${vars.size24.rest.root.height}))`,
          },
        },
      },
      16: {
        root: {
          minWidth: vars.size16.rest.root.width,
          minHeight: vars.size16.rest.root.height,
          padding: `${vars.size16.rest.root.paddingY} ${vars.size16.rest.root.paddingX}`,
        },
        thumb: {
          width: vars.size16.rest.thumb.width,
          height: vars.size16.rest.thumb.height,

          [pseudo(checked)]: {
            transform: `scale(${vars.base.selected.thumb.scale}) translateX(calc(${vars.size16.rest.root.width} - ${vars.size16.rest.root.height}))`,
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

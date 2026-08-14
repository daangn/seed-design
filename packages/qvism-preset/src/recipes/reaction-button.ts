import { reactionButton as vars } from "../vars/component";

import { defineRecipe } from "../utils/define";
import { prefixIcon } from "../utils/icon";
import { engaged, disabled, focusVisible, loading, pressed, pseudo } from "../utils/pseudo";
import {
  createFocusRingRestStyles,
  createFocusRingStyles,
  FOCUS_RING_TRANSITION,
} from "../utils/focus-ring";
import { count } from "../utils/count";

const reactionButton = defineRecipe({
  name: "reaction-button",
  base: {
    display: "inline-flex",
    position: "relative",
    boxSizing: "border-box",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    border: "none",
    textTransform: "none",
    whiteSpace: "nowrap",
    verticalAlign: "middle",
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
    textDecoration: "none",
    flexShrink: 0,
    fontFamily: "inherit",

    ...createFocusRingRestStyles(),
    [pseudo(focusVisible)]: createFocusRingStyles(),

    transition: `background-color ${vars.base.rest.root.colorDuration} ${vars.base.rest.root.colorTimingFunction}, box-shadow ${vars.base.rest.root.colorDuration} ${vars.base.rest.root.colorTimingFunction}, ${FOCUS_RING_TRANSITION}`,
    background: vars.base.rest.root.color,
    fontWeight: vars.base.rest.label.fontWeight,
    color: vars.base.rest.label.color,
    boxShadow: `inset 0 0 0 ${vars.base.rest.root.strokeWidth} ${vars.base.rest.root.strokeColor}`,

    "--track-color": vars.base.rest.progressCircle.trackColor,
    "--range-color": vars.base.rest.progressCircle.rangeColor,

    ...count({
      fontWeight: vars.base.rest.count.fontWeight,
      color: vars.base.rest.count.color,
    }),

    [pseudo(engaged)]: {
      background: vars.base.pressed.root.color,
    },
    [pseudo(pressed)]: {
      background: vars.base.selected.root.color,
      color: vars.base.selected.label.color,
      boxShadow: `inset 0 0 0 ${vars.base.selected.root.strokeWidth} ${vars.base.selected.root.strokeColor}`,

      ...prefixIcon({
        color: vars.base.selected.prefixIcon.color,
      }),
      ...count({
        color: vars.base.selected.count.color,
      }),
    },
    [pseudo(pressed, engaged)]: {
      background: vars.base.pressedSelected.root.color,
    },
    [pseudo(disabled)]: {
      cursor: "not-allowed",
      background: vars.base.disabled.root.color,
      color: vars.base.disabled.label.color,
      boxShadow: `inset 0 0 0 ${vars.base.disabled.root.strokeWidth} ${vars.base.selected.root.strokeColor}`,

      ...prefixIcon({
        color: vars.base.disabled.prefixIcon.color,
      }),
      ...count({
        color: vars.base.disabled.count.color,
      }),
    },
    [pseudo(loading)]: {
      background: vars.base.loading.root.color,
    },
    [pseudo(pressed, loading)]: {
      background: vars.base.selectedLoading.root.color,
      boxShadow: `inset 0 0 0 ${vars.base.selectedLoading.root.strokeWidth} ${vars.base.selected.root.strokeColor}`,

      "--track-color": vars.base.selected.progressCircle.trackColor,
      "--range-color": vars.base.selected.progressCircle.rangeColor,
    },
  },
  variants: {
    // TODO: `disabled` is written before `loading` at equal specificity, so a
    // button that is both keeps the loading background. The spec ranks `disabled`
    // higher; swapping the blocks would match it, but it changes rendered output
    // and wants a design review first.
    size: {
      xsmall: {
        height: vars.sizeXsmall.rest.root.minHeight,
        paddingInline: vars.sizeXsmall.rest.root.paddingX,
        paddingBlock: vars.sizeXsmall.rest.root.paddingY,
        gap: vars.sizeXsmall.rest.root.gap,
        borderRadius: vars.sizeXsmall.rest.root.cornerRadius,

        fontSize: vars.sizeXsmall.rest.label.fontSize,
        lineHeight: vars.sizeXsmall.rest.label.lineHeight,

        "--size": vars.sizeXsmall.rest.progressCircle.size,
        "--thickness": vars.sizeXsmall.rest.progressCircle.thickness,

        ...count({
          fontSize: vars.sizeXsmall.rest.count.fontSize,
          lineHeight: vars.sizeXsmall.rest.count.lineHeight,
        }),
        ...prefixIcon({
          size: vars.sizeXsmall.rest.prefixIcon.size,
        }),
      },
      small: {
        height: vars.sizeSmall.rest.root.minHeight,
        paddingInline: vars.sizeSmall.rest.root.paddingX,
        paddingBlock: vars.sizeSmall.rest.root.paddingY,
        gap: vars.sizeSmall.rest.root.gap,
        borderRadius: vars.sizeSmall.rest.root.cornerRadius,

        fontSize: vars.sizeSmall.rest.label.fontSize,
        lineHeight: vars.sizeSmall.rest.label.lineHeight,

        "--size": vars.sizeSmall.rest.progressCircle.size,
        "--thickness": vars.sizeSmall.rest.progressCircle.thickness,

        ...count({
          fontSize: vars.sizeSmall.rest.count.fontSize,
          lineHeight: vars.sizeSmall.rest.count.lineHeight,
        }),
        ...prefixIcon({
          size: vars.sizeSmall.rest.prefixIcon.size,
        }),
      },
    },
  },
  defaultVariants: {
    size: "small",
  },
});

export default reactionButton;

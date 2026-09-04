import { listItem as vars } from "../vars/component";
import * as duration from "../vars/duration";
import * as scale from "../vars/scale";
import * as timingFunction from "../vars/timing-function";
import { defineSlotRecipe } from "../utils/define";

const listItem = defineSlotRecipe({
  name: "list-item",
  slots: [
    "interactionRoot",
    "root",
    "highlightedOverlay",
    "pressedOverlay",
    "layout",
    "content",
    "title",
    "detail",
    "prefix",
    "suffix",
    "prefixIcon",
    "suffixIcon",
  ],
  base: {
    interactionRoot: {
      display: "flex",
      width: "100%",
    },
    root: {
      position: "relative",
      display: "flex",
      width: "100%",
      paddingLeft: vars.base.enabled.root.paddingX,
      paddingRight: vars.base.enabled.root.paddingX,
      paddingTop: vars.base.enabled.root.paddingY,
      paddingBottom: vars.base.enabled.root.paddingY,
    },
    highlightedOverlay: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      borderRadius: 0,
      backgroundColor: vars.base.highlighted.root.color,
      opacity: 0,
      transition: `opacity ${vars.base.enabled.root.colorDuration} ${vars.base.enabled.root.colorTimingFunction}`,
    },
    pressedOverlay: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      borderRadius: 0,
      backgroundColor: vars.base.pressed.root.color,
      opacity: 0,
      // Lynx의 background-color 보간은 transparent black을 거쳐 회색으로 보일 수 있다.
      // 상태별 배경색을 고정하고 opacity를 전환해 React와 같은 페이드를 만든다.
      transition: `opacity ${vars.base.enabled.root.colorDuration} ${vars.base.enabled.root.colorTimingFunction}, left ${vars.base.enabled.root.marginDuration} ${vars.base.enabled.root.marginTimingFunction}, right ${vars.base.enabled.root.marginDuration} ${vars.base.enabled.root.marginTimingFunction}, border-radius ${vars.base.enabled.root.borderRadiusDuration} ${vars.base.enabled.root.borderRadiusTimingFunction}`,
    },
    layout: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
      transform: "scale(1)",
      transition: `transform ${duration.pressedScale} ${timingFunction.pressedScale}`,
    },
    prefix: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      flexShrink: 0,
      paddingRight: vars.base.enabled.prefix.paddingRight,
    },
    suffix: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      flexShrink: 0,
      gap: vars.base.enabled.suffix.gap,
      color: vars.base.enabled.suffixText.color,
      fontSize: vars.base.enabled.suffixText.fontSize,
      lineHeight: vars.base.enabled.suffixText.lineHeight,
      fontWeight: vars.base.enabled.suffixText.fontWeight,
    },
    content: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      flexGrow: 1,
      gap: vars.base.enabled.body.gap,
      paddingRight: vars.base.enabled.body.paddingRight,
    },
    title: {
      flexShrink: 0,
      color: vars.base.enabled.title.color,
      fontSize: vars.base.enabled.title.fontSize,
      lineHeight: vars.base.enabled.title.lineHeight,
      fontWeight: vars.base.enabled.title.fontWeight,
    },
    detail: {
      color: vars.base.enabled.detail.color,
      fontSize: vars.base.enabled.detail.fontSize,
      lineHeight: vars.base.enabled.detail.lineHeight,
      fontWeight: vars.base.enabled.detail.fontWeight,
    },
    prefixIcon: {
      width: vars.base.enabled.prefixIcon.size,
      height: vars.base.enabled.prefixIcon.size,
      color: vars.base.enabled.prefixIcon.color,
    },
    suffixIcon: {
      width: vars.base.enabled.suffixIcon.size,
      height: vars.base.enabled.suffixIcon.size,
      color: vars.base.enabled.suffixIcon.color,
    },
  },
  variants: {
    highlighted: {
      true: {
        highlightedOverlay: {
          opacity: 1,
        },
        pressedOverlay: {
          backgroundColor: vars.base.highlightedPressed.root.color,
        },
      },
      false: {},
    },
    pressed: {
      true: {
        pressedOverlay: {
          right: vars.base.pressed.root.marginX,
          left: vars.base.pressed.root.marginX,
          borderRadius: vars.base.pressed.root.cornerRadius,
          opacity: 1,
        },
        layout: {
          transform: `scale(${scale.s98})`,
        },
      },
      false: {},
    },
    disabled: {
      true: {
        title: { color: vars.base.disabled.title.color },
        detail: { color: vars.base.disabled.detail.color },
        prefixIcon: { color: vars.base.disabled.prefixIcon.color },
        suffixIcon: { color: vars.base.disabled.suffixIcon.color },
      },
      false: {},
    },
  },
  defaultVariants: {
    highlighted: false,
    pressed: false,
    disabled: false,
  },
});

export default listItem;

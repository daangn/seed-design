import { reactionButton as vars } from "../vars/component";

import { defineSlotRecipe } from "../utils/define";
const ROOT_TRANSITION = `background-color ${vars.base.enabled.root.colorDuration} ${vars.base.enabled.root.colorTimingFunction}, border-color ${vars.base.enabled.root.colorDuration} ${vars.base.enabled.root.colorTimingFunction}`;

const reactionButton = defineSlotRecipe({
  name: "reaction-button",
  slots: ["root", "content", "label", "count", "prefixIcon", "loadingIndicator"],
  base: {
    root: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      background: vars.base.enabled.root.color,
      borderWidth: "var(--seed-reaction-button-stroke-width)",
      borderStyle: "solid",
      "--seed-reaction-button-stroke-width": vars.base.enabled.root.strokeWidth,
      borderColor: vars.base.enabled.root.strokeColor,
      "--track-color": vars.base.enabled.progressCircle.trackColor,
      "--range-color": vars.base.enabled.progressCircle.rangeColor,
      transition: ROOT_TRANSITION,
    },
    content: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      opacity: 1,
    },
    label: {
      color: vars.base.enabled.label.color,
      fontWeight: vars.base.enabled.label.fontWeight,
    },
    count: {
      color: vars.base.enabled.count.color,
      fontWeight: vars.base.enabled.count.fontWeight,
    },
    prefixIcon: {
      color: vars.base.enabled.prefixIcon.color,
      flexShrink: 0,
    },
    loadingIndicator: {
      position: "absolute",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
  },
  variants: {
    size: {
      xsmall: {
        root: {
          height: vars.sizeXsmall.enabled.root.minHeight,
          borderRadius: vars.sizeXsmall.enabled.root.cornerRadius,
          paddingLeft: `calc(${vars.sizeXsmall.enabled.root.paddingX} - var(--seed-reaction-button-stroke-width))`,
          paddingRight: `calc(${vars.sizeXsmall.enabled.root.paddingX} - var(--seed-reaction-button-stroke-width))`,
          paddingTop: `calc(${vars.sizeXsmall.enabled.root.paddingY} - var(--seed-reaction-button-stroke-width))`,
          paddingBottom: `calc(${vars.sizeXsmall.enabled.root.paddingY} - var(--seed-reaction-button-stroke-width))`,
        },
        content: {
          gap: vars.sizeXsmall.enabled.root.gap,
        },
        label: {
          fontSize: vars.sizeXsmall.enabled.label.fontSize,
          lineHeight: vars.sizeXsmall.enabled.label.lineHeight,
        },
        count: {
          fontSize: vars.sizeXsmall.enabled.count.fontSize,
          lineHeight: vars.sizeXsmall.enabled.count.lineHeight,
        },
        prefixIcon: {
          width: vars.sizeXsmall.enabled.prefixIcon.size,
          height: vars.sizeXsmall.enabled.prefixIcon.size,
        },
      },
      small: {
        root: {
          height: vars.sizeSmall.enabled.root.minHeight,
          borderRadius: vars.sizeSmall.enabled.root.cornerRadius,
          paddingLeft: `calc(${vars.sizeSmall.enabled.root.paddingX} - var(--seed-reaction-button-stroke-width))`,
          paddingRight: `calc(${vars.sizeSmall.enabled.root.paddingX} - var(--seed-reaction-button-stroke-width))`,
          paddingTop: `calc(${vars.sizeSmall.enabled.root.paddingY} - var(--seed-reaction-button-stroke-width))`,
          paddingBottom: `calc(${vars.sizeSmall.enabled.root.paddingY} - var(--seed-reaction-button-stroke-width))`,
        },
        content: {
          gap: vars.sizeSmall.enabled.root.gap,
        },
        label: {
          fontSize: vars.sizeSmall.enabled.label.fontSize,
          lineHeight: vars.sizeSmall.enabled.label.lineHeight,
        },
        count: {
          fontSize: vars.sizeSmall.enabled.count.fontSize,
          lineHeight: vars.sizeSmall.enabled.count.lineHeight,
        },
        prefixIcon: {
          width: vars.sizeSmall.enabled.prefixIcon.size,
          height: vars.sizeSmall.enabled.prefixIcon.size,
        },
      },
    },
    selected: {
      true: {
        root: {
          background: vars.base.selected.root.color,
          "--seed-reaction-button-stroke-width": vars.base.selected.root.strokeWidth,
          borderColor: vars.base.selected.root.strokeColor,
          "--track-color": vars.base.selected.progressCircle.trackColor,
          "--range-color": vars.base.selected.progressCircle.rangeColor,
        },
        label: { color: vars.base.selected.label.color },
        count: { color: vars.base.selected.count.color },
        prefixIcon: { color: vars.base.selected.prefixIcon.color },
      },
      false: {},
    },
    disabled: {
      true: {
        root: {
          background: vars.base.disabled.root.color,
          "--seed-reaction-button-stroke-width": vars.base.disabled.root.strokeWidth,
          borderColor: vars.base.enabled.root.strokeColor,
        },
        label: { color: vars.base.disabled.label.color },
        count: { color: vars.base.disabled.count.color },
        prefixIcon: { color: vars.base.disabled.prefixIcon.color },
      },
      false: {},
    },
    loading: {
      true: {
        root: {
          background: vars.base.loading.root.color,
        },
        content: { opacity: 0 },
      },
      false: {},
    },
  },
  compoundVariants: [
    {
      selected: false,
      disabled: false,
      loading: false,
      css: {
        root: { "&:active": { background: vars.base.pressed.root.color } },
      },
    },
    {
      selected: true,
      disabled: false,
      loading: false,
      css: {
        root: { "&:active": { background: vars.base.selectedPressed.root.color } },
      },
    },
    {
      selected: true,
      loading: true,
      css: {
        root: {
          background: vars.base.selectedLoading.root.color,
          "--seed-reaction-button-stroke-width": vars.base.selectedLoading.root.strokeWidth,
          borderColor: vars.base.selected.root.strokeColor,
          "--track-color": vars.base.selected.progressCircle.trackColor,
          "--range-color": vars.base.selected.progressCircle.rangeColor,
        },
      },
    },
  ],
  defaultVariants: {
    size: "small",
    selected: false,
    disabled: false,
    loading: false,
  },
});

export default reactionButton;

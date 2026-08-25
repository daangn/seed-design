import { feedbackScale, feedbackScaleTransition } from "@seed-design/css/scale-feedback";
import { vars } from "@seed-design/css/vars";
import { style } from "@vanilla-extract/css";

const surface = style({
  boxSizing: "border-box",

  border: `1px solid ${vars.$color.stroke.neutralMuted}`,
  borderRadius: vars.$radius.r2,
  backgroundColor: vars.$color.bg.layerDefault,
  color: vars.$color.fg.neutral,

  fontSize: vars.$fontSize.t6,
  lineHeight: vars.$lineHeight.t6,
  fontWeight: vars.$fontWeight.bold,
});

export const pressable = style([
  surface,
  {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",

    transition: `background-color 0.2s, ${feedbackScaleTransition}`,

    selectors: {
      "&:active": {
        backgroundColor: vars.$color.bg.layerDefaultPressed,
        scale: feedbackScale,
      },
    },
  },
]);

export const mediumSize = style({
  minHeight: 48,
  paddingInline: 16,
});

export const tinySquare = style({
  width: 24,
  height: 24,
  padding: 0,
});

export const wideBar = style({
  width: 300,
  height: 44,
});

export const misconfigured = style({
  borderStyle: "dashed",
  borderColor: vars.$color.stroke.criticalSolid,
});

export const nestedWrapper = style([
  surface,
  {
    display: "flex",
    alignItems: "center",

    width: "100%",
    padding: vars.$dimension.x3,

    transition: `background-color 0.2s, ${feedbackScaleTransition}`,

    selectors: {
      "&:active": {
        backgroundColor: vars.$color.bg.layerDefaultPressed,
        scale: feedbackScale,
      },
    },
  },
]);

export const markOptOut = style({
  vars: {
    "--seed-checkmark-feedback-scale": "1",
  },
});

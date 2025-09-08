import { vars } from "@seed-design/css/vars";
import { style } from "@vanilla-extract/css";

export const root = style({
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  display: "flex",
  flexDirection: "column",
  zIndex: 1000,

  backgroundColor: vars.$color.bg.layerDefault,
  borderTop: `1px solid ${vars.$color.stroke.neutralMuted}`,
});

export const item = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",

  paddingInline: vars.$dimension.x4,
  minHeight: vars.$dimension.x13,

  borderBottom: `1px solid ${vars.$color.stroke.neutralMuted}`,
});

export const title = style({
  color: vars.$color.fg.neutral,
  fontSize: vars.$fontSize.t5,
  lineHeight: vars.$lineHeight.t5,
  fontWeight: vars.$fontWeight.bold,
});

import { style } from "@vanilla-extract/css";
import { vars } from "@seed-design/css/vars";

export const root = style({
  display: "flex",
  flexDirection: "column",
});

export const item = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",

  paddingInline: vars.$dimension.x4,
  minHeight: vars.$dimension.x13,

  borderBottom: `1px solid ${vars.$color.stroke.neutralMuted}`,
  ":last-child": {
    borderBottom: "none",
  },

  backgroundColor: vars.$color.bg.layerDefault,
  ":active": {
    backgroundColor: vars.$color.bg.layerDefaultPressed,
  },
});

export const title = style({
  color: vars.$color.fg.neutral,
  fontSize: vars.$fontSize.t5,
  lineHeight: vars.$lineHeight.t5,
  fontWeight: vars.$fontWeight.regular,
});

export const icon = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  color: vars.$color.fg.neutralMuted,
  width: vars.$dimension.x4,
  height: vars.$dimension.x4,
});

export const listItemGroup = style({
  display: "flex",
  flexDirection: "column",
  borderBottom: `1px solid ${vars.$color.stroke.neutralMuted}`,

  marginTop: vars.$dimension.x6,
  fontWeight: vars.$fontWeight.bold,
});

export const listItemGroupTitle = style({
  color: vars.$color.fg.neutral,
  fontSize: vars.$fontSize.t4,
  lineHeight: vars.$lineHeight.t5,

  paddingInline: vars.$dimension.x4,
  marginBottom: vars.$dimension.x1,
});

import { vars } from "@seed-design/css/vars";
import { style, styleVariants } from "@vanilla-extract/css";

export const page = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.$dimension.x12,

  paddingTop: vars.$dimension.x4,
  // The inset is 0 on desktop, so the last panel would sit flush against the
  // bottom edge without a base gap of its own.
  paddingBottom: `calc(var(--seed-safe-area-bottom, 0px) + ${vars.$dimension.x8})`,
});

export const group = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.$dimension.x8,
});

export const groupHeader = style({
  display: "flex",
  alignItems: "center",
  gap: vars.$dimension.x2,

  margin: 0,
  paddingInline: vars.$dimension.x4,

  fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
  fontSize: vars.$fontSize.t1,
  lineHeight: vars.$lineHeight.t1,
  letterSpacing: "0.08em",
  color: vars.$color.fg.neutralMuted,

  "::after": {
    content: "",
    flex: 1,
    height: 1,
    backgroundColor: vars.$color.stroke.neutralMuted,
  },
});

export const section = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.$dimension.x3,

  paddingInline: vars.$dimension.x4,
});

export const sectionHeader = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.$dimension.x1,
});

export const sectionTitle = style({
  margin: 0,

  fontSize: vars.$fontSize.t5,
  lineHeight: vars.$lineHeight.t5,
  fontWeight: vars.$fontWeight.bold,
  color: vars.$color.fg.neutral,
});

export const sectionDescription = style({
  margin: 0,

  fontSize: vars.$fontSize.t3,
  lineHeight: vars.$lineHeight.t3,
  color: vars.$color.fg.neutralSubtle,
});

export const panel = style({
  overflow: "hidden",

  border: `1px solid ${vars.$color.stroke.neutralMuted}`,
  borderRadius: vars.$radius.r3,
  backgroundColor: vars.$color.bg.layerDefault,
});

export const panelTone = styleVariants({
  default: {},
  // The two misconfigured pressables are the only place on the page where the
  // expected result is "nothing happens", so the panel has to say so — pressing
  // them looks the same as a section that simply has no scale to show.
  failure: { borderStyle: "dashed", borderColor: vars.$color.stroke.criticalWeak },
});

export const stage = style({
  display: "flex",
  flexDirection: "column",
  // Specimens keep their intrinsic width — a stretched icon-only button would
  // stop being the square the section is comparing against.
  alignItems: "flex-start",
  gap: vars.$dimension.x3,

  padding: vars.$dimension.x4,
});

export const stageFlush = style({
  padding: 0,
});

/** Opts a single specimen out of the stage's intrinsic-width default. */
export const fullWidth = style({
  alignSelf: "stretch",

  display: "flex",
  flexDirection: "column",
});

export const intro = style({
  margin: 0,
  paddingInline: vars.$dimension.x4,

  fontSize: vars.$fontSize.t3,
  lineHeight: vars.$lineHeight.t3,
  color: vars.$color.fg.neutralSubtle,
});

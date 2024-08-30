import { vars } from "@seed-design/design-token";
import { style } from "@vanilla-extract/css";

export const grid = style({
  display: "grid",
});

export const flex = style({
  display: "flex",
});

export const flexAlignCenter = style([
  flex,
  {
    alignItems: "center",
  },
]);

export const flexJustifyCenter = style([
  flex,
  {
    justifyContent: "center",
  },
]);

export const flexColumn = style([
  flex,
  {
    flexDirection: "column",
  },
]);

export const flex1 = style({
  flex: 1,
});

export const posAbs = style({
  position: "absolute",
});

export const posRel = style({
  position: "relative",
});

export const top0 = style({
  top: 0,
});

export const left0 = style({
  left: 0,
});

export const fullWidth = style({
  width: "100%",
});

export const fullHeight = style({
  height: "100%",
});

export const posAbsFull = style([posAbs, top0, left0, fullWidth, fullHeight]);

export const nowrap = style({
  whiteSpace: "nowrap",
});

export const resetButton = style({
  appearance: "none",
  border: 0,
  padding: 0,
  background: "none",
  color: vars.$scale.color.gray900,
  textAlign: "left",
});

export const cursorPointer = style({
  cursor: "pointer",
  WebkitTapHighlightColor: "transparent",
});

export const overflowHidden = style({
  overflow: "hidden",
  transform: "translate3d(0, 0, 0)",
  maskImage: "-webkit-radial-gradient(white, black)",
});

export const overflowScroll = style({
  overflowY: "scroll",
  WebkitOverflowScrolling: "touch",
  "::-webkit-scrollbar": {
    display: "none",
  },
});

export const rootLineHeight = style({
  lineHeight: "1.15",
});

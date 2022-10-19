import { style } from "@vanilla-extract/css";

export const container = style({
  width: "100vw",
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
});

export const title = style({
  fontSize: "66px",
  fontWeight: 700,
});

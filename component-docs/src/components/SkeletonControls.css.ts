import { keyframes, style } from "@vanilla-extract/css";

export const controlTitle = style({
  fontSize: "16px",
  fontWeight: "bold",
  marginTop: "16px",
  marginBottom: "8px",
});

export const controlBlock = style({
  display: "flex",
  gap: "8px",
});

export const controlLabel = style({});

export const controlInput = style({
  flex: 1,
  border: "1px solid #e5e5e5",
});

export const adapt = style({
  marginTop: "20px",
});

export const leftToRight = keyframes({
  from: {
    left: "0",
  },
  to: {
    left: "100%",
  },
});

import { vars } from "@seed-design/design-token";
import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

const robotoMono = style({
  fontFamily: "Roboto Mono",
  letterSpacing: "-0.3px",
  fontWeight: 400,
});

export const titleContainer = style({
  display: "flex",
  flexDirection: "column",

  marginTop: "60px",
});

export const container = style({
  display: "flex",
  flexDirection: "column",

  gap: "20px",

  marginTop: "40px",
});

export const heading2 = style({
  color: vars.$semantic.color.inkText,

  fontSize: "26px",
  fontWeight: 700,
});

export const heading3 = style({
  color: vars.$scale.color.gray800,

  fontSize: "18px",
  fontWeight: 700,
});

export const p1 = style({
  color: vars.$semantic.color.inkText,

  fontSize: "16px",
  fontWeight: 500,
});

export const p2 = style({
  color: vars.$semantic.color.inkText,

  fontSize: "14px",
  fontWeight: 400,
});

export const tokenTableDataColorPreview = style({
  width: "28px",
  height: "28px",
  borderRadius: "4px",
});

export const tokenTableDataColorText = style([
  robotoMono,
  {
    fontSize: "13px",

    backgroundColor: vars.$scale.color.gray100,

    padding: "0px 4px",
  },
]);

export const tokenTableDataUsage = style({
  fontSize: "12px",
});

export const scaleTableAnchor = style([
  robotoMono,
  {
    textDecoration: "underline",
  },
]);

export const tokenTableDataContent = style({
  display: "flex",
  alignItems: "center",

  gap: "10px",
});

export const scaleColorContainer = style({
  display: "flex",
  flexWrap: "wrap",

  borderRadius: "10px",
});

export const scaleColorBox = style({
  position: "relative",

  flex: "1 1 76px",

  width: "100%",
  height: "76px",
});

export const scaleColorFocusRing = style({
  position: "absolute",
  top: "-2px",
  left: "-2px",

  width: "calc(100% + 4px)",
  height: "calc(100% + 4px)",

  zIndex: 1,

  border: `4px solid ${vars.$semantic.color.accent}`,
});

export const colorDescription = recipe({
  base: [
    {
      display: "flex",
      flexDirection: "column",

      marginLeft: "10px",
      marginTop: "10px",

      fontSize: "12px",
    },
  ],
  variants: {
    inversion: {
      true: {
        color: vars.$scale.color.gray00,
      },
    },
  },
});

export const colorDescriptionText = style([robotoMono, {}]);

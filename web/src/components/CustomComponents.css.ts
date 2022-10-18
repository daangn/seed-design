import { vars } from "@seed-design/design-token";
import { style } from "@vanilla-extract/css";

import * as u from "../styles/utils.css";

export const h1 = style({
  fontSize: "66px",
  fontWeight: 700,

  marginTop: "35px",
  marginBottom: "10px",
});

export const h2 = style({
  marginTop: "25px",
  marginBottom: "10px",
});

export const h3 = style({
  marginTop: "20px",
  marginBottom: "10px",
});

export const h4 = style({
  marginTop: "15px",
  marginBottom: "10px",
});

export const ol = style([
  {
    paddingInlineStart: 0,
  },
]);

export const oli = style([
  u.flexAlignCenter,
  {
    marginBottom: "8px",

    "::before": {
      content: "counter(list-item)",
      counterIncrement: "list-item",

      display: "flex",
      alignItems: "center",
      justifyContent: "center",

      fontSize: "12px",
      fontWeight: "bold",
      width: "24px",
      height: "24px",
      borderRadius: "50%",

      marginRight: "8px",

      backgroundColor: vars.$scale.color.gray900,
      color: vars.$scale.color.gray00,
    },
  },
]);

import { classNames, vars } from "@seed-design/design-token";
import { style } from "@vanilla-extract/css";

import * as m from "../../../styles/media.css";
import * as u from "../../../styles/utils.css";

export const ol = style([
  {
    paddingInlineStart: 0,
  },
]);

export const oli = style([
  classNames.$semantic.typography.bodyL1Regular,
  u.flex,
  {
    marginTop: "8px",
    marginBottom: "8px",
    fontSize: "14px",

    "::before": {
      content: "counter(list-item)",
      counterIncrement: "list-item",

      display: "flex",
      alignItems: "center",
      justifyContent: "center",

      fontSize: "10px",
      fontWeight: "bold",
      width: "20px",
      height: "20px",

      minWidth: "20px",
      minHeight: "20px",
      borderRadius: "50%",

      marginRight: "8px",
      marginTop: "2px",

      backgroundColor: vars.$scale.color.gray900,
      color: vars.$scale.color.gray00,
    },
  },
  m.small({
    "::before": {
      fontSize: "12px",
      width: "24px",
      height: "24px",
    },

    fontSize: "16px",
  }),
]);

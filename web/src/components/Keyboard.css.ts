import { vars } from "@seed-design/design-token";
import { style } from "@vanilla-extract/css";

// import * as u from "../styles/utils.css";

export const keyboard = style([
  {
    padding: "8px",
    margin: "0px 3px",
    lineHeight: "3",
    borderRadius: "6px",
    border: `2px solid ${vars.$scale.color.gray900}`,
  },
]);

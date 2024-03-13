import { vars } from "@seed-design/design-token";
import { style } from "@vanilla-extract/css";

export const iframe = style([
  {
    width: "100%",

    border: `1px solid ${vars.$scale.color.gray300}`,
    borderRadius: "8px",
  },
]);

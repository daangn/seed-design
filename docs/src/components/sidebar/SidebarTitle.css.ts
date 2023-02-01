import { vars } from "@seed-design/design-token";
import { style } from "@vanilla-extract/css";

import { COMMON_STYLES } from "../../constants";

export const title = style([
  {
    fontSize: "24px",
    fontWeight: 700,

    width: COMMON_STYLES.SIDEBAR_ITEM_WIDTH,
    transition: "color 0.2s ease",
    color: vars.$scale.color.gray900,
    paddingLeft: "10px",
    marginTop: "40px",
    marginBottom: "4px",
  },
]);

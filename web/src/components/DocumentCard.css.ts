import { vars } from "@seed-design/design-token";
import { style } from "@vanilla-extract/css";

import * as u from "../styles/utils.css";

export const documentCard = style([
  u.flex,
  {
    justifyContent: "space-between",
    columnGap: "30px",
    margin: "40px 0px",
  },
]);

export const documentCardImage = style({
  minWidth: "500px",
  borderRadius: "8px",
  border: `1px solid ${vars.$scale.color.gray300}`,
  overflow: "hidden",
});

export const documentCardDescriptionCell = style({});

export const documentCardTitle = style({
  fontSize: "20px",
  fontWeight: 700,
  marginBottom: "20px",
});

export const documentCardDescription = style({});

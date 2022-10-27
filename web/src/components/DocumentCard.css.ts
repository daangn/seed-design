import { vars } from "@seed-design/design-token";
import { style } from "@vanilla-extract/css";

import * as t from "../styles/token.css";
import * as u from "../styles/utils.css";

/* Common */

export const cardCaption = style([t.documentCaption2]);

/* Full Card */

export const fullCard = style([
  u.flexColumnCenter,
  {
    marginTop: "20px",
    borderRadius: "8px",
    border: `1px solid ${vars.$scale.color.gray300}`,
    overflow: "hidden",
  },
]);

export const fullCardImageCell = style({
  width: "100%",
});

export const fullCardDescription = style({
  paddingBottom: "60px",
  color: vars.$semantic.color.inkText,
});

/* Half Card */

export const halfCard = style([
  u.flex,
  {
    justifyContent: "space-between",
    columnGap: "30px",
    margin: "40px 0px",
  },
]);

export const halfCardImageCell = style({
  minWidth: "500px",
  borderRadius: "8px",
  border: `1px solid ${vars.$scale.color.gray300}`,
  overflow: "hidden",
});

export const halfCardDescriptionCell = style({});

export const halfCardDescriptionTitle = style({
  fontSize: "20px",
  fontWeight: 700,
  marginBottom: "20px",
});

export const halfCardDescription = style({});

import { vars } from "@seed-design/design-token";
import { style } from "@vanilla-extract/css";

import * as m from "../../styles/media.css";
import * as t from "../../styles/token.css";
import * as u from "../../styles/utils.css";

/* Common */

export const cardCaption = style([t.documentCaption2]);

/* Full Card */

export const fullCard = style([
  u.flexColumnCenter,
  {
    marginTop: "20px",
    borderRadius: "8px",
    border: `1px solid ${vars.$scale.color.gray300}`,
    backgroundColor: vars.$semantic.color.onPrimary,
    overflow: "hidden",
  },
]);

export const fullCardImageCell = style({
  width: "100%",
});

export const fullCardDescription = style({
  padding: "20px",
  paddingBottom: "60px",
  color: vars.$static.color.staticBlack,
});

/* Half Card */

export const halfCard = style([
  u.flex,
  {
    justifyContent: "space-between",
    columnGap: "30px",
    margin: "40px 0px",
    borderRadius: "8px",
  },
  m.medium({
    flexDirection: "column",
  }),
]);

export const halfCardImageCell = style([
  {
    minWidth: "500px",
    border: `1px solid ${vars.$scale.color.gray300}`,
    backgroundColor: vars.$semantic.color.onPrimary,
    borderRadius: "8px",
    overflow: "hidden",
  },
  m.medium({
    minWidth: "100%",
  }),
]);

export const halfCardDescriptionCell = style([
  m.medium({
    marginBottom: "70px",
  }),
]);

export const halfCardDescriptionTitle = style([
  {
    fontSize: "20px",
    fontWeight: 700,
    marginBottom: "20px",
  },
  m.medium({
    marginTop: "20px",
  }),
]);

export const halfCardDescription = style({});

import { vars } from "@seed-design/design-token";
import { style } from "@vanilla-extract/css";

import * as m from "../../styles/media.css";
import * as u from "../../styles/utils.css";

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
  paddingBottom: "40px",
  color: vars.$static.color.staticBlack,
});

/* Half Card */

export const halfCard = style([
  u.flex,
  {
    flexDirection: "column",
    justifyContent: "space-between",
    columnGap: "30px",
    margin: "20px 0px",
    borderRadius: "8px",
  },

  m.large({
    flexDirection: "row",
    margin: "20px 0px",
  }),
]);

export const halfCardImageCell = style([
  {
    minWidth: "100%",
    border: `1px solid ${vars.$scale.color.gray300}`,
    backgroundColor: vars.$semantic.color.onPrimary,
    borderRadius: "8px",
    overflow: "hidden",
  },

  m.large({
    minWidth: "500px",
  }),
]);

export const halfCardDescriptionCell = style([
  {
    marginBottom: "50px",
  },

  m.large({
    marginBottom: "0px",
  }),
]);

export const halfCardDescriptionTitle = style([
  {
    fontSize: "20px",
    marginTop: "20px",
    fontWeight: 700,
  },

  m.large({
    marginTop: "0px",
  }),
]);

export const halfCardDescription = style({});

import { vars } from "@seed-design/design-token";
import { globalStyle, style } from "@vanilla-extract/css";

import * as m from "../../styles/media.css";
import * as u from "../../styles/utils.css";

/* Full Card */

export const fullCard = style([
  u.flexColumnCenter,
  {
    marginTop: "20px",
    borderRadius: "8px",
    backgroundColor: vars.$semantic.color.onPrimary,
    border: `1px solid ${vars.$scale.color.gray300}`,
    overflow: "hidden",
  },
]);

export const fullCardImageCell = style({
  width: "100%",
  borderRadius: "8px",
  overflow: "hidden",
});

export const fullCardDescription = style({
  padding: "20px",
  paddingBottom: "40px",
  textAlign: "center",
  whiteSpace: "break-spaces",
  color: vars.$static.color.staticBlack,
});

/* Half Card */

export const halfCard = style([
  u.flex,
  {
    flexDirection: "column",
    columnGap: "30px",
    margin: "20px 0px",
    borderRadius: "8px",
  },

  m.medium({
    flexDirection: "row",
    margin: "20px 0px",
  }),
]);

export const halfCardImageCell = style([
  {
    width: "100%",
    height: "100%",

    border: `1px solid ${vars.$scale.color.gray300}`,
    borderRadius: "8px",
    overflow: "hidden",
    objectFit: "cover",
  },

  m.medium({
    minWidth: "500px",
    minHeight: "300px",

    width: "500px",
    height: "300px",
  }),
]);

globalStyle(`${halfCardImageCell} > img`, {
  width: "100%",
  height: "100%",
});

export const halfCardDescriptionCell = style([
  {
    marginBottom: "50px",
  },

  m.medium({
    marginBottom: "0px",
  }),
]);

export const halfCardDescriptionTitle = style([
  {
    fontSize: "20px",
    marginTop: "20px",
    fontWeight: 700,
  },

  m.medium({
    marginTop: "0px",
  }),
]);

export const halfCardDescription = style({});

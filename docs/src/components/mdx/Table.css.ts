import { vars } from "@seed-design/design-token";
import { style } from "@vanilla-extract/css";

import * as m from "../../styles/media.css";

export const tableWrapper = style({
  width: "100%",
  maxWidth: "100%",
  display: "flex",
  overflowX: "auto",
  margin: "20px 0px",
  boxShadow: `inset 0 0 0 1px ${vars.$scale.color.gray100}`,
  borderRadius: "8px",
});

export const table = style([
  {
    flex: "1 0 auto",
    position: "relative",
    borderCollapse: "collapse",
    overflow: "hidden",
  },
]);

export const tableCell = style([
  {
    border: `1px solid ${vars.$scale.color.gray100}`,
    padding: "12px 24px",
    fontSize: "12px",
  },

  m.xsmall({
    fontSize: "14px",
    padding: "12px 16px",
  }),

  m.small({
    fontSize: "14px",
    padding: "16px 25px",
  }),
]);

export const tableHead = style([
  {
    width: "100%",
    overflowX: "auto",
    fontWeight: "600",
    backgroundColor: vars.$semantic.color.paperContents,
    color: vars.$scale.color.gray700,
  },
]);

export const tableBody = style({
  width: "100%",
  overflowX: "auto",
});

export const tableRow = style({});

export const tableData = style([
  tableCell,
  {
    whiteSpace: "nowrap",
    overflow: "hidden",
  },
]);

import { vars } from "@seed-design/design-token";
import { style } from "@vanilla-extract/css";

import * as m from "../../../styles/media.css";

export const tableWrapper = style({
  width: "100%",
  maxWidth: "100%",
  display: "inline-block",
  overflowX: "auto",
  margin: "20px 0px",
  boxShadow: `inset 0 0 0 1px ${vars.$scale.color.gray100}`,
  borderRadius: "8px",
});

export const table = style([
  {
    position: "relative",
    width: "100%",
    maxWidth: "100%",
    display: "inline-block",
    borderCollapse: "collapse",
    overflow: "hidden",
  },

  m.xsmall({
    display: "table",
  }),
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
    fontSize: "16px",
    padding: "16px 30px",
  }),
]);

export const tableHead = style([
  {
    width: "100%",
    overflowX: "auto",
    fontWeight: "600",
    backgroundColor: vars.$scale.color.gray100,
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

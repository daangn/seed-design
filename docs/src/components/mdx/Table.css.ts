import { vars } from "@seed-design/design-token";
import { style } from "@vanilla-extract/css";

import * as m from "../../styles/media.css";

export const table = style({
  width: "100%",
  borderCollapse: "collapse",
  margin: "30px 0px",
  borderRadius: "8px",
  boxShadow: `0 0 0 1px ${vars.$semantic.color.paperContents}`,
  overflow: "hidden",
});

export const tableCell = style([
  {
    border: `1px solid ${vars.$semantic.color.paperContents}`,
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
    fontWeight: "600",
    backgroundColor: vars.$semantic.color.paperContents,
  },
]);

export const tableBody = style({});

export const tableRow = style({});

export const tableData = style([tableCell, {}]);

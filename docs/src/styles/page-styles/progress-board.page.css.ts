import { vars } from "@seed-design/design-token";
import { style } from "@vanilla-extract/css";

import * as t from "../token.css";

export const title = style([t.documentHeading1]);

export const subTitle = style([t.documentHeading2]);

export const caption = style([t.documentCaption1, {}]);

export const tableDataText = style([
  {
    position: "absolute",
    top: 0,
    left: 0,

    fontWeight: 700,
    fontSize: "10px",
    padding: "2px",
  },
]);

export const tableDataTodoText = style([
  tableDataText,
  {
    color: vars.$scale.color.gray600,
  },
]);
export const tableDataInProgressText = style([
  tableDataText,
  {
    color: vars.$scale.color.carrot600,
  },
]);
export const tableDataDoneText = style([
  tableDataText,
  {
    color: vars.$scale.color.green600,
  },
]);

export const tableData = style([
  {
    position: "relative",
    border: `1px solid ${vars.$scale.color.gray100}`,
    textAlign: "center",
  },
]);

export const tableDataTodo = style([
  tableData,
  {
    backgroundColor: vars.$scale.color.gray100,
  },
]);

export const tableInProgDataress = style([
  tableData,
  {
    backgroundColor: vars.$scale.color.carrot100,
  },
]);

export const tableDataDone = style([
  tableData,
  {
    backgroundColor: vars.$scale.color.green100,
  },
]);

export const linkText = style([
  {
    color: vars.$scale.color.blue600,
    fontSize: "12px",

    ":hover": {
      color: vars.$scale.color.blue900,
      textDecoration: "underline",
    },
  },
]);

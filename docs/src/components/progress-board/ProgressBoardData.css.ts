import { vars } from "@seed-design/design-token";
import { style } from "@vanilla-extract/css";

const dataStatusTextBase = style([
  {
    position: "absolute",
    top: 0,
    left: 0,

    fontWeight: 700,
    fontSize: "10px",
    padding: "2px",
  },
]);

export const todoText = style([
  dataStatusTextBase,
  {
    color: vars.$scale.color.gray600,
  },
]);
export const inProgressText = style([
  dataStatusTextBase,
  {
    color: vars.$scale.color.carrot600,
  },
]);
export const doneText = style([
  dataStatusTextBase,
  {
    color: vars.$scale.color.green600,
  },
]);

const dataBase = style([
  {
    position: "relative",
    border: `1px solid ${vars.$scale.color.gray100}`,
    textAlign: "center",
  },
]);

export const todoData = style([
  dataBase,
  {
    backgroundColor: vars.$scale.color.gray100,
  },
]);

export const inProgressData = style([
  dataBase,
  {
    backgroundColor: vars.$scale.color.carrot100,
  },
]);

export const doneData = style([
  dataBase,
  {
    backgroundColor: vars.$scale.color.green100,
  },
]);

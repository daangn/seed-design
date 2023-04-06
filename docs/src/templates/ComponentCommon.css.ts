import { vars } from "@seed-design/design-token";
import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

import * as m from "../styles/media.css";
import * as t from "../styles/token.css";
import * as u from "../styles/utils.css";

export const content = style([t.content]);

export const title = style([t.documentHeading1, { marginTop: "0px" }]);

export const subTitle = style([t.documentHeading2]);

export const titleDescription = style([t.documentCaption1]);

export const thumbnail = style([
  u.flexAlignCenter,
  {
    width: "100%",
    objectFit: "cover",
  },
]);

export const progressContainer = style([
  u.flexAlignCenter,
  {
    width: "100%",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "20px",
  },

  m.small({
    marginBottom: "0px",
  }),
]);

export const progress = recipe({
  base: [
    u.flexCenter,
    {
      flex: "1",
      justifyContent: "space-between",
      whiteSpace: "nowrap",

      padding: "10px 22px",

      borderRadius: "10px",
      border: `1px solid ${vars.$scale.color.gray100}`,
    },

    m.small({
      marginBottom: "40px",
    }),
  ],

  variants: {
    disabled: {
      true: {
        color: vars.$scale.color.gray400,
        pointerEvents: "none",
      },

      false: {
        ":hover": {
          backgroundColor: vars.$scale.color.gray100,
        },
      },
    },
  },
});

export const progressLeft = style([
  u.flexAlignCenter,
  {
    gap: "12px",
  },
]);

export const progressName = style([
  {
    fontSize: "18px",
    fontWeight: "500",
  },
]);

export const progressStatus = style([
  {
    fontSize: "12px",
  },
]);

export const progressIcon = recipe({
  base: [],
  variants: {
    disabled: {
      true: {
        color: vars.$scale.color.gray400,
      },
    },
  },
});

export const progressStatusDone = style([
  {
    borderRadius: "12px",
    padding: "4px 8px",
    color: vars.$scale.color.green700,
    backgroundColor: vars.$scale.color.greenAlpha100,
  },
]);
export const progressStatusInProgress = style([
  {
    borderRadius: "12px",
    padding: "4px 8px",
    color: vars.$scale.color.carrot600,
    backgroundColor: vars.$scale.color.carrotAlpha100,
  },
]);
export const progressStatusTodo = style([{}]);

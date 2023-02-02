import { style } from "@vanilla-extract/css";

import * as t from "../token.css";

export const title = style([t.documentHeading1]);

export const subTitle = style([t.documentHeading2]);

export const caption = style([t.documentCaption1, {}]);

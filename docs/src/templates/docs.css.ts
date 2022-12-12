import { style } from "@vanilla-extract/css";

import * as t from "../styles/token.css";

export const content = style([t.content]);

export const title = style([t.documentHeading1, { marginTop: "20px" }]);

export const titleDescription = style([t.documentCaption1]);

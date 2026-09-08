import { createContext, type Context } from "@lynx-js/react";

/** @internal Prevents controls inside an animated content layer from binding a second target. */
export const ScaleFeedbackContentContext: Context<boolean> = createContext(false);

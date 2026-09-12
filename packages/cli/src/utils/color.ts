import { styleText } from "node:util";

/**
 * `styleText` validates `process.stdout` on its own and honours NO_COLOR, NODE_DISABLE_COLORS
 * and FORCE_COLOR while doing it. It only gained that behaviour in Node 20.18, which is what
 * this package's `engines.node` floor is holding open.
 */
export const highlight = (text: string) => styleText("cyan", text);

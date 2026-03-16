import postcss from "postcss";
import { postcssLynxCompat } from "../src/index";

export async function run(input: string, opts = {}) {
  const result = await postcss([postcssLynxCompat(opts)]).process(input, { from: undefined });
  return result.css;
}

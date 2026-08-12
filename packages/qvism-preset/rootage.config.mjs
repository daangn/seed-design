import seedCss from "./lib/seed-css.js";

/** @type {import("@seed-design/rootage-core/config").RootageConfig} */
export default {
  prefix: "seed",
  plugins: [{ name: "seed-css", tokenCssGenerator: seedCss }],
};

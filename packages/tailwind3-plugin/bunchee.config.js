/**
 * @type {import('bunchee').Options}
 */
export default {
  target: "node",
  externals: ["tailwindcss", "tailwindcss/plugin"],
  format: ["esm", "cjs"],
  declaration: true,
  dts: true,
  outDir: "lib",
};

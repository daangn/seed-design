import { defineWorkspace } from "vitest/config";

/**
 * @see https://vitest.dev/guide/workspace.html
 */
export default defineWorkspace([
  // react-headless
  {
    test: {
      include: ["./packages/react-headless/**/*.test.(tsx|ts)"],
      exclude: ["**/node_modules/**, **/dist/**"],
      environment: "jsdom",
    },
  },

  // component-spec
  {
    test: {
      include: ["./packages/component-spec/**/*.test.(tsx|ts)"],
      name: "node",
      environment: "node",
    },
  },
]);

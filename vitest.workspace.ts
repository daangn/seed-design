import { defineWorkspace } from "vitest/config";

/**
 * @see https://vitest.dev/guide/workspace.html
 */
export default defineWorkspace([
  {
    test: {
      name: "react-headless",
      include: ["./packages/react-headless/**/*.test.(tsx|ts)"],
      exclude: ["**/node_modules/**, **/dist/**"],
      environment: "jsdom",
    },
  },
  {
    test: {
      name: "rootage",
      include: ["./ecosystem/rootage/**/*.test.(tsx|ts)"],
      environment: "node",
    },
  },
]);

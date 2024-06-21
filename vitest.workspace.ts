import { defineWorkspace } from "vitest/config";

/**
 * @see https://vitest.dev/guide/workspace.html
 */
export default defineWorkspace([
  {
    test: {
      include: ["./packages/react-headless/**/*.test.(tsx|ts)"],
      exclude: ["**/node_modules/**, **/dist/**"],
      environment: "jsdom",
    },
  },
  {
    test: {
      include: ["tests/**/*.{node}.test.{ts,js}"],
      name: "node",
      environment: "node",
    },
  },
]);

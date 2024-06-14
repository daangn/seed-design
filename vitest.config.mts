import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["packages/react-headless/**/*.test.(tsx|ts)"],
    exclude: ["**/node_modules/**, **/dist/**"],
    environment: "jsdom",
    reporters: process.env.GITHUB_ACTIONS ? ["dot", "github-actions"] : ["dot"],
  },
});

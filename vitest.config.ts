import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: "react-headless",
          include: ["./packages/react-headless/**/*.test.(tsx|ts)"],
          exclude: ["**/node_modules/**", "**/dist/**"],
          environment: "jsdom",
        },
      },
      {
        test: {
          name: "react",
          include: ["./packages/react/**/*.test.(tsx|ts)"],
          exclude: ["**/node_modules/**", "**/dist/**"],
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
      {
        test: {
          name: "figma",
          include: ["./packages/figma/**/*.test.(tsx|ts)"],
          environment: "node",
        },
      },
      {
        test: {
          name: "cli",
          include: ["./packages/cli/**/*.test.(tsx|ts)"],
          environment: "node",
        },
      },
    ],
  },
});

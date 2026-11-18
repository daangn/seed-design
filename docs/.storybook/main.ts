import { defineMain } from "@storybook/react-vite/node";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

export default defineMain({
  stories: ["../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    getAbsolutePath("@chromatic-com/storybook"),
    {
      name: "@kaptures/storybook/preset",
      options: {
        projectRoot: "..",
        globalInputs: [
          "docs/.storybook/**",
          "docs/public/**",
          "packages/css/**",
          "packages/qvism-preset/**",
          "ecosystem/rootage/**",
        ],
        ignoredInputs: [".changeset/**"],
      },
    },
  ],
  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {},
  },
  staticDirs: ["../public"],
  core: {
    allowedHosts: [".test"],
  },
  // story가 쓰는 `@/*`·`seed-design/*`는 `docs/tsconfig.json`의 `paths`로 해석한다.
  viteFinal: (config) => ({
    ...config,
    resolve: { ...config.resolve, tsconfigPaths: true },
  }),
});

function getAbsolutePath(value: string): string {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}

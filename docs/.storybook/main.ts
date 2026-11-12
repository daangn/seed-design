import { defineMain } from "@storybook/react-vite/node";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { mergeConfig } from "vite";

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
  viteFinal: (config) =>
    mergeConfig(config, {
      plugins: [tailwindcss()],
      // `@/*`와 `seed-design/*`를 `docs/tsconfig.json`의 `paths`로 해석한다.
      resolve: { tsconfigPaths: true },
    }),
});

function getAbsolutePath(value: string): string {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}

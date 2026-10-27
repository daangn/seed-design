import { defineMain } from "@storybook/nextjs-vite/node";
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
    name: getAbsolutePath("@storybook/nextjs-vite"),
    options: {},
  },
  staticDirs: ["../public"],
  viteFinal(config) {
    // staticDirs와 Vite가 같은 public 폴더를 동시에 복사하면 EEXIST가 발생할 수 있습니다.
    return { ...config, build: { ...config.build, copyPublicDir: false } };
  },
  core: {
    allowedHosts: [".test"],
  },
});

function getAbsolutePath(value: string): string {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}

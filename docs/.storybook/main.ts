import { defineMain } from "@storybook/nextjs-vite/node";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

export default defineMain({
  stories: ["../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [getAbsolutePath("@chromatic-com/storybook")],
  framework: {
    name: getAbsolutePath("@storybook/nextjs-vite"),
    options: {},
  },
  staticDirs: ["../public"],
});

function getAbsolutePath(value: string): string {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}

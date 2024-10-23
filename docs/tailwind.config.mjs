import { createPreset } from "fumadocs-ui/tailwind-plugin";
import seedTheme from "./seed-tailwind-theme.mjs";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./content/**/*.{md,mdx}",
    "./mdx-components.{ts,tsx}",
    "../node_modules/fumadocs-ui/dist/**/*.js",
  ],
  theme: seedTheme,
  presets: [createPreset()],
};

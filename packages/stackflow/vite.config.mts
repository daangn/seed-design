import react from "@vitejs/plugin-react";
import { globbySync } from "globby";
import path from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import pkg from "./package.json";

export default defineConfig({
  logLevel: "warn",
  plugins: [
    dts({
      entryRoot: "src",
      staticImport: true,
    }),
    react(),
  ],
  build: {
    target: "esnext",
    minify: false,
    lib: {
      entry: globbySync(["src/**/index.ts", "src/plugin.tsx"]),
    },
    outDir: "lib",
    rollupOptions: {
      logLevel: "silent",
      external: [
        ...Object.keys(pkg.dependencies ?? {}),
        ...Object.keys(pkg.peerDependencies ?? {}),
        /^@seed-design\/css\/.+/,
        "react/jsx-runtime",
      ],
      output: [
        {
          format: "cjs",
          preserveModules: true,
          preserveModulesRoot: "src",
          exports: "named",
          entryFileNames: "[name].cjs",
          banner: ({ fileName }) => renderBanner(fileName),
        },
        {
          format: "es",
          preserveModules: true,
          preserveModulesRoot: "src",
          exports: "named",
          entryFileNames: "[name].js",
          banner: ({ fileName }) => renderBanner(fileName),
        },
      ],
    },
  },
});

const renderBanner = (fileName: string) => {
  const file = path.parse(fileName);
  if (isBarrelFile(file) || isNamespaceFile(file)) {
    return "";
  }
  return `'use client';`;
};

const isBarrelFile = (file: path.ParsedPath) => ["index"].includes(file.name);

const isNamespaceFile = (file: path.ParsedPath) => file.name.includes("namespace");

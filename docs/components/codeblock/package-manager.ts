export interface PackageManagerTabItem {
  value: string;
  label: string;
  code: string;
  lang: string;
}

/** Build npm/yarn/pnpm/bun install-command tabs for a set of dependencies. */
export function packageManagerTabItems(dependencies: string[]): PackageManagerTabItem[] {
  const deps = dependencies.join(" ");
  return [
    { value: "npm", label: "npm", lang: "bash", code: `npm install ${deps}` },
    { value: "yarn", label: "yarn", lang: "bash", code: `yarn add ${deps}` },
    { value: "pnpm", label: "pnpm", lang: "bash", code: `pnpm add ${deps}` },
    { value: "bun", label: "bun", lang: "bash", code: `bun add ${deps}` },
  ];
}

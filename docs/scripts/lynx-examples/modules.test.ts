import { describe, expect, it } from "bun:test";
import { resolve } from "node:path";
import { DOCS_DIRECTORY, EXAMPLES_DIRECTORY } from "./constants.js";
import type { LynxExampleEntry } from "./discovery.js";
import { createCatalogModule, createStandaloneModules } from "./modules.js";

const entries: LynxExampleEntry[] = [
  {
    id: "lynx/badge/preview",
    entryKey: "badge/preview",
    sourcePath: '/fixtures/quo"te.tsx',
  },
  {
    id: "lynx/action-button/disabled",
    entryKey: "action-button/disabled",
    sourcePath: "/fixtures/action-button/disabled.tsx",
  },
];

describe("createStandaloneModules", () => {
  it("정렬된 virtual entry가 원본 default export만 실행한다", () => {
    const virtualActionButton = resolve(
      DOCS_DIRECTORY,
      ".next/lynx-entries/action-button/disabled.tsx",
    );
    const virtualBadge = resolve(DOCS_DIRECTORY, ".next/lynx-entries/badge/preview.tsx");
    const standalone = JSON.stringify(resolve(EXAMPLES_DIRECTORY, "standalone.tsx"));

    expect(createStandaloneModules(entries)).toEqual({
      entries: {
        "action-button/disabled": virtualActionButton,
        "badge/preview": virtualBadge,
      },
      modules: {
        [virtualActionButton]: [
          `import { renderLynxExample } from ${standalone};`,
          'import Example from "/fixtures/action-button/disabled.tsx";',
          "",
          "renderLynxExample(Example);",
          "",
        ].join("\n"),
        [virtualBadge]: [
          `import { renderLynxExample } from ${standalone};`,
          'import Example from "/fixtures/quo\\"te.tsx";',
          "",
          "renderLynxExample(Example);",
          "",
        ].join("\n"),
      },
    });
  });
});

describe("createCatalogModule", () => {
  it("빈 catalog를 유효한 module로 생성한다", () => {
    expect(createCatalogModule([])).toBe(
      [
        'import type { LynxPlaygroundExample } from "./types";',
        "",
        "export const examples = [",
        "] as const satisfies readonly LynxPlaygroundExample[];",
        "",
      ].join("\n"),
    );
  });

  it("원본 경로를 안전하게 인코딩한 lazy catalog를 생성한다", () => {
    expect(createCatalogModule(entries)).toBe(
      [
        'import type { LynxPlaygroundExample } from "./types";',
        "",
        "export const examples = [",
        "  {",
        '    id: "lynx/action-button/disabled",',
        '    component: "action-button",',
        '    scenario: "disabled",',
        '    load: () => import("/fixtures/action-button/disabled.tsx"),',
        "  },",
        "  {",
        '    id: "lynx/badge/preview",',
        '    component: "badge",',
        '    scenario: "preview",',
        '    load: () => import("/fixtures/quo\\"te.tsx"),',
        "  },",
        "] as const satisfies readonly LynxPlaygroundExample[];",
        "",
      ].join("\n"),
    );
  });
});

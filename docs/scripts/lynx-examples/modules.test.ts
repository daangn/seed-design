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
  it("컴포넌트마다 virtual entry 하나가 예제 ID별 원본 default export와 배치를 등록한다", () => {
    const virtualBadge = resolve(DOCS_DIRECTORY, ".next/lynx-entries/badge.tsx");
    const virtualHelpBubble = resolve(DOCS_DIRECTORY, ".next/lynx-entries/help-bubble.tsx");
    const standalone = JSON.stringify(resolve(EXAMPLES_DIRECTORY, "standalone.tsx"));

    expect(
      createStandaloneModules([
        {
          id: "lynx/help-bubble/preview",
          entryKey: "help-bubble/preview",
          sourcePath: "/fixtures/help-bubble/preview.tsx",
        },
        entries[0]!,
        {
          id: "lynx/help-bubble/placement",
          entryKey: "help-bubble/placement",
          sourcePath: "/fixtures/help-bubble/placement.tsx",
        },
      ]),
    ).toEqual({
      entries: {
        badge: virtualBadge,
        "help-bubble": virtualHelpBubble,
      },
      modules: {
        [virtualBadge]: [
          `import { renderLynxExamples } from ${standalone};`,
          'import Example0 from "/fixtures/quo\\"te.tsx";',
          "",
          "renderLynxExamples({",
          '  "lynx/badge/preview": { Example: Example0, layout: "center" },',
          "});",
          "",
        ].join("\n"),
        [virtualHelpBubble]: [
          `import { renderLynxExamples } from ${standalone};`,
          'import Example0 from "/fixtures/help-bubble/placement.tsx";',
          'import Example1 from "/fixtures/help-bubble/preview.tsx";',
          "",
          "renderLynxExamples({",
          '  "lynx/help-bubble/placement": { Example: Example0, layout: "fill" },',
          '  "lynx/help-bubble/preview": { Example: Example1, layout: "center" },',
          "});",
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

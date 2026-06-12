import { describe, expect, test } from "bun:test";
import type { Registry } from "../registry/schema.js";
import {
  collectPackageVersions,
  collectSnippets,
  compareSemver,
  extractSeedPeers,
  filterStableVersions,
  summarizeDeclarationEras,
} from "./generate-compat-manifest.js";

describe("filterStableVersions", () => {
  test("프리릴리즈를 제외하고 semver 오름차순으로 정렬한다", () => {
    const versions = ["1.2.10", "1.10.0", "2.0.0-alpha.1", "1.2.2", "1.0.0-rc.0", "0.9.1"];
    expect(filterStableVersions(versions)).toEqual(["0.9.1", "1.2.2", "1.2.10", "1.10.0"]);
  });
});

describe("compareSemver", () => {
  test("숫자 기준으로 비교한다 (문자열 비교 함정 없음)", () => {
    expect(compareSemver("1.2.10", "1.2.2")).toBeGreaterThan(0);
    expect(compareSemver("1.10.0", "1.2.0")).toBeGreaterThan(0);
    expect(compareSemver("1.1.0", "1.1.0")).toBe(0);
  });
});

describe("extractSeedPeers", () => {
  test("@seed-design/* 만 남긴다", () => {
    expect(
      extractSeedPeers({
        "@seed-design/css": ">=1.1.17",
        react: ">=18.0.0",
        "react-dom": ">=18.0.0",
        "@stackflow/react": ">=1.4.1",
      }),
    ).toEqual({ "@seed-design/css": ">=1.1.17" });
  });

  test("선언이 없으면 빈 객체를 돌려준다", () => {
    expect(extractSeedPeers(undefined)).toEqual({});
  });
});

describe("collectPackageVersions", () => {
  test("stable 버전만 배포일과 함께 수집한다", () => {
    const packument = {
      versions: {
        "1.1.0": {},
        "1.1.10": { peerDependencies: { "@seed-design/css": ">=1.1.10", react: ">=18.0.0" } },
        "2.0.0-alpha.0": { peerDependencies: { "@seed-design/css": "^2.0.0" } },
      },
      time: { "1.1.0": "2025-11-04T00:00:00.000Z", "1.1.10": "2025-12-01T00:00:00.000Z" },
    };

    expect(collectPackageVersions(packument)).toEqual([
      { version: "1.1.0", publishedAt: "2025-11-04T00:00:00.000Z", peers: {} },
      {
        version: "1.1.10",
        publishedAt: "2025-12-01T00:00:00.000Z",
        peers: { "@seed-design/css": ">=1.1.10" },
      },
    ]);
  });
});

describe("collectSnippets", () => {
  test("registry 정의에서 스니펫별 요구 범위를 평탄화한다", () => {
    const registry: Registry = {
      id: "ui",
      items: [
        {
          id: "app-screen",
          snippets: [
            {
              path: "app-screen.tsx",
              dependencies: { "@seed-design/react": "~1.0.0", "@seed-design/css": "~1.0.0" },
            },
            { path: "app-bar.tsx" },
          ],
        },
      ],
    };

    expect(collectSnippets([registry])).toEqual([
      {
        registryId: "ui",
        itemId: "app-screen",
        snippetPath: "app-screen.tsx",
        requires: { "@seed-design/react": "~1.0.0", "@seed-design/css": "~1.0.0" },
      },
      { registryId: "ui", itemId: "app-screen", snippetPath: "app-bar.tsx", requires: {} },
    ]);
  });
});

describe("summarizeDeclarationEras", () => {
  test("선언 모양이 같은 연속 구간을 묶는다 — 핀 시대, 공백 시대, 범위 시대", () => {
    const versions = [
      { version: "1.0.0", publishedAt: "", peers: { "@seed-design/css": "1.0.0" } },
      { version: "1.0.1", publishedAt: "", peers: { "@seed-design/css": "1.0.1" } },
      { version: "1.1.0", publishedAt: "", peers: {} },
      { version: "1.1.8", publishedAt: "", peers: {} },
      { version: "1.1.10", publishedAt: "", peers: { "@seed-design/css": ">=1.1.10" } },
      { version: "1.1.12", publishedAt: "", peers: { "@seed-design/css": ">=1.1.12" } },
    ];

    expect(summarizeDeclarationEras(versions)).toEqual([
      { from: "1.0.0", to: "1.0.1", count: 2, label: "정확한 핀 (lockstep)" },
      { from: "1.1.0", to: "1.1.8", count: 2, label: "(선언 없음)" },
      { from: "1.1.10", to: "1.1.10", count: 1, label: "@seed-design/css: >=1.1.10" },
      { from: "1.1.12", to: "1.1.12", count: 1, label: "@seed-design/css: >=1.1.12" },
    ]);
  });
});

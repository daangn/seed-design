import { afterEach, describe, expect, it } from "bun:test";
import fs from "fs-extra";
import os from "os";
import path from "path";
import type { CompatManifest, PublicRegistry } from "@/src/schema";
import {
  analyzePackagePeerCompatibility,
  analyzeRegistryItemCompatibility,
  findInstalledSnippetItemKeys,
  resolveEffectivePeers,
} from "../utils/compatibility";

const registries: PublicRegistry[] = [
  {
    id: "ui",
    items: [
      {
        id: "action-button",
        snippets: [
          {
            path: "action-button.tsx",
            dependencies: {
              "@seed-design/react": "~1.0.0",
              "@seed-design/css": "~1.0.0",
            },
          },
        ],
      },
      {
        id: "checkbox",
        snippets: [
          {
            path: "checkbox.tsx",
            dependencies: {
              "@seed-design/react": "~1.2.0",
              "@seed-design/css": "~1.2.0",
            },
          },
        ],
      },
    ],
  },
];

describe("analyzeRegistryItemCompatibility", () => {
  it("정확한 버전이 모두 호환되면 이슈가 없어야 함", () => {
    const report = analyzeRegistryItemCompatibility({
      publicRegistries: registries,
      itemKeys: ["ui:action-button"],
      projectPackageVersions: {
        "@seed-design/react": "1.0.9",
        "@seed-design/css": "1.0.2",
      },
    });

    expect(report.issues).toHaveLength(0);
  });

  it("요구 범위를 만족하지 못하면 incompatible 이슈를 리턴해야 함", () => {
    const report = analyzeRegistryItemCompatibility({
      publicRegistries: registries,
      itemKeys: ["ui:checkbox"],
      projectPackageVersions: {
        "@seed-design/react": "1.1.0",
        "@seed-design/css": "1.2.1",
      },
    });

    expect(report.issues).toHaveLength(1);
    expect(report.issues[0]).toMatchObject({
      itemKey: "ui:checkbox",
      packageName: "@seed-design/react",
      type: "incompatible-version",
    });
  });

  it("패키지가 없으면 missing-package 이슈를 리턴해야 함", () => {
    const report = analyzeRegistryItemCompatibility({
      publicRegistries: registries,
      itemKeys: ["ui:action-button"],
      projectPackageVersions: {
        "@seed-design/react": "1.0.9",
      },
    });

    expect(report.issues).toHaveLength(1);
    expect(report.issues[0]).toMatchObject({
      itemKey: "ui:action-button",
      packageName: "@seed-design/css",
      type: "missing-package",
    });
  });

  it("workspace range처럼 버전 스펙이 range여도 교집합이 있으면 호환으로 처리해야 함", () => {
    const report = analyzeRegistryItemCompatibility({
      publicRegistries: registries,
      itemKeys: ["ui:action-button"],
      projectPackageVersions: {
        "@seed-design/react": "workspace:^1.0.0",
        "@seed-design/css": "workspace:^1.0.0",
      },
    });

    expect(report.issues).toHaveLength(0);
  });

  it("해석할 수 없는 버전 스펙이면 invalid-version-spec 이슈를 리턴해야 함", () => {
    const report = analyzeRegistryItemCompatibility({
      publicRegistries: registries,
      itemKeys: ["ui:action-button"],
      projectPackageVersions: {
        "@seed-design/react": "workspace:*",
        "@seed-design/css": "1.0.2",
      },
    });

    expect(report.issues).toHaveLength(1);
    expect(report.issues[0]).toMatchObject({
      itemKey: "ui:action-button",
      packageName: "@seed-design/react",
      type: "invalid-version-spec",
    });
  });
});

describe("findInstalledSnippetItemKeys", () => {
  const tempDirs: string[] = [];

  afterEach(async () => {
    while (tempDirs.length > 0) {
      const dir = tempDirs.pop();
      if (dir) await fs.remove(dir);
    }
  });

  it("jsx/js 변환 케이스도 설치된 스니펫으로 인식해야 함", async () => {
    const rootPath = await fs.mkdtemp(path.join(os.tmpdir(), "seed-cli-compat-"));
    tempDirs.push(rootPath);

    await fs.ensureDir(path.join(rootPath, "ui"));
    await fs.writeFile(path.join(rootPath, "ui", "action-button.jsx"), "export {};");

    const installed = findInstalledSnippetItemKeys({
      publicRegistries: registries,
      rootPath,
    });

    expect(installed).toEqual(["ui:action-button"]);
  });
});

const manifest: CompatManifest = {
  schemaVersion: 1,
  framework: "react",
  generatedAt: "2026-06-12T00:00:00.000Z",
  packages: {
    "@seed-design/css": {
      versions: [
        { version: "1.1.10", publishedAt: "", peers: {} },
        { version: "1.1.16", publishedAt: "", peers: {} },
        { version: "1.1.17", publishedAt: "", peers: {} },
      ],
    },
    "@seed-design/react": {
      versions: [
        { version: "1.1.5", publishedAt: "", peers: {} }, // 선언 누락 (backfill 대상)
        { version: "1.1.12", publishedAt: "", peers: { "@seed-design/css": ">=1.1.12" } },
        { version: "1.2.5", publishedAt: "", peers: { "@seed-design/css": ">=1.1.17" } }, // 과대선언
      ],
    },
    "@seed-design/stackflow": {
      versions: [{ version: "1.1.16", publishedAt: "", peers: { "@seed-design/css": ">=1.1.16" } }],
    },
  },
  snippets: [],
  overlays: [
    {
      kind: "backfill",
      package: "@seed-design/react",
      versionRange: ">=1.1.0 <1.1.10",
      peers: { "@seed-design/css": "~1.1.0" },
      reason: "lockstep era",
    },
    {
      kind: "correction",
      package: "@seed-design/react",
      versionRange: ">=1.2.0 <1.3.0",
      peers: { "@seed-design/css": "~1.2.0" },
      reason: "over-broad floor",
    },
  ],
};

describe("resolveEffectivePeers", () => {
  it("선언이 있으면 그대로 돌려준다", () => {
    expect(
      resolveEffectivePeers({ packageName: "@seed-design/react", version: "1.1.12", manifest }),
    ).toEqual({
      "@seed-design/css": ">=1.1.12",
    });
  });

  it("correction overlay가 선언을 덮어쓴다", () => {
    expect(
      resolveEffectivePeers({ packageName: "@seed-design/react", version: "1.2.5", manifest }),
    ).toEqual({
      "@seed-design/css": "~1.2.0",
    });
  });

  it("backfill overlay가 선언 누락 구간을 채운다", () => {
    expect(
      resolveEffectivePeers({ packageName: "@seed-design/react", version: "1.1.5", manifest }),
    ).toEqual({
      "@seed-design/css": "~1.1.0",
    });
  });
});

describe("analyzePackagePeerCompatibility", () => {
  it("모두 만족하면 ok", () => {
    const report = analyzePackagePeerCompatibility({
      manifest,
      installedVersions: { "@seed-design/react": "1.1.12", "@seed-design/css": "1.1.16" },
    });
    expect(report.ok).toBe(true);
    expect(report.issues).toHaveLength(0);
  });

  it("react가 css 하한을 위반하면 issue와 resolution", () => {
    const report = analyzePackagePeerCompatibility({
      manifest,
      installedVersions: { "@seed-design/react": "1.1.12", "@seed-design/css": "1.1.10" },
    });
    expect(report.ok).toBe(false);
    expect(report.issues).toHaveLength(1);
    expect(report.issues[0]).toMatchObject({ requires: "@seed-design/css", installed: "1.1.10" });
    expect(report.resolution).toEqual({ "@seed-design/css": ">=1.1.12" });
  });

  it("react와 stackflow 하한이 다르면 resolution은 최대 하한", () => {
    const report = analyzePackagePeerCompatibility({
      manifest,
      installedVersions: {
        "@seed-design/react": "1.1.12",
        "@seed-design/stackflow": "1.1.16",
        "@seed-design/css": "1.1.10",
      },
    });
    expect(report.issues).toHaveLength(2);
    expect(report.resolution).toEqual({ "@seed-design/css": ">=1.1.16" });
  });

  it("correction overlay가 적용되어 과대선언 구간을 잡는다", () => {
    // declared(>=1.1.17)만이면 css 1.1.17은 통과하지만, correction(~1.2.0)으로 위반이 됨
    const report = analyzePackagePeerCompatibility({
      manifest,
      installedVersions: { "@seed-design/react": "1.2.5", "@seed-design/css": "1.1.17" },
    });
    expect(report.ok).toBe(false);
    expect(report.resolution).toEqual({ "@seed-design/css": ">=1.2.0" });
  });

  it("manifest에 없고 fallback 선언도 없는 버전은 unchecked로 보고한다", () => {
    const report = analyzePackagePeerCompatibility({
      manifest,
      installedVersions: { "@seed-design/react": "9.9.9", "@seed-design/css": "1.1.10" },
    });
    // 검사 불가와 통과를 구분: ok는 유지하되 unchecked로 노출
    expect(report.ok).toBe(true);
    expect(report.unchecked).toEqual([{ package: "@seed-design/react", version: "9.9.9" }]);
  });

  it("manifest에 없는 버전은 설치본 peer 선언(declaredPeers)으로 판정한다", () => {
    // 2.0 이후 시나리오: 스냅샷 이후 릴리즈된 버전은 npm 선언이 곧 정답
    const report = analyzePackagePeerCompatibility({
      manifest,
      installedVersions: { "@seed-design/react": "2.0.1", "@seed-design/css": "1.1.16" },
      declaredPeers: { "@seed-design/react": { "@seed-design/css": "^2.0.0" } },
    });
    expect(report.ok).toBe(false);
    expect(report.unchecked).toHaveLength(0);
    expect(report.issues[0]).toMatchObject({
      from: "@seed-design/react@2.0.1",
      requires: "@seed-design/css",
      range: "^2.0.0",
      direction: "installed-too-low",
    });
    expect(report.resolution).toEqual({ "@seed-design/css": ">=2.0.0" });
  });

  it("설치본이 요구 범위보다 높으면 installed-too-high로 표시하고 resolution에서 제외한다", () => {
    // react 1.1.5는 backfill(~1.1.0)로 css 상한이 있는데 css가 그보다 높음 — 해법은 react 업그레이드
    const report = analyzePackagePeerCompatibility({
      manifest,
      installedVersions: { "@seed-design/react": "1.1.5", "@seed-design/css": "1.2.5" },
    });
    expect(report.ok).toBe(false);
    expect(report.issues[0]).toMatchObject({
      from: "@seed-design/react@1.1.5",
      direction: "installed-too-high",
    });
    // 대상(css)을 올리라는 제안은 오답이므로 나오지 않아야 함
    expect(report.resolution).toEqual({});
    // css 1.2.5 자체는 manifest에 없어 unchecked
    expect(report.unchecked).toEqual([{ package: "@seed-design/css", version: "1.2.5" }]);
  });

  it("manifest에 없어도 overlay 범위에 걸리면 overlay로 판정한다", () => {
    // --with 가정 버전 등 설치본 선언이 없어도 correction(>=1.2.0 <1.3.0)이 커버
    const report = analyzePackagePeerCompatibility({
      manifest,
      installedVersions: { "@seed-design/react": "1.2.7", "@seed-design/css": "1.1.17" },
    });
    expect(report.unchecked).toHaveLength(0);
    expect(report.ok).toBe(false);
    expect(report.resolution).toEqual({ "@seed-design/css": ">=1.2.0" });
  });

  it("미설치 대상은 missing 이슈로 보고한다", () => {
    const report = analyzePackagePeerCompatibility({
      manifest,
      installedVersions: { "@seed-design/react": "1.1.12" }, // css 미설치
    });
    expect(report.issues).toHaveLength(1);
    expect(report.issues[0]).toMatchObject({ requires: "@seed-design/css", type: "missing" });
  });
});

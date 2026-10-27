import { afterEach, describe, expect, it } from "bun:test";
import fs from "fs-extra";
import os from "os";
import path from "path";
import type { PublicRegistry } from "@/src/schema";
import {
  analyzeRegistryItemCompatibility,
  findInstalledSnippetItemKeys,
  getProjectSeedPackageVersionSpecs,
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

  it("Stackflow 스니펫이 요구하는 @seed-design/stackflow 범위도 검사해야 함", () => {
    const report = analyzeRegistryItemCompatibility({
      publicRegistries: [
        {
          id: "ui",
          items: [
            {
              id: "app-screen",
              snippets: [
                {
                  path: "app-bar.tsx",
                  dependencies: {
                    "@seed-design/react": "^3.0.0",
                    "@seed-design/stackflow": "^2.1.0",
                  },
                },
              ],
            },
          ],
        },
      ],
      itemKeys: ["ui:app-screen"],
      projectPackageVersions: {
        "@seed-design/react": "3.0.1",
        "@seed-design/stackflow": "2.0.6",
      },
    });

    expect(report.issues).toHaveLength(1);
    expect(report.issues[0]).toMatchObject({
      itemKey: "ui:app-screen",
      packageName: "@seed-design/stackflow",
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

describe("getProjectSeedPackageVersionSpecs", () => {
  const tempDirs: string[] = [];

  afterEach(async () => {
    while (tempDirs.length > 0) {
      const dir = tempDirs.pop();
      if (dir) await fs.remove(dir);
    }
  });

  async function makeProject(packageJson: object) {
    const rootPath = await fs.mkdtemp(path.join(os.tmpdir(), "seed-cli-specs-"));
    tempDirs.push(rootPath);
    await fs.writeJSON(path.join(rootPath, "package.json"), packageJson);
    await fs.ensureDir(path.join(rootPath, "node_modules", "@seed-design", "react"));
    await fs.writeJSON(
      path.join(rootPath, "node_modules", "@seed-design", "react", "package.json"),
      { name: "@seed-design/react", version: "2.0.4" },
    );
    return rootPath;
  }

  it("선언이 범위여도 설치본이 있으면 설치 버전을 쓴다", async () => {
    const rootPath = await makeProject({
      name: "app",
      dependencies: { "@seed-design/react": "^2.0.0" },
    });

    expect(getProjectSeedPackageVersionSpecs(rootPath)["@seed-design/react"]).toBe("2.0.4");
  });

  it("설치본이 없으면 package.json 선언을 쓴다", async () => {
    const rootPath = await makeProject({
      name: "app",
      dependencies: { "@seed-design/css": "^3.0.0" },
    });

    expect(getProjectSeedPackageVersionSpecs(rootPath)["@seed-design/css"]).toBe("^3.0.0");
  });

  it("선언 범위가 요구 범위와 겹쳐도 설치된 Stackflow가 낮으면 경고한다", async () => {
    const rootPath = await makeProject({
      name: "app",
      dependencies: { "@seed-design/stackflow": "^2.0.6" },
    });
    await fs.outputJSON(
      path.join(rootPath, "node_modules", "@seed-design", "stackflow", "package.json"),
      { name: "@seed-design/stackflow", version: "2.0.6" },
    );

    const report = analyzeRegistryItemCompatibility({
      publicRegistries: [
        {
          id: "ui",
          items: [
            {
              id: "app-screen",
              snippets: [
                { path: "app-bar.tsx", dependencies: { "@seed-design/stackflow": "^2.1.0" } },
              ],
            },
          ],
        },
      ],
      itemKeys: ["ui:app-screen"],
      projectPackageVersions: getProjectSeedPackageVersionSpecs(rootPath),
    });

    expect(report.issues).toEqual([
      expect.objectContaining({
        packageName: "@seed-design/stackflow",
        installedVersionSpec: "2.0.6",
        type: "incompatible-version",
      }),
    ]);
  });

  it("선언이 없어도 설치본이 있으면 미설치로 보지 않는다 (모노레포 호이스팅)", async () => {
    const rootPath = await makeProject({ name: "app" });

    expect(getProjectSeedPackageVersionSpecs(rootPath)["@seed-design/react"]).toBe("2.0.4");
  });
});

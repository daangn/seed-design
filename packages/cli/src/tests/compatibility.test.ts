import { afterEach, describe, expect, it } from "bun:test";
import fs from "fs-extra";
import os from "os";
import path from "path";
import type { PublicRegistry } from "@/src/schema";
import {
  analyzeRegistryItemCompatibility,
  checkRegistryItemCompatibility,
  findInstalledSnippetItemKeys,
  getProjectPackageVersionSpecs,
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
      {
        id: "app-screen",
        snippets: [
          {
            path: "app-screen.tsx",
            dependencies: {
              "@seed-design/react": "^2.0.0",
              "@stackflow/react": "^2.0.0",
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

    expect(report.checkedPackageNames).toEqual(["@seed-design/react", "@seed-design/css"]);
    expect(report.issues).toHaveLength(0);
  });

  it("스니펫이 선언하면 @seed-design 밖의 패키지도 검사해야 함", () => {
    const report = analyzeRegistryItemCompatibility({
      publicRegistries: registries,
      itemKeys: ["ui:app-screen"],
      projectPackageVersions: {
        "@seed-design/react": "2.4.1",
        "@stackflow/react": "^1.9.0",
      },
    });

    expect(report.checkedPackageNames).toEqual(["@seed-design/react", "@stackflow/react"]);
    expect(report.issues).toEqual([
      {
        itemKey: "ui:app-screen",
        packageName: "@stackflow/react",
        requiredRanges: ["^2.0.0"],
        installedVersionSpec: "^1.9.0",
        type: "incompatible-version",
      },
    ]);
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

describe("checkRegistryItemCompatibility", () => {
  const tempDirs: string[] = [];

  afterEach(async () => {
    while (tempDirs.length > 0) {
      const dir = tempDirs.pop();
      if (dir) await fs.remove(dir);
    }
  });

  async function makeProject() {
    const rootPath = await fs.mkdtemp(path.join(os.tmpdir(), "seed-cli-check-"));
    tempDirs.push(rootPath);
    await fs.writeJSON(path.join(rootPath, "package.json"), {
      name: "app",
      dependencies: {
        "@seed-design/react": "^2.4.1",
        "@seed-design/css": "^2.8.2",
        "@stackflow/react": "^1.9.0",
      },
    });
    return rootPath;
  }

  it("검사 대상 항목이 선언한 패키지만 프로젝트에서 조회해야 함", async () => {
    const report = checkRegistryItemCompatibility({
      publicRegistries: registries,
      itemKeys: ["ui:action-button"],
      cwd: await makeProject(),
    });

    expect(report.projectPackageVersions).toEqual({
      "@seed-design/react": "^2.4.1",
      "@seed-design/css": "^2.8.2",
    });
  });

  it("선언한 패키지의 설치 버전이 범위를 벗어나면 이슈를 리턴해야 함", async () => {
    const report = checkRegistryItemCompatibility({
      publicRegistries: registries,
      itemKeys: ["ui:app-screen"],
      cwd: await makeProject(),
    });

    expect(report.issues).toEqual([
      {
        itemKey: "ui:app-screen",
        packageName: "@stackflow/react",
        requiredRanges: ["^2.0.0"],
        installedVersionSpec: "^1.9.0",
        type: "incompatible-version",
      },
    ]);
  });
});

describe("getProjectPackageVersionSpecs", () => {
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

  it("package.json 선언이 있으면 선언을 그대로 쓴다", async () => {
    const rootPath = await makeProject({
      name: "app",
      dependencies: { "@seed-design/react": "^2.0.0" },
    });

    expect(getProjectPackageVersionSpecs(rootPath, ["@seed-design/react"])).toEqual({
      "@seed-design/react": "^2.0.0",
    });
  });

  it("선언이 없어도 설치본이 있으면 미설치로 보지 않는다 (모노레포 호이스팅)", async () => {
    const rootPath = await makeProject({ name: "app" });

    expect(getProjectPackageVersionSpecs(rootPath, ["@seed-design/react"])).toEqual({
      "@seed-design/react": "2.0.4",
    });
  });
});

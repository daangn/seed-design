import { describe, expect, test } from "bun:test";
import { join } from "node:path";
import { validateVersionPeerDependencies } from "./check-version-peer-deps";

const repositoryRoot = join(import.meta.dir, "../..");
const githubExpression = (expression: string): string => ["$", "{{ ", expression, " }}"].join("");

function createManifest(
  name: string,
  version: string,
  peerDependency?: { name: string; range: string },
): string {
  return `${JSON.stringify(
    {
      name,
      version,
      ...(peerDependency
        ? {
            peerDependencies: {
              [peerDependency.name]: peerDependency.range,
              react: ">=18.0.0",
            },
          }
        : {}),
    },
    null,
    2,
  )}\n`;
}

function createFixture(overrides?: {
  baseCssVersion?: string;
  basePeerRange?: string;
  baseReactVersion?: string;
  cssVersion?: string;
  peerRange?: string;
  reactVersion?: string;
}) {
  const values = {
    baseCssVersion: "2.5.0",
    basePeerRange: "^2.5.0",
    baseReactVersion: "2.3.0",
    cssVersion: "2.6.0",
    peerRange: "^2.6.0",
    reactVersion: "2.4.0",
    ...overrides,
  };

  return {
    baseCssManifest: createManifest("@seed-design/css", values.baseCssVersion),
    baseReactManifest: createManifest("@seed-design/react", values.baseReactVersion, {
      name: "@seed-design/css",
      range: values.basePeerRange,
    }),
    baseLynxCssManifest: createManifest("@seed-design/lynx-css", "0.8.0"),
    baseLynxReactManifest: createManifest("@seed-design/lynx-react", "0.4.0", {
      name: "@seed-design/lynx-css",
      range: "0.0.0 || >=0.8.0 <1.0.0",
    }),
    sourceCssManifest: createManifest("@seed-design/css", values.cssVersion),
    sourceReactManifest: createManifest("@seed-design/react", values.reactVersion, {
      name: "@seed-design/css",
      range: values.peerRange,
    }),
    sourceLynxCssManifest: createManifest("@seed-design/lynx-css", "0.8.0"),
    sourceLynxReactManifest: createManifest("@seed-design/lynx-react", "0.4.0", {
      name: "@seed-design/lynx-css",
      range: "0.0.0 || >=0.8.0 <1.0.0",
    }),
  };
}

function createLynxFixture(overrides?: {
  baseLynxCssVersion?: string;
  baseLynxReactVersion?: string;
  basePeerRange?: string;
  lynxCssVersion?: string;
  lynxReactVersion?: string;
  peerRange?: string;
}) {
  const values = {
    baseLynxCssVersion: "0.8.1",
    baseLynxReactVersion: "0.4.1",
    basePeerRange: "0.0.0 || >=0.8.0 <1.0.0",
    lynxCssVersion: "0.9.0",
    lynxReactVersion: "0.5.0",
    peerRange: "0.0.0 || >=0.9.0 <1.0.0",
    ...overrides,
  };

  return {
    ...createFixture({
      cssVersion: "2.5.0",
      peerRange: "^2.5.0",
      reactVersion: "2.3.0",
    }),
    baseLynxCssManifest: createManifest("@seed-design/lynx-css", values.baseLynxCssVersion),
    baseLynxReactManifest: createManifest("@seed-design/lynx-react", values.baseLynxReactVersion, {
      name: "@seed-design/lynx-css",
      range: values.basePeerRange,
    }),
    sourceLynxCssManifest: createManifest("@seed-design/lynx-css", values.lynxCssVersion),
    sourceLynxReactManifest: createManifest("@seed-design/lynx-react", values.lynxReactVersion, {
      name: "@seed-design/lynx-css",
      range: values.peerRange,
    }),
  };
}

describe("Version Packages peer dependency 검사", () => {
  test("CSS와 React 버전 및 peer 범위가 함께 오르면 통과한다", () => {
    expect(validateVersionPeerDependencies(createFixture())).toEqual({
      react: {
        checked: true,
        dependencyVersion: "2.6.0",
        dependentVersion: "2.4.0",
      },
      lynxReact: {
        checked: false,
        dependencyVersion: "0.8.0",
        dependentVersion: "0.4.0",
      },
    });
  });

  test("CSS와 React 버전이 올랐지만 peer 범위가 그대로면 실패한다", () => {
    expect(() => validateVersionPeerDependencies(createFixture({ peerRange: "^2.5.0" }))).toThrow(
      "peerDependency가 변경되지 않았습니다",
    );
  });

  test("변경한 peer 범위가 새 CSS 버전과 다르면 실패한다", () => {
    expect(() => validateVersionPeerDependencies(createFixture({ peerRange: "^2.5.1" }))).toThrow(
      "peerDependency가 새 버전과 다릅니다",
    );
  });

  test("CSS 또는 React 중 한 패키지만 버전이 바뀌면 건너뛴다", () => {
    expect(
      validateVersionPeerDependencies(
        createFixture({ reactVersion: "2.3.0", peerRange: "^2.5.0" }),
      ),
    ).toMatchObject({
      react: { checked: false, dependencyVersion: "2.6.0", dependentVersion: "2.3.0" },
    });
    expect(
      validateVersionPeerDependencies(createFixture({ cssVersion: "2.5.0", peerRange: "^2.5.0" })),
    ).toMatchObject({
      react: { checked: false, dependencyVersion: "2.5.0", dependentVersion: "2.4.0" },
    });
  });

  test("Lynx CSS와 Lynx React 버전 및 peer 범위가 함께 오르면 통과한다", () => {
    expect(validateVersionPeerDependencies(createLynxFixture())).toMatchObject({
      lynxReact: {
        checked: true,
        dependencyVersion: "0.9.0",
        dependentVersion: "0.5.0",
      },
    });
  });

  test("Lynx 버전이 함께 올랐지만 peer 범위가 그대로면 실패한다", () => {
    expect(() =>
      validateVersionPeerDependencies(createLynxFixture({ peerRange: "0.0.0 || >=0.8.0 <1.0.0" })),
    ).toThrow("peerDependency가 변경되지 않았습니다");
  });

  test("Lynx CSS patch만 올랐다면 같은 마이너 peer 범위를 허용한다", () => {
    expect(
      validateVersionPeerDependencies(
        createLynxFixture({
          baseLynxCssVersion: "0.9.0",
          basePeerRange: "0.0.0 || >=0.9.0 <1.0.0",
          lynxCssVersion: "0.9.1",
          peerRange: "0.0.0 || >=0.9.0 <1.0.0",
        }),
      ),
    ).toMatchObject({ lynxReact: { checked: true } });
  });

  test("Version Packages PR에서 신뢰된 검사 코드로 정확한 head를 검사한다", async () => {
    const workflow = await Bun.file(
      join(repositoryRoot, ".github/workflows/version-peer-deps-merge-blocker.yml"),
    ).text();

    expect(workflow).toContain("pull_request_target:");
    expect(workflow).toContain("branches: [dev]");
    expect(workflow).toContain("types: [opened, reopened, synchronize, edited]");
    expect(workflow).toContain("contents: read");
    expect(workflow).toContain("changeset-release/dev");
    expect(workflow).toContain(
      "github.event.pull_request.head.repo.full_name == github.repository",
    );
    expect(workflow).toContain(`ref: ${githubExpression("github.event.pull_request.base.sha")}`);
    expect(workflow).toContain(`ref: ${githubExpression("github.event.pull_request.head.sha")}`);
    expect(workflow).toContain("persist-credentials: false");
    expect(workflow).toContain("working-directory: control");
    expect(workflow).toContain("bun .github/scripts/check-version-peer-deps.ts");
    expect(workflow).toContain("--root ../source");
    expect(workflow).not.toContain("bun ../control/.github/scripts/check-version-peer-deps.ts");
    expect(workflow).toContain("Check React and Lynx peer dependency ranges");
  });
});

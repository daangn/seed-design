import { describe, expect, test } from "bun:test";
import { join } from "node:path";
import {
  compareStableVersions,
  parseStableVersion,
  synchronizeLynxPeerDependencyText,
  synchronizePeerDependencyText,
} from "./bump-peer-deps";

const repositoryRoot = join(import.meta.dir, "../..");
const githubExpression = (expression: string): string => ["$", "{{ ", expression, " }}"].join("");

function createFixture(peerRange = "^2.4.0") {
  return {
    cssManifest: `${JSON.stringify({ name: "@seed-design/css", version: "2.5.0" }, null, 2)}\n`,
    reactManifest: `${JSON.stringify(
      {
        name: "@seed-design/react",
        version: "2.3.0",
        peerDependencies: {
          "@seed-design/css": peerRange,
          react: ">=18.0.0",
        },
      },
      null,
      2,
    )}\n`,
    lockfile: `{\n  "lockfileVersion": 1,\n  "workspaces": {\n    "packages/lynx-react": {\n      "peerDependencies": {\n        "@seed-design/lynx-css": "0.0.0 || >=0.1.0 <1.0.0",\n      },\n    },\n    "packages/react": {\n      "dependencies": {},\n      "peerDependencies": {\n        "@seed-design/css": "${peerRange}",\n        "react": ">=18.0.0",\n      },\n    },\n    "packages/react-headless/accordion": {\n      "peerDependencies": {\n        "react": ">=18.0.0",\n      },\n    },\n  },\n}\n`,
  };
}

function createLynxFixture(peerRange = "0.0.0 || >=0.1.0 <1.0.0", version = "0.8.0") {
  return {
    lynxCssManifest: `${JSON.stringify({ name: "@seed-design/lynx-css", version }, null, 2)}\n`,
    lynxReactManifest: `${JSON.stringify(
      {
        name: "@seed-design/lynx-react",
        version: "0.4.0",
        peerDependencies: {
          "@lynx-js/react": ">=0.117.0",
          "@seed-design/lynx-css": peerRange,
        },
      },
      null,
      2,
    )}\n`,
    lockfile: `{\n  "lockfileVersion": 1,\n  "workspaces": {\n    "packages/lynx-react": {\n      "peerDependencies": {\n        "@lynx-js/react": ">=0.117.0",\n        "@seed-design/lynx-css": "${peerRange}",\n      },\n    },\n    "packages/react": {\n      "peerDependencies": {\n        "@seed-design/css": "^2.5.0",\n      },\n    },\n  },\n}\n`,
  };
}

describe("peer dependency 동기화", () => {
  test("CSS 버전에 맞춰 React manifest와 lockfile만 갱신한다", () => {
    const fixture = createFixture();
    const result = synchronizePeerDependencyText(fixture);

    expect(result).toMatchObject({
      changed: true,
      cssVersion: "2.5.0",
      previousRange: "^2.4.0",
      desiredRange: "^2.5.0",
    });
    expect(result.reactManifest).toContain('"@seed-design/css": "^2.5.0"');
    expect(result.lockfile).toContain('"@seed-design/css": "^2.5.0"');
    expect(result.reactManifest.replace('"^2.5.0"', '"^2.4.0"')).toBe(fixture.reactManifest);
    expect(result.lockfile.replace('"^2.5.0"', '"^2.4.0"')).toBe(fixture.lockfile);
    expect(result.lockfile).toContain('"@seed-design/lynx-css": "0.0.0 || >=0.1.0 <1.0.0"');
  });

  test("이미 같은 범위이면 변경하지 않는다", () => {
    const fixture = createFixture("^2.5.0");
    const result = synchronizePeerDependencyText(fixture);

    expect(result.changed).toBe(false);
    expect(result.reactManifest).toBe(fixture.reactManifest);
    expect(result.lockfile).toBe(fixture.lockfile);
  });

  test("manifest와 lockfile의 현재 범위가 다르면 실패한다", () => {
    const fixture = createFixture();

    expect(() =>
      synchronizePeerDependencyText({
        ...fixture,
        lockfile: fixture.lockfile.replace('"^2.4.0"', '"^2.3.0"'),
      }),
    ).toThrow("항목을 정확히 하나 찾지 못했습니다");
  });

  test("caret 안정 버전이 아닌 기존 peer 범위는 거부한다", () => {
    expect(() => synchronizePeerDependencyText(createFixture("workspace:*"))).toThrow(
      "caret 안정 버전 범위가 아닙니다",
    );
  });

  test("안정 버전만 받고 버전 상승을 비교한다", () => {
    expect(parseStableVersion("2.5.0")).toEqual([2, 5, 0]);
    expect(compareStableVersions("2.5.0", "2.4.2")).toBeGreaterThan(0);
    expect(compareStableVersions("2.5.0", "2.5.0")).toBe(0);
    expect(() => parseStableVersion("2.5.0-next.1")).toThrow("안정 버전 형식");
  });
});

describe("Lynx peer dependency 동기화", () => {
  test("Lynx CSS 버전에 맞춰 범위의 마이너 하한만 갱신한다", () => {
    const fixture = createLynxFixture();
    const result = synchronizeLynxPeerDependencyText(fixture);
    const desiredRange = "0.0.0 || >=0.8.0 <1.0.0";

    expect(result).toMatchObject({
      changed: true,
      cssVersion: "0.8.0",
      previousRange: "0.0.0 || >=0.1.0 <1.0.0",
      desiredRange,
    });
    expect(result.reactManifest).toBe(
      fixture.lynxReactManifest.replace("0.0.0 || >=0.1.0 <1.0.0", desiredRange),
    );
    expect(result.lockfile).toBe(fixture.lockfile.replace("0.0.0 || >=0.1.0 <1.0.0", desiredRange));
  });

  test("patch 버전은 peer 범위에 반영하지 않는다", () => {
    const fixture = createLynxFixture("0.0.0 || >=0.7.0 <1.0.0", "0.8.3");
    const result = synchronizeLynxPeerDependencyText(fixture);

    expect(result.desiredRange).toBe("0.0.0 || >=0.8.0 <1.0.0");
  });

  test("이미 같은 마이너 범위이면 변경하지 않는다", () => {
    const fixture = createLynxFixture("0.0.0 || >=0.8.0 <1.0.0", "0.8.3");
    const result = synchronizeLynxPeerDependencyText(fixture);

    expect(result.changed).toBe(false);
    expect(result.reactManifest).toBe(fixture.lynxReactManifest);
    expect(result.lockfile).toBe(fixture.lockfile);
  });

  test("지원하는 Lynx 범위 형식이 아니면 실패한다", () => {
    expect(() => synchronizeLynxPeerDependencyText(createLynxFixture("^0.8.0"))).toThrow(
      "peerDependency 범위가 올바르지 않습니다",
    );
  });

  test("Lynx CSS 1.0.0 이상은 실패한다", () => {
    expect(() => synchronizeLynxPeerDependencyText(createLynxFixture(undefined, "1.0.0"))).toThrow(
      "major가 0이 아닙니다",
    );
  });

  test("CSS와 Lynx CSS 범위를 같은 lockfile에 함께 반영한다", () => {
    const reactFixture = createFixture();
    const lynxFixture = createLynxFixture();
    const reactResult = synchronizePeerDependencyText(reactFixture);
    const lynxResult = synchronizeLynxPeerDependencyText({
      ...lynxFixture,
      lockfile: reactResult.lockfile,
    });

    expect(lynxResult.lockfile).toBe(
      reactFixture.lockfile
        .replace('"@seed-design/css": "^2.4.0"', '"@seed-design/css": "^2.5.0"')
        .replace(
          '"@seed-design/lynx-css": "0.0.0 || >=0.1.0 <1.0.0"',
          '"@seed-design/lynx-css": "0.0.0 || >=0.8.0 <1.0.0"',
        ),
    );
  });
});

describe("bump peer dependencies workflow", () => {
  test("신뢰된 버전 PR에서만 최소 권한으로 동기화한다", async () => {
    const workflow = await Bun.file(
      join(repositoryRoot, ".github/workflows/bump-peer-deps.yml"),
    ).text();

    expect(workflow).toContain("issue_comment:");
    expect(workflow).toContain("github.event.comment.body == '/bump-peer-deps'");
    expect(workflow).toContain('["OWNER", "MEMBER", "COLLABORATOR"]');
    expect(workflow).toContain("contents: read");
    expect(workflow).toContain("issues: write");
    expect(workflow).toContain("pull-requests: write");
    expect(workflow).toContain(
      "actions/create-github-app-token@bcd2ba49218906704ab6c1aa796996da409d3eb1",
    );
    expect(workflow).toContain("vars.DAANGN_BUD_CLIENT_ID");
    expect(workflow).toContain("secrets.DAANGN_BUD_PRIVATE_KEY");
    expect(workflow).toContain("permission-contents: write");
    expect(workflow).toContain(`token: ${githubExpression("steps.app-token.outputs.token")}`);
    expect(workflow).toContain("changeset-release/dev");
    expect(workflow).toContain("release: version packages");
    expect(workflow).toContain("head.repo?.full_name");
    expect(workflow).toContain(`ref: ${githubExpression("github.sha")}`);
    expect(workflow).toContain(`ref: ${githubExpression("steps.pull.outputs.source-sha")}`);
    expect(workflow).toContain("persist-credentials: false");
    expect(workflow).toContain("Bind automation to trusted dev history");
    expect(workflow).toContain("git merge-base --is-ancestor");
    expect(workflow).toContain("bun ../control/.github/scripts/bump-peer-deps.ts");
    expect(workflow).toContain("steps.sync.outputs.react-changed");
    expect(workflow).toContain("steps.sync.outputs.lynx-react-changed");
    expect(workflow).toContain("packages/lynx-react/package.json");
    expect(workflow).toContain(`git push origin "HEAD:${["$", "{HEAD_REF}"].join("")}"`);
  });
});

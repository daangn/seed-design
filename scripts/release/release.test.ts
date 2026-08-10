import { afterEach, describe, expect, test } from "bun:test";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parseLaneConfig, parseReleaseControl } from "./config";
import { parseChangesetFile, validateChangesets } from "./changesets";
import { encodeMarker, parseMarker, validateGeneratedPr } from "./marker";
import { assertStableVersionsAdvance, authorizePublish, compareSemver } from "./publish";
import { idempotencyKey, isProcessed, sha256, sortSyncCandidates, syncTargets } from "./sync";
import { planTransition, validatePrereleaseTag } from "./transition";
import type { LaneConfig, PullRequestIdentity, ReleaseControl, ReleaseMarker } from "./types";

const temporaryDirectories: string[] = [];

function expectPropertyDescriptions(schema: Record<string, unknown>): void {
  const properties = schema.properties;
  if (typeof properties === "object" && properties !== null && !Array.isArray(properties)) {
    for (const [name, definition] of Object.entries(properties)) {
      expect(definition).toBeObject();
      const property = definition as Record<string, unknown>;
      expect(typeof property.description, `${name} 필드 description`).toBe("string");
      expectPropertyDescriptions(property);
    }
  }

  const definitions = schema.$defs;
  if (typeof definitions === "object" && definitions !== null && !Array.isArray(definitions)) {
    for (const definition of Object.values(definitions)) {
      expectPropertyDescriptions(definition as Record<string, unknown>);
    }
  }
}

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map((path) => rm(path, { recursive: true, force: true })),
  );
});

const config: LaneConfig = {
  $schema: "./lanes.schema.json",
  schemaVersion: 1,
  repository: "daangn/seed-design",
  maintainerTeam: "design-system",
  protectedDistTags: ["latest", "stable"],
  lanes: {
    dev: { bump: "patch", prerelease: false, sources: [] },
    minor: { bump: "minor", prerelease: true, sources: ["dev"] },
    major: { bump: "major", prerelease: true, sources: ["dev", "minor"] },
  },
  sync: { activation: null, reconcileCron: "*/10 * * * *", conflictAlertHours: 24 },
};

const control: ReleaseControl = {
  $schema: "./control.schema.json",
  schemaVersion: 1,
  mode: "dry-run",
  rootageContractReady: false,
  freeze: null,
};

describe("릴리즈 설정", () => {
  test("세 고정 레인을 읽는다", () => {
    expect(parseLaneConfig(config)).toEqual(config);
    expect(parseReleaseControl(control)).toEqual(control);
  });

  test("알 수 없는 bump를 거부한다", () => {
    const invalid = {
      ...config,
      lanes: {
        ...config.lanes,
        dev: { ...config.lanes.dev, bump: "banana" },
      },
    };
    expect(() => parseLaneConfig(invalid)).toThrow("bump");
  });

  test("실제 설정이 명시적인 로컬 JSON Schema를 참조한다", async () => {
    const cases = [
      [".github/release/lanes.json", ".github/release/lanes.schema.json"],
      [".github/release/control.json", ".github/release/control.schema.json"],
    ] as const;

    for (const [configPath, schemaPath] of cases) {
      const actual = JSON.parse(await readFile(configPath, "utf8")) as Record<string, unknown>;
      const schema = JSON.parse(await readFile(schemaPath, "utf8")) as Record<string, unknown>;
      expect(actual.$schema).toBe(`./${schemaPath.split("/").at(-1)}`);
      expect(schema.$schema).toBe("https://json-schema.org/draft/2020-12/schema");
      expect(schema.additionalProperties).toBe(false);
      expect(schema.required).toContain("$schema");
      expectPropertyDescriptions(schema);
    }

    expect(parseLaneConfig(JSON.parse(await readFile(cases[0][0], "utf8")))).toBeTruthy();
    expect(parseReleaseControl(JSON.parse(await readFile(cases[1][0], "utf8")))).toBeTruthy();
  });

  test("알 수 없는 키와 잘못된 freeze 조합을 거부한다", () => {
    expect(() => parseLaneConfig({ ...config, typo: true })).toThrow("알 수 없음");
    expect(() =>
      parseReleaseControl({
        ...control,
        freeze: {
          promotionLane: "major",
          candidateSha: "a".repeat(40),
          phase: "frozen",
          frozenLanes: ["major"],
          startedAt: "2026-08-05T00:00:00.000Z",
        },
      }),
    ).toThrow("스키마");
  });
});

describe("Changeset 검증", () => {
  test("frontmatter의 package와 bump를 읽는다", async () => {
    const directory = await mkdtemp(join(tmpdir(), "changeset-test-"));
    temporaryDirectories.push(directory);
    const file = join(directory, "valid.md");
    await writeFile(file, '---\n"@seed-design/rootage-artifacts": minor\n---\n\n설명\n');
    expect(await parseChangesetFile(file)).toEqual({
      file,
      releases: [{ name: "@seed-design/rootage-artifacts", type: "minor" }],
    });
  });

  test("레인과 다른 직접 bump를 모두 보고한다", async () => {
    const directory = await mkdtemp(join(tmpdir(), "changeset-test-"));
    temporaryDirectories.push(directory);
    const changesetDirectory = join(directory, ".changeset");
    await mkdir(changesetDirectory);
    const file = join(changesetDirectory, "invalid.md");
    await writeFile(file, '---\n"@seed-design/css": patch\n"@seed-design/react": major\n---\n');
    const result = await validateChangesets([file], "minor", "minor");
    expect(result.errors).toHaveLength(2);
  });

  test("changeset이 없으면 실패 대신 경고한다", async () => {
    const result = await validateChangesets(["packages/react/src/index.ts"], "dev", "patch");
    expect(result.errors).toEqual([]);
    expect(result.warnings).toHaveLength(1);
  });
});

describe("릴리즈 PR CLI", () => {
  test("비릴리즈 레인 PR은 성공으로 건너뛴다", async () => {
    const directory = await mkdtemp(join(tmpdir(), "release-cli-test-"));
    temporaryDirectories.push(directory);
    const eventPath = join(directory, "event.json");
    await writeFile(
      eventPath,
      JSON.stringify({ pull_request: { base: { ref: "feature/des-2200" } } }),
    );

    const process = Bun.spawn(
      ["bun", "scripts/release/cli.ts", "validate-pr", "--event", eventPath],
      { stdout: "pipe", stderr: "pipe" },
    );
    const [exitCode, stdout, stderr] = await Promise.all([
      process.exited,
      new Response(process.stdout).text(),
      new Response(process.stderr).text(),
    ]);

    expect(exitCode, stderr).toBe(0);
    expect(stdout).toContain("릴리즈 레인이 아니므로 검증을 건너뜁니다");
  });
});

describe("자동화 PR marker", () => {
  const marker: ReleaseMarker = {
    schemaVersion: 1,
    type: "sync",
    lane: "major",
    targetLane: "major",
    sourceRepository: "daangn/seed-design",
    sourcePr: 42,
    patchSha256: "abc",
  };
  const identity: PullRequestIdentity = {
    author: "github-actions[bot]",
    body: encodeMarker(marker),
    baseRef: "major",
    headRef: "release-sync/dev-42-to-major",
    baseRepository: "daangn/seed-design",
    headRepository: "daangn/seed-design",
  };

  test("marker를 왕복하고 신뢰 조건을 검사한다", () => {
    expect(parseMarker(encodeMarker(marker))).toEqual(marker);
    expect(validateGeneratedPr(identity)).toEqual(marker);
  });

  test("fork와 사람 작성 PR은 예외 처리하지 않는다", () => {
    expect(validateGeneratedPr({ ...identity, headRepository: "fork/seed-design" })).toBeNull();
    expect(validateGeneratedPr({ ...identity, author: "person" })).toBeNull();
  });

  test("marker 추가 전 Version Packages PR을 신뢰한다", () => {
    expect(
      validateGeneratedPr({
        author: "github-actions[bot]",
        body: "This PR was opened by the Changesets release GitHub action.",
        baseRef: "dev",
        headRef: "changeset-release/dev",
        baseRepository: "daangn/seed-design",
        headRepository: "daangn/seed-design",
      }),
    ).toEqual({ schemaVersion: 1, type: "version", lane: "dev" });
  });

  test("marker 없는 Version Packages PR의 신뢰 조건을 엄격히 검사한다", () => {
    const versionIdentity: PullRequestIdentity = {
      author: "github-actions[bot]",
      body: "This PR was opened by the Changesets release GitHub action.",
      baseRef: "dev",
      headRef: "changeset-release/dev",
      baseRepository: "daangn/seed-design",
      headRepository: "daangn/seed-design",
    };

    expect(validateGeneratedPr({ ...versionIdentity, author: "person" })).toBeNull();
    expect(
      validateGeneratedPr({ ...versionIdentity, headRepository: "fork/seed-design" }),
    ).toBeNull();
    expect(
      validateGeneratedPr({ ...versionIdentity, headRef: "changeset-release/dev-spoof" }),
    ).toBeNull();
    expect(validateGeneratedPr({ ...versionIdentity, baseRef: "feature" })).toBeNull();
    expect(
      validateGeneratedPr({ ...versionIdentity, body: "<!-- seed-release:{invalid} -->" }),
    ).toBeNull();
  });
});

describe("pre-release 상태 전환", () => {
  const preState = {
    mode: "pre" as const,
    tag: "alpha",
    initialVersions: {},
    changesets: [],
  };

  test("기본 beta 진입과 retag를 계획한다", () => {
    expect(planTransition("minor", "enter", undefined, null, config.protectedDistTags).tag).toBe(
      "beta",
    );
    expect(planTransition("major", "retag", "rc", preState, config.protectedDistTags).tag).toBe(
      "rc",
    );
  });

  test("중복 상태와 stable tag를 거부한다", () => {
    expect(() => planTransition("major", "enter", "beta", preState, [])).toThrow("이미");
    expect(() => validatePrereleaseTag("latest", config.protectedDistTags)).toThrow("보호");
    expect(() => planTransition("minor", "retag", "alpha", preState, [])).toThrow("이미");
  });

  test("dev와 잘못된 exit를 거부한다", () => {
    expect(() => planTransition("dev", "enter", "beta", null, [])).toThrow("dev");
    expect(() => planTransition("minor", "exit", undefined, null, [])).toThrow("아닙니다");
  });
});

describe("동기화 queue", () => {
  test("major의 두 유입 경로를 merge 시각과 PR 번호로 정렬한다", () => {
    const sorted = sortSyncCandidates([
      {
        number: 12,
        mergedAt: "2026-08-05T02:00:00Z",
        baseRef: "minor",
        mergeCommitSha: "b",
        author: "b",
      },
      {
        number: 11,
        mergedAt: "2026-08-05T02:00:00Z",
        baseRef: "dev",
        mergeCommitSha: "a",
        author: "a",
      },
      {
        number: 10,
        mergedAt: "2026-08-05T01:00:00Z",
        baseRef: "dev",
        mergeCommitSha: "c",
        author: "c",
      },
    ]);
    expect(sorted.map((candidate) => candidate.number)).toEqual([10, 11, 12]);
    expect(syncTargets(config, "dev")).toEqual(["minor", "major"]);
    expect(syncTargets(config, "minor")).toEqual(["major"]);
  });

  test("idempotency key와 marker를 일관되게 판정한다", () => {
    const marker: ReleaseMarker = {
      schemaVersion: 1,
      type: "sync",
      lane: "major",
      targetLane: "major",
      sourceRepository: "daangn/seed-design",
      sourcePr: 7,
    };
    expect(idempotencyKey("daangn/seed-design", 7, "major")).toBe("daangn/seed-design#7->major");
    expect(isProcessed(marker, "daangn/seed-design", 7, "major")).toBe(true);
    expect(sha256("same")).toBe(sha256("same"));
  });
});

describe("게시 승인과 버전 단조 증가", () => {
  const marker: ReleaseMarker = { schemaVersion: 1, type: "version", lane: "dev" };

  test("SemVer stable과 prerelease를 비교한다", () => {
    expect(compareSemver("2.0.0", "2.0.0-beta.3")).toBeGreaterThan(0);
    expect(compareSemver("2.0.1", "2.0.0")).toBeGreaterThan(0);
    expect(compareSemver("2.0.0-beta.2", "2.0.0-beta.10")).toBeLessThan(0);
  });

  test("latest 이하 stable version을 거부한다", () => {
    expect(() =>
      assertStableVersionsAdvance(
        { "@seed-design/rootage-artifacts": "2.3.0" },
        { "@seed-design/rootage-artifacts": "2.3.0" },
      ),
    ).toThrow("높지 않습니다");
    expect(() =>
      assertStableVersionsAdvance(
        { "@seed-design/rootage-artifacts": "2.3.1" },
        { "@seed-design/rootage-artifacts": "2.3.0" },
      ),
    ).not.toThrow();
  });

  test("사람이 merge한 Version PR만 dry-run 게시를 승인한다", () => {
    expect(authorizePublish(marker, "maintainer", "dev", "changeset-release/dev", control)).toBe(
      "dry-run",
    );
    expect(() =>
      authorizePublish(marker, "github-actions[bot]", "dev", "changeset-release/dev", control),
    ).toThrow("사람");
  });

  test("승격 freeze 중 dev publish를 막고 통합 단계에서 재개한다", () => {
    const frozen: ReleaseControl = {
      ...control,
      freeze: {
        promotionLane: "major",
        candidateSha: "a".repeat(40),
        phase: "frozen",
        frozenLanes: ["minor", "major"],
        startedAt: "2026-08-05T00:00:00Z",
      },
    };
    expect(() =>
      authorizePublish(marker, "maintainer", "dev", "changeset-release/dev", frozen),
    ).toThrow("중단");
    expect(
      authorizePublish(marker, "maintainer", "dev", "changeset-release/dev", {
        ...frozen,
        freeze: frozen.freeze ? { ...frozen.freeze, phase: "integrating" } : null,
      }),
    ).toBe("dry-run");
  });

  test("DES-2201 계약 없이 production을 거부한다", () => {
    expect(() =>
      authorizePublish(marker, "maintainer", "dev", "changeset-release/dev", {
        ...control,
        mode: "production",
      }),
    ).toThrow("DES-2201");
  });
});

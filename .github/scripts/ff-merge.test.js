const { describe, expect, mock, test } = require("bun:test");

const {
  escapeMarkdown,
  hasWritePermission,
  inspectRequest,
  performFastForward,
  renderSummary,
  validateComparison,
  validatePullRequest,
} = require("./ff-merge");

const BASE_SHA = "1".repeat(40);
const HEAD_SHA = "2".repeat(40);

function createPull(overrides = {}) {
  return {
    state: "open",
    draft: false,
    html_url: "https://github.com/daangn/seed-design/pull/2000",
    base: {
      ref: "dev",
      sha: BASE_SHA,
      repo: { full_name: "daangn/seed-design" },
    },
    head: {
      ref: "minor",
      sha: HEAD_SHA,
      repo: { full_name: "daangn/seed-design" },
    },
    ...overrides,
  };
}

function createContext() {
  return {
    actor: "seed-maintainer",
    repo: { owner: "daangn", repo: "seed-design" },
    issue: { number: 2000 },
    payload: {
      comment: {
        id: 123,
        body: "/ff-merge",
        author_association: "MEMBER",
        user: { login: "seed-maintainer" },
      },
    },
  };
}

function createReadGithub(pull = createPull()) {
  return {
    rest: {
      repos: {
        getCollaboratorPermissionLevel: mock(async () => ({
          data: { user: { permissions: { push: true } } },
        })),
        compareCommitsWithBasehead: mock(async () => ({
          data: { status: "ahead", ahead_by: 2 },
        })),
      },
      pulls: {
        get: mock(async () => ({ data: pull })),
      },
    },
  };
}

describe("validatePullRequest", () => {
  test("minor → dev PR을 허용한다", () => {
    expect(validatePullRequest(createPull(), "daangn/seed-design")).toEqual({
      baseSha: BASE_SHA,
      headSha: HEAD_SHA,
      pullUrl: "https://github.com/daangn/seed-design/pull/2000",
      sourceBranch: "minor",
    });
  });

  test.each([
    ["닫힌 PR", { state: "closed" }],
    ["초안 PR", { draft: true }],
    ["잘못된 source", { head: { ...createPull().head, ref: "feature/test" } }],
    ["잘못된 target", { base: { ...createPull().base, ref: "main" } }],
    ["fork PR", { head: { ...createPull().head, repo: { full_name: "someone/seed-design" } } }],
  ])("%s을 거부한다", (_, overrides) => {
    expect(() => validatePullRequest(createPull(overrides), "daangn/seed-design")).toThrow();
  });
});

describe("권한과 비교 상태", () => {
  test("push 권한만 쓰기 권한으로 인정한다", () => {
    expect(hasWritePermission({ user: { permissions: { push: true } } })).toBe(true);
    expect(hasWritePermission({ user: { permissions: { push: false } } })).toBe(false);
    expect(hasWritePermission({ permission: "write" })).toBe(false);
  });

  test("ahead 상태만 허용한다", () => {
    expect(() => validateComparison({ status: "ahead", ahead_by: 1 })).not.toThrow();
    for (const status of ["identical", "behind", "diverged", "unknown"]) {
      expect(() => validateComparison({ status, ahead_by: 0 })).toThrow();
    }
  });

  test("정확한 명령과 실제 push 권한을 모두 요구한다", async () => {
    const wrongCommand = createContext();
    wrongCommand.payload.comment.body = "/ff-merge please";
    await expect(
      inspectRequest({ github: createReadGithub(), context: wrongCommand }),
    ).rejects.toThrow("댓글 내용이 정확히 `/ff-merge`여야 합니다");

    const github = createReadGithub();
    github.rest.repos.getCollaboratorPermissionLevel = mock(async () => ({
      data: { user: { permissions: { push: false } } },
    }));
    await expect(inspectRequest({ github, context: createContext() })).rejects.toThrow(
      "저장소 쓰기 권한이 있는 사용자만 실행할 수 있습니다",
    );
    expect(github.rest.pulls.get).not.toHaveBeenCalled();
  });
});

describe("performFastForward", () => {
  test("dev ref를 force 없이 PR head로 갱신하고 결과를 검증한다", async () => {
    const readGithub = createReadGithub();
    const updateRef = mock(async () => ({ data: {} }));
    const getRef = mock(async () => ({ data: { object: { sha: HEAD_SHA } } }));
    const writeGithub = { rest: { git: { updateRef, getRef } } };

    await expect(
      performFastForward({
        readGithub,
        writeGithub,
        context: createContext(),
        expectedBaseSha: BASE_SHA,
        expectedHeadSha: HEAD_SHA,
      }),
    ).resolves.toMatchObject({ baseSha: BASE_SHA, headSha: HEAD_SHA });

    expect(updateRef).toHaveBeenCalledWith({
      owner: "daangn",
      repo: "seed-design",
      ref: "heads/dev",
      sha: HEAD_SHA,
      force: false,
    });
    expect(getRef).toHaveBeenCalledWith({
      owner: "daangn",
      repo: "seed-design",
      ref: "heads/dev",
    });
  });

  test("사전 검증 이후 base 또는 head가 바뀌면 갱신하지 않는다", async () => {
    const updateRef = mock(async () => ({ data: {} }));
    const writeGithub = {
      rest: { git: { updateRef, getRef: mock(async () => ({ data: {} })) } },
    };

    await expect(
      performFastForward({
        readGithub: createReadGithub(),
        writeGithub,
        context: createContext(),
        expectedBaseSha: "3".repeat(40),
        expectedHeadSha: HEAD_SHA,
      }),
    ).rejects.toThrow("사전 검증 이후 `dev`가 변경되었습니다");
    expect(updateRef).not.toHaveBeenCalled();

    await expect(
      performFastForward({
        readGithub: createReadGithub(),
        writeGithub,
        context: createContext(),
        expectedBaseSha: BASE_SHA,
        expectedHeadSha: "4".repeat(40),
      }),
    ).rejects.toThrow("사전 검증 이후 source 브랜치가 변경되었습니다");
    expect(updateRef).not.toHaveBeenCalled();
  });
});

describe("Summary", () => {
  test("실행 정보와 실패 안내를 한국어 Markdown으로 만든다", () => {
    const summary = renderSummary({
      repository: "daangn/seed-design",
      runUrl: "https://github.com/daangn/seed-design/actions/runs/1",
      actor: "maintainer|name",
      pullNumber: 2000,
      pullUrl: "https://github.com/daangn/seed-design/pull/2000",
      sourceBranch: "minor",
      baseSha: BASE_SHA,
      headSha: HEAD_SHA,
      status: "실패",
      detail: "dev|source가 갈라졌습니다.\n다시 시도하세요.",
      failure: true,
    });

    expect(summary).toContain("# `/ff-merge` 실행 결과");
    expect(summary).toContain("@maintainer\\|name");
    expect(summary).toContain("`minor` → `dev`");
    expect(summary).toContain("dev\\|source가 갈라졌습니다. 다시 시도하세요.");
    expect(summary).toContain("<summary>실패 확인 방법</summary>");
  });

  test("Markdown 표 구분 문자를 이스케이프한다", () => {
    expect(escapeMarkdown("a|b\nc")).toBe("a\\|b c");
  });
});

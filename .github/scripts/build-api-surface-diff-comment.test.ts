import { describe, expect, test } from "bun:test";
import { buildComment, parsePackageDiffs } from "./build-api-surface-diff-comment";

const meta = { baseLabel: "origin/dev (012345678)" };

describe("git diff 파싱", () => {
  test("패키지별 hunk와 추가·삭제 줄 수를 이름순으로 돌려준다", () => {
    const output = `diff --git a/head/@seed-design/new.txt b/head/@seed-design/new.txt
new file mode 100644
index 0000000..587be6b
--- /dev/null
+++ b/head/@seed-design/new.txt
@@ -0,0 +1,2 @@
+# @seed-design/new
+type A
diff --git a/base/@seed-design/react.txt b/head/@seed-design/react.txt
index 422c2b7..0f7bc76 100644
--- a/base/@seed-design/react.txt
+++ b/head/@seed-design/react.txt
@@ -1,2 +1,2 @@ # @seed-design/react
 ## .
--type A = 1
-+type A = 2
+-type A = 3
diff --git a/base/@seed-design/gone.txt b/base/@seed-design/gone.txt
deleted file mode 100644
index 975fbec..0000000
--- a/base/@seed-design/gone.txt
+++ /dev/null
@@ -1 +0,0 @@
-# @seed-design/gone
\\ No newline at end of file
`;

    expect(parsePackageDiffs(output, { base: "base", head: "head" })).toEqual([
      {
        name: "@seed-design/gone",
        patch: "@@ -1 +0,0 @@\n-# @seed-design/gone\n\\ No newline at end of file",
        added: 0,
        removed: 1,
      },
      {
        name: "@seed-design/new",
        patch: "@@ -0,0 +1,2 @@\n+# @seed-design/new\n+type A",
        added: 2,
        removed: 0,
      },
      {
        name: "@seed-design/react",
        patch:
          "@@ -1,2 +1,2 @@ # @seed-design/react\n ## .\n--type A = 1\n-+type A = 2\n+-type A = 3",
        added: 1,
        removed: 2,
      },
    ]);
  });

  test("변화가 없으면 빈 목록을 돌려준다", () => {
    expect(parsePackageDiffs("", { base: "base", head: "head" })).toEqual([]);
  });

  test("표면 파일이 아닌 diff는 거부한다", () => {
    const output = `diff --git a/base/x.bin b/head/x.bin
index 422c2b7..0f7bc76 100644
Binary files a/base/x.bin and b/head/x.bin differ
`;

    expect(() => parsePackageDiffs(output, { base: "base", head: "head" })).toThrow();
  });
});

describe("PR 코멘트", () => {
  test("변화가 없으면 코멘트를 만들지 않는다", () => {
    expect(buildComment([], meta)).toBeUndefined();
  });

  test("패키지별 요약 표와 접힌 diff를 만든다", () => {
    const patch = "@@ -1 +1 @@\n-type A = 1\n+type A = 2";

    expect(
      buildComment([{ name: "@seed-design/react", patch, added: 1, removed: 1 }], meta),
    ).toBe(`## API surface changes

\`origin/dev (012345678)\` 대비 공개 API 표면이 바뀐 패키지예요.

| Package | + | - |
| --- | --: | --: |
| \`@seed-design/react\` | 1 | 1 |

<details><summary><code>@seed-design/react</code></summary>

\`\`\`diff
@@ -1 +1 @@
-type A = 1
+type A = 2
\`\`\`

</details>
`);
  });

  test("길이 제한을 넘는 패키지의 diff는 생략하고 이름을 남긴다", () => {
    const body = buildComment(
      [
        { name: "@seed-design/a", patch: "+".repeat(40_000), added: 1, removed: 0 },
        { name: "@seed-design/b", patch: "+".repeat(40_000), added: 1, removed: 0 },
      ],
      meta,
    );

    expect(body?.includes("<summary><code>@seed-design/a</code></summary>")).toBe(true);
    expect(body?.includes("<summary><code>@seed-design/b</code></summary>")).toBe(false);
    expect(body?.endsWith("확인해 주세요: `@seed-design/b`")).toBe(true);
  });
});

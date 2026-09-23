import { describe, expect, test } from "bun:test";
import { buildComment } from "./comment";

const meta = { baseLabel: "origin/dev (012345678)" };

describe("PR 코멘트", () => {
  test("변화가 없으면 코멘트를 만들지 않는다", () => {
    expect(buildComment([], meta)).toBeUndefined();
  });

  test("패키지별 요약 표와 접힌 diff를 만든다", () => {
    const patch = "@@ -1 +1 @@\n-type A = 1\n+type A = 2";

    expect(
      buildComment([{ name: "@seed-design/react", patch, added: 1, removed: 1 }], meta),
    ).toBe(`## API surface changes

\`origin/dev (012345678)\` 대비 공개 API 표면이 바뀐 패키지예요. 로컬에서 비교하는 방법은 \`tools/extract-api-surface/README.md\`에 있어요.

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

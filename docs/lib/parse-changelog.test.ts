import { describe, expect, it } from "bun:test";
import { parseChangelog } from "./parse-changelog";

const FRONTMATTER = `---
title: Changelog
description: 최신 업데이트와 변경사항을 기록합니다.
---

`;

describe("parseChangelog", () => {
  it("frontmatter를 제거한다", async () => {
    const raw = `${FRONTMATTER}## 2026.01.01

내용

영향받는 패키지
- 📦 [@seed-design/react@1.0.0](https://npmjs.com/package/@seed-design/react/v/1.0.0)
`;
    const entries = await parseChangelog(raw);
    expect(entries).toHaveLength(1);
    expect(entries[0].contentHtml).not.toContain("title: Changelog");
  });

  it("날짜를 파싱한다", async () => {
    const raw = `## 2026.01.15

내용

영향받는 패키지
- 📦 [@seed-design/react@1.0.0](https://npmjs.com/package/@seed-design/react/v/1.0.0)
`;
    const entries = await parseChangelog(raw);
    expect(entries[0].date).toBe("2026.01.15");
  });

  it("label(#숫자)을 파싱한다", async () => {
    const raw = `## 2026.01.15 #123

내용

영향받는 패키지
- 📦 [@seed-design/react@1.0.0](https://npmjs.com/package/@seed-design/react/v/1.0.0)
`;
    const entries = await parseChangelog(raw);
    expect(entries[0].label).toBe("#123");
  });

  it("label이 없으면 undefined다", async () => {
    const raw = `## 2026.01.15

내용

영향받는 패키지
- 📦 [@seed-design/react@1.0.0](https://npmjs.com/package/@seed-design/react/v/1.0.0)
`;
    const entries = await parseChangelog(raw);
    expect(entries[0].label).toBeUndefined();
  });

  it("패키지 이름, 버전, url을 파싱한다", async () => {
    const raw = `## 2026.01.15

내용

영향받는 패키지
- 📦 [@seed-design/react@1.2.3](https://npmjs.com/package/@seed-design/react/v/1.2.3)
- 📦 [@seed-design/css@1.2.3](https://npmjs.com/package/@seed-design/css/v/1.2.3)
`;
    const entries = await parseChangelog(raw);
    expect(entries[0].packages).toEqual([
      {
        name: "@seed-design/react",
        version: "1.2.3",
        url: "https://npmjs.com/package/@seed-design/react/v/1.2.3",
      },
      {
        name: "@seed-design/css",
        version: "1.2.3",
        url: "https://npmjs.com/package/@seed-design/css/v/1.2.3",
      },
    ]);
  });

  it("--- 로 구분된 여러 항목을 분리한다", async () => {
    const raw = `## 2026.01.15

첫 번째 항목

영향받는 패키지
- 📦 [@seed-design/react@1.0.0](https://npmjs.com/package/@seed-design/react/v/1.0.0)

---

두 번째 항목

영향받는 패키지
- 📦 [@seed-design/css@1.0.0](https://npmjs.com/package/@seed-design/css/v/1.0.0)
`;
    const entries = await parseChangelog(raw);
    expect(entries).toHaveLength(2);
    expect(entries[0].packages[0].name).toBe("@seed-design/react");
    expect(entries[1].packages[0].name).toBe("@seed-design/css");
  });

  it("여러 날짜 섹션을 파싱한다", async () => {
    const raw = `## 2026.01.15

내용 A

영향받는 패키지
- 📦 [@seed-design/react@1.0.0](https://npmjs.com/package/@seed-design/react/v/1.0.0)

## 2026.01.10

내용 B

영향받는 패키지
- 📦 [@seed-design/css@1.0.0](https://npmjs.com/package/@seed-design/css/v/1.0.0)
`;
    const entries = await parseChangelog(raw);
    expect(entries).toHaveLength(2);
    expect(entries[0].date).toBe("2026.01.15");
    expect(entries[1].date).toBe("2026.01.10");
  });

  it("contentHtml에 영향받는 패키지 섹션이 포함되지 않는다", async () => {
    const raw = `## 2026.01.15

본문 내용입니다.

영향받는 패키지
- 📦 [@seed-design/react@1.0.0](https://npmjs.com/package/@seed-design/react/v/1.0.0)
`;
    const entries = await parseChangelog(raw);
    expect(entries[0].contentHtml).not.toContain("영향받는 패키지");
    expect(entries[0].contentHtml).toContain("본문 내용입니다.");
  });

  it("본문을 HTML로 변환한다", async () => {
    const raw = `## 2026.01.15

**굵은** 텍스트와 \`인라인 코드\`

- 목록 항목

영향받는 패키지
- 📦 [@seed-design/react@1.0.0](https://npmjs.com/package/@seed-design/react/v/1.0.0)
`;
    const entries = await parseChangelog(raw);
    expect(entries[0].contentHtml).toContain("<strong>");
    expect(entries[0].contentHtml).toContain("<code>");
    expect(entries[0].contentHtml).toContain("<li>");
  });

  it("빈 섹션은 무시한다", async () => {
    const raw = `## 2026.01.15

영향받는 패키지
- 📦 [@seed-design/react@1.0.0](https://npmjs.com/package/@seed-design/react/v/1.0.0)

---

`;
    const entries = await parseChangelog(raw);
    expect(entries).toHaveLength(1);
  });
});

/**
 * 패키지 CHANGELOG를 render 중 fs로 읽지 않고 module로 import해 파싱한다. module graph에 들어가야 incremental build가
 * CHANGELOG 변경을 감지한다. 파싱과 fenced code 하이라이트(`highlight.ts`, MDX 코드 블록과 같은 테마)는 비동기라 모듈
 * 최상위에서 한 번 끝낸다. 그래서 이 데이터를 쓰는 `.astro`는 frontmatter에서 await하지 않는다(렌더 결정성, DESIGN 핵심
 * 결정 9 ③). 하이라이트 결과는 island props로 브라우저에 가므로 브라우저는 Shiki를 받지 않는다.
 */
import { type ChangelogPlatform, getChangelogPlatform } from "../../lib/changelog-platform";
import {
  type ChangelogEntry,
  type ChangelogSource,
  parseChangelogSources,
} from "../../lib/parse-changelog";
import { highlightCode } from "./highlight";

const changelogs = import.meta.glob<string>("../../../packages/**/CHANGELOG.md", {
  query: "?raw",
  import: "default",
  eager: true,
});
const packageJsons = import.meta.glob<{ name?: string }>("../../../packages/**/package.json", {
  import: "default",
  eager: true,
});

function sources(platform: ChangelogPlatform): ChangelogSource[] {
  return Object.keys(changelogs)
    .sort()
    .flatMap((path) => {
      const name = packageJsons[path.replace(/CHANGELOG\.md$/, "package.json")]?.name;
      if (!name?.startsWith("@seed-design/") || getChangelogPlatform(name) !== platform) return [];
      return [{ packageName: name, raw: changelogs[path] ?? "" }];
    });
}

async function withHighlightedCode(entries: ChangelogEntry[]): Promise<ChangelogEntry[]> {
  // 순서대로 처리해 결과가 실행마다 같다(하이라이트는 언어 문법을 lazy load한다).
  for (const entry of entries) {
    for (const block of entry.contentBlocks) {
      if (block.type === "code") block.html = await highlightCode(block.code, block.lang || "text");
    }
  }
  return entries;
}

export const changelogEntries: Record<ChangelogPlatform, ChangelogEntry[]> = {
  react: await withHighlightedCode(await parseChangelogSources(sources("react"))),
  lynx: await withHighlightedCode(await parseChangelogSources(sources("lynx"))),
};

/**
 * 패키지 CHANGELOG를 render 중 fs로 읽지 않고 module로 import해 파싱한다. module graph에 들어가야 incremental build가
 * CHANGELOG 변경을 감지한다. 파싱(코드 하이라이트 포함)은 비동기라 모듈 최상위에서 한 번 끝낸다. 그래서 이 데이터를 쓰는
 * `.astro`는 frontmatter에서 await하지 않는다(렌더 결정성, DESIGN 핵심 결정 9 ③).
 */
import { type ChangelogPlatform, getChangelogPlatform } from "../../lib/changelog-platform";
import {
  type ChangelogEntry,
  type ChangelogSource,
  parseChangelogSources,
} from "../../lib/parse-changelog";

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

export const changelogEntries: Record<ChangelogPlatform, ChangelogEntry[]> = {
  react: await parseChangelogSources(sources("react")),
  lynx: await parseChangelogSources(sources("lynx")),
};

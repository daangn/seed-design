import { type ChangelogSource, loadChangelogSources } from "@/lib/parse-changelog";
import type { LLMPlaceholder } from "../types";

/**
 * `<ChangelogPage />` carries no content of its own — the page is every package's
 * `CHANGELOG.md` concatenated, with each file's own title dropped so the `## {package}`
 * heading is the only label at that level.
 *
 * 소스를 읽어 오는 일은 인자로 받는다. 테스트는 합성 changelog로 placeholder를 만들어
 * 저장소의 실제 패키지 목록에 묶이지 않게 한다.
 */
export function createChangelogPagePlaceholder(
  load: () => Promise<ChangelogSource[]>,
): LLMPlaceholder {
  // Read once per process. `renderPlaceholder` runs per page, and every page that embeds
  // the tag wants the same 60-odd changelogs.
  let changelog: Promise<string | null> | null = null;

  async function build(): Promise<string | null> {
    try {
      const sources = await load();

      return sources
        .sort((a, b) => a.packageName.localeCompare(b.packageName))
        .map(
          ({ packageName, raw }) =>
            `## ${packageName}\n\n${raw.replace(/^# .+\n/, "").trimStart()}`,
        )
        .join("\n\n---\n\n");
    } catch {
      return null;
    }
  }

  return {
    names: ["ChangelogPage"],
    render: async () => {
      changelog ??= build();
      return await changelog;
    },
  };
}

export const changelogPagePlaceholder = createChangelogPagePlaceholder(() =>
  loadChangelogSources(process.cwd()),
);

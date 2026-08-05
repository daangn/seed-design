import { loadChangelogSources } from "@/lib/parse-changelog";
import type { LLMPlaceholder } from "../types";

/**
 * Read once per process. `renderPlaceholder` runs per page, and every page that embeds
 * the tag wants the same 60-odd changelogs.
 */
let changelog: Promise<string | null> | null = null;

async function loadChangelog(): Promise<string | null> {
  try {
    const sources = await loadChangelogSources(process.cwd());

    return sources
      .sort((a, b) => a.packageName.localeCompare(b.packageName))
      .map(
        ({ packageName, raw }) => `## ${packageName}\n\n${raw.replace(/^# .+\n/, "").trimStart()}`,
      )
      .join("\n\n---\n\n");
  } catch {
    return null;
  }
}

/**
 * `<ChangelogPage />` carries no content of its own — the page is every package's
 * `CHANGELOG.md` concatenated, with each file's own title dropped so the `## {package}`
 * heading is the only label at that level.
 */
export const changelogPagePlaceholder: LLMPlaceholder = {
  names: ["ChangelogPage"],
  render: async () => {
    changelog ??= loadChangelog();
    return await changelog;
  },
};

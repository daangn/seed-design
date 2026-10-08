import type { MdxJsxFlowElement } from "mdast-util-mdx-jsx";
import { loadChangelogSources, type ChangelogSource } from "@/lib/parse-changelog";
import {
  CHANGELOG_PLATFORMS,
  getChangelogPlatform,
  type ChangelogPlatform,
} from "@/lib/changelog-platform";
import type { Rule } from "./types";

export function createChangelogPageRule(
  loadSources: () => Promise<ChangelogSource[]> = () => loadChangelogSources(process.cwd()),
): Rule<MdxJsxFlowElement> {
  const cache: Partial<Record<ChangelogPlatform, string>> = {};
  let initPromise: Promise<void> | undefined;

  return {
    name: "ChangelogPage",
    init: () => {
      initPromise ??= loadSources()
        .then((sources) => {
          const sorted = [...sources].sort((a, b) => a.packageName.localeCompare(b.packageName));
          for (const platform of CHANGELOG_PLATFORMS) {
            cache[platform] = sorted
              .filter(({ packageName }) => getChangelogPlatform(packageName) === platform)
              .map(({ packageName, raw }) => {
                const normalized = raw.replace(/^# .+\n/, "").trimStart();
                return `## ${packageName}\n\n${normalized}`;
              })
              .join("\n\n---\n\n");
          }
        })
        .catch(() => {});
      return initPromise;
    },
    match: (node): node is MdxJsxFlowElement =>
      node.type === "mdxJsxFlowElement" && node.name === "ChangelogPage",
    transform: (node, context) => {
      const platform = context.getStringAttribute(node, "platform");
      if (platform !== "react" && platform !== "lynx") return [node];
      const changelog = cache[platform];
      if (changelog === undefined) return [node];
      if (changelog === "") return [];
      return [{ type: "html", value: changelog }];
    },
  };
}

export const changelogPageRule = createChangelogPageRule();

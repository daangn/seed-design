import type { MdxJsxFlowElement } from "mdast-util-mdx-jsx";
import { loadChangelogSources } from "@/lib/parse-changelog";
import type { Rule } from "./types";

type ChangelogSource = { packageName: string; raw: string };

let changelogCache: string | null = null;
let initPromise: Promise<void> | null = null;

async function fetchAndCacheChangelog(): Promise<void> {
  try {
    const sources = await loadChangelogSources(process.cwd());
    const sorted = sources.sort((a: ChangelogSource, b: ChangelogSource) =>
      a.packageName.localeCompare(b.packageName),
    );

    changelogCache = sorted
      .map(({ packageName, raw }: ChangelogSource) => {
        const normalized = raw.replace(/^# .+\n/, "").trimStart();
        return `## ${packageName}\n\n${normalized}`;
      })
      .join("\n\n---\n\n");
  } catch {
    changelogCache = "";
  }
}

async function init(): Promise<void> {
  if (!initPromise) {
    initPromise = fetchAndCacheChangelog();
  }
  await initPromise;
}

export const changelogPageRule: Rule = {
  name: "ChangelogPage",
  init,
  match: (node): node is MdxJsxFlowElement =>
    node.type === "mdxJsxFlowElement" && node.name === "ChangelogPage",
  transform: () => {
    if (!changelogCache) return [];
    return [{ type: "html", value: changelogCache }];
  },
};

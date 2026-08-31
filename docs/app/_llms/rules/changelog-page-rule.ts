import type { MdxJsxFlowElement } from "mdast-util-mdx-jsx";
import { getChangelogLlmData, renderAllPackagesChangelog } from "@/lib/changelog-llms";
import type { Rule } from "./types";

let changelogCache: string | null = null;
let initPromise: Promise<void> | null = null;
let initFailed = false;

async function buildAndCacheChangelog(): Promise<void> {
  try {
    initFailed = false;
    changelogCache = renderAllPackagesChangelog(await getChangelogLlmData());
  } catch {
    initFailed = true;
    changelogCache = null;
  }
}

async function init(): Promise<void> {
  if (!initPromise) {
    initPromise = buildAndCacheChangelog();
  }
  await initPromise;
}

export const changelogPageRule: Rule<MdxJsxFlowElement> = {
  name: "ChangelogPage",
  init,
  match: (node): node is MdxJsxFlowElement =>
    node.type === "mdxJsxFlowElement" && node.name === "ChangelogPage",
  transform: (node) => {
    if (initFailed || changelogCache === null) return [node];
    if (changelogCache === "") return [];
    return [{ type: "html", value: changelogCache }];
  },
};

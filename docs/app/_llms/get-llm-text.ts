import { renderLLMPlaceholders, tidyLLMMarkdown } from "@/lib/llms/options";
import { getPlatformStatusMarkdown } from "@/lib/llms/platform-status";
import type { Section } from "./config";
import type { LLMPage } from "./types";
import { getGitHubSourceUrl } from "./config";

/**
 * The page already exports markdown that the compile-time handlers rewrote; all that is
 * left is filling the placeholder markers, which is the one step that has to await.
 */
async function processedBody(page: LLMPage): Promise<string> {
  const renderer = await page.data.load();
  const { exports } = await renderer.render();
  return tidyLLMMarkdown(await renderLLMPlaceholders(exports.processed ?? ""));
}

/**
 * 컴포넌트 문서 페이지는 본문에 <PlatformStatusTable> 노드가 없으므로(플랫폼 상태를
 * 헤더에서 렌더) llms.txt에서는 여기서 상태 테이블을 주입한다. componentIds 프론트매터가
 * 있으면 그 목록(서브컴포넌트를 여럿 다루는 페이지), 없으면 slug 하나로 간주한다.
 */
async function platformStatusBlock(page: LLMPage, section: Section): Promise<string> {
  if (section !== "components") return "";
  const slugId = page.slugs.at(-1);
  const componentIds = page.data.frontmatter.componentIds ?? (slugId ? [slugId] : []);
  if (componentIds.length === 0) return "";
  const table = await getPlatformStatusMarkdown(componentIds);
  return table ? `${table}\n\n` : "";
}

export async function getLLMText(page: LLMPage, section: Section): Promise<string> {
  const processed = await processedBody(page);
  const sourceUrl = getGitHubSourceUrl(section, page.path);
  const platformStatus = await platformStatusBlock(page, section);

  return `# ${page.data.title}
URL: ${page.url}
Source: ${sourceUrl}

${page.data.description ?? ""}

${platformStatus}${processed}`;
}

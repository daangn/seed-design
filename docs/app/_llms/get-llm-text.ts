import type { LLMPage, Section } from "./types";
import { getGitHubSourceUrl, getLLMMarkdownUrl } from "./config";
import { ensureRulesReady, normalizeLLMBody } from "./normalize-llm-body";

const _ready = ensureRulesReady();

function titleToSlug(name: string): string {
  return name
    .replace(/`/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}

function buildDeprecationNotice(page: LLMPage, section: Section, allPages: LLMPage[]): string {
  if (!page.data.deprecated) return "";

  let notice = `\n> **Deprecated:** ${page.data.deprecated}\n`;

  if (page.data.replacement) {
    const slug = titleToSlug(page.data.replacement);
    const replacementPage = allPages.find(
      (p) => p.slugs[p.slugs.length - 1] === slug && !p.data.deprecated,
    );
    if (replacementPage) {
      const llmsUrl = getLLMMarkdownUrl(section, replacementPage.slugs);
      notice += `> **Replacement:** [${replacementPage.data.title}](${llmsUrl})\n`;
    }
  }

  return notice;
}

export async function getLLMText(
  page: LLMPage,
  section: Section,
  allPages?: LLMPage[],
): Promise<string> {
  await _ready;
  const processed = normalizeLLMBody(await page.data.getText("processed"));
  const sourceUrl = getGitHubSourceUrl(section, page.path);

  const deprecationNotice =
    page.data.deprecated && allPages
      ? buildDeprecationNotice(page, section, allPages)
      : page.data.deprecated
        ? `\n> **Deprecated:** ${page.data.deprecated}\n`
        : "";

  return `# ${page.data.title}
URL: ${page.url}
Source: ${sourceUrl}
${deprecationNotice}
${page.data.description ?? ""}

${processed}`;
}

export async function getLLMTextForFullCompilation(
  page: LLMPage,
  section?: Section,
  allPages?: LLMPage[],
): Promise<string> {
  await _ready;
  const processed = normalizeLLMBody(await page.data.getText("processed"));

  const deprecationNotice =
    page.data.deprecated && section && allPages
      ? buildDeprecationNotice(page, section, allPages)
      : page.data.deprecated
        ? `\n> **Deprecated:** ${page.data.deprecated}\n`
        : "";

  return `file: ${page.path}

# ${page.data.title}
${deprecationNotice}
${page.data.description ?? ""}

${processed}`;
}

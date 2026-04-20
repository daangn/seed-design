import type { LLMPage, Section } from "./types";
import { getGitHubSourceUrl } from "./config";
import { ensureRulesReady, normalizeLLMBody } from "./normalize-llm-body";

const _ready = ensureRulesReady();

function buildDeprecationNotice(page: LLMPage): string {
  if (!page.data.deprecated) return "";
  return `\n> **Deprecated:** ${page.data.deprecated}\n`;
}

export async function getLLMText(
  page: LLMPage,
  section: Section,
): Promise<string> {
  await _ready;
  const processed = normalizeLLMBody(await page.data.getText("processed"));
  const sourceUrl = getGitHubSourceUrl(section, page.path);

  const deprecationNotice = buildDeprecationNotice(page);

  return `# ${page.data.title}
URL: ${page.url}
Source: ${sourceUrl}
${deprecationNotice}
${page.data.description ?? ""}

${processed}`;
}

export async function getLLMTextForFullCompilation(
  page: LLMPage,
): Promise<string> {
  await _ready;
  const processed = normalizeLLMBody(await page.data.getText("processed"));

  const deprecationNotice = buildDeprecationNotice(page);

  return `file: ${page.path}

# ${page.data.title}
${deprecationNotice}
${page.data.description ?? ""}

${processed}`;
}

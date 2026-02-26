import type { LLMPage, Section } from "./types";
import { getGitHubSourceUrl } from "./config";
import { ensureRulesReady, normalizeLLMBody } from "./normalize-llm-body";

const _ready = ensureRulesReady();

export async function getLLMText(page: LLMPage, section: Section): Promise<string> {
  await _ready;
  const processed = normalizeLLMBody(await page.data.getText("processed"));
  const sourceUrl = getGitHubSourceUrl(section, page.path);

  return `# ${page.data.title}
URL: ${page.url}
Source: ${sourceUrl}

${page.data.description ?? ""}

${processed}`;
}

export async function getLLMTextForFullCompilation(page: LLMPage): Promise<string> {
  await _ready;
  const processed = normalizeLLMBody(await page.data.getText("processed"));

  return `file: ${page.path}

# ${page.data.title}

${page.data.description ?? ""}

${processed}`;
}

import type { LLMPage, Section } from "./types";
import { getGitHubSourceUrl } from "./config";
import { normalizeLLMBody } from "./normalize-llm-body";
import { CONTENT_ENHANCEMENT_RULES } from "./content-enhancement-rules";

export async function getLLMText(page: LLMPage, section: Section): Promise<string> {
  const processed = normalizeLLMBody(await page.data.getText("processed"));
  const sourceUrl = getGitHubSourceUrl(section, page.path);

  let content = `# ${page.data.title}

URL: ${page.url}
Source: ${sourceUrl}

${page.data.description ?? ""}

${processed}`;

  // Apply content enhancement rules
  for (const rule of CONTENT_ENHANCEMENT_RULES) {
    if (rule.shouldApply(page, section)) {
      console.log(`[getLLMText] Applying enhancement rule: ${rule.name}`);
      content = await rule.enhance(content, page);
    }
  }

  // Normalize the final content after enhancements
  return normalizeLLMBody(content);
}

export async function getLLMTextForFullCompilation(page: LLMPage): Promise<string> {
  const processed = normalizeLLMBody(await page.data.getText("processed"));

  return `file: ${page.path}

# ${page.data.title}

${page.data.description ?? ""}

${processed}`;
}

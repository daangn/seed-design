import type { LLMPage, Section } from "./types";
import { getGitHubSourceUrl } from "./config";

function normalizeCodeIndent(code: string): string {
  const lines = code.replace(/\r\n/g, "\n").split("\n");
  const nonEmptyLines = lines.filter((line) => line.trim().length > 0);
  const minIndent = nonEmptyLines.reduce((min, line) => {
    const indent = line.match(/^(\s*)/)?.[1].length ?? 0;
    return Math.min(min, indent);
  }, Number.POSITIVE_INFINITY);

  if (!Number.isFinite(minIndent) || minIndent === 0) {
    return lines.join("\n").trimEnd();
  }

  return lines.map((line) => line.slice(minIndent)).join("\n").trimEnd();
}

function simplifyCodeBlockTabs(content: string): string {
  return content.replace(/<CodeBlockTabs\b[\s\S]*?<\/CodeBlockTabs>/g, (block) => {
    const tabs: Array<{ value: string; language: string; code: string }> = [];

    for (const tabMatch of block.matchAll(
      /<CodeBlockTab\s+value="([^"]+)"\s*>([\s\S]*?)<\/CodeBlockTab>/g,
    )) {
      const value = tabMatch[1];
      const inner = tabMatch[2];
      const codeMatch = inner.match(/```([^\n`]*)\n([\s\S]*?)```/);
      if (!codeMatch) continue;

      const language = codeMatch[1].trim() || "bash";
      const code = normalizeCodeIndent(codeMatch[2]);

      tabs.push({ value, language, code });
    }

    if (tabs.length === 0) return "";

    const preferredOrder = ["npm", "pnpm", "yarn", "bun"];
    const primary =
      preferredOrder
        .map((value) => tabs.find((tab) => tab.value === value))
        .find((tab) => Boolean(tab)) ?? tabs[0];
    const alternatives = tabs.filter((tab) => tab !== primary);

    const lines = [
      `\`\`\`${primary.language}`,
      primary.code,
      "```",
    ];

    if (alternatives.length > 0) {
      lines.push("");
      lines.push("다른 패키지 매니저:");
      for (const tab of alternatives) {
        if (tab.code.includes("\n")) {
          lines.push(`- ${tab.value}:`);
          lines.push(`\`\`\`${tab.language}`);
          lines.push(tab.code);
          lines.push("```");
          continue;
        }

        lines.push(`- ${tab.value}: \`${tab.code}\``);
      }
    }

    return lines.join("\n");
  });
}

function stripKnownMdxWrappers(content: string): string {
  return content
    .replace(/^\s*<ComponentExample\b[^>]*>\s*$/gm, "")
    .replace(/^\s*<\/ComponentExample>\s*$/gm, "")
    .replace(/^\s*<ManualInstallation\b[^>]*\/>\s*$/gm, "");
}

function normalizeFencedCodeBlocks(content: string): string {
  return content.replace(
    /(^|\n)\s*```([^\n`]*)\n([\s\S]*?)\n\s*```(?=\n|$)/g,
    (_match, prefix: string, language: string, code: string) => {
      const normalizedCode = normalizeCodeIndent(code);
      return `${prefix}\`\`\`${language}\n${normalizedCode}\n\`\`\``;
    },
  );
}

function normalizeLLMBody(content?: string): string {
  if (!content) return "";

  return normalizeFencedCodeBlocks(stripKnownMdxWrappers(simplifyCodeBlockTabs(content)))
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function getLLMText(page: LLMPage, section: Section): Promise<string> {
  const processed = normalizeLLMBody(await page.data.getText("processed"));
  const sourceUrl = getGitHubSourceUrl(section, page.path);

  return `# ${page.data.title}

URL: ${page.url}
Source: ${sourceUrl}

${page.data.description ?? ""}

${processed}`;
}

export async function getLLMTextForFullCompilation(page: LLMPage): Promise<string> {
  const processed = normalizeLLMBody(await page.data.getText("processed"));

  return `file: ${page.path}

# ${page.data.title}

${page.data.description ?? ""}

${processed}`;
}

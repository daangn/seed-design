export type MarkdownSegment =
  | { type: "text"; text: string }
  | { type: "code"; code: string; language: string };

export function parseMarkdownCodeBlocks(markdown: string): MarkdownSegment[] {
  if (!markdown) return [];

  const segments: MarkdownSegment[] = [];
  let lastIndex = 0;
  const codeFenceRegex = /```([^\n`]*)\n([\s\S]*?)```/g;

  for (const match of markdown.matchAll(codeFenceRegex)) {
    const fullMatch = match[0];
    const languageRaw = match[1] ?? "";
    const code = match[2] ?? "";
    const start = match.index ?? -1;

    if (start < 0) continue;

    if (start > lastIndex) {
      const text = markdown.slice(lastIndex, start);
      if (text) {
        segments.push({ type: "text", text });
      }
    }

    const language = languageRaw.trim().split(/\s+/)[0] || "tsx";
    const normalizedCode = code.replace(/\n$/, "");
    segments.push({ type: "code", code: normalizedCode, language });

    lastIndex = start + fullMatch.length;
  }

  if (lastIndex < markdown.length) {
    const text = markdown.slice(lastIndex);
    if (text) {
      segments.push({ type: "text", text });
    }
  }

  return segments;
}

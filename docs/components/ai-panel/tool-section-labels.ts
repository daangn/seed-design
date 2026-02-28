const TOOL_SECTION_LABEL_LINE_REGEX =
  /^\s*(?:[-*+]\s*)?(?:\d+\.\s*)?(?:#{1,6}\s*)?(?:\*\*|__)?\s*(?:preview|미리보기|example|사용\s*예시|installation|install|설치)\s*:?\s*(?:\*\*|__)?\s*$/i;

export function stripToolSectionLabels(text: string): string {
  if (!text.trim()) return "";

  return text
    .split("\n")
    .filter((line) => !TOOL_SECTION_LABEL_LINE_REGEX.test(line))
    .join("\n")
    .trim();
}

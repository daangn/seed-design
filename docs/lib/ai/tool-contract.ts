export type ToolSection = "examples" | "installations" | "props" | "other";

export interface ToolPolicy {
  section: ToolSection;
  sectionTitle: string | null;
  textSuppressionRules: RegExp[];
  shortTextDiscardPattern?: RegExp;
  dropFencedCodeFromText?: boolean;
}

interface ToolDedupeContext {
  input: Record<string, unknown>;
  output?: unknown;
  fallbackKey: string;
}

function getRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object") return {};
  return value as Record<string, unknown>;
}

function getString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

const DEFAULT_TOOL_POLICY: ToolPolicy = {
  section: "other",
  sectionTitle: null,
  textSuppressionRules: [],
};

const TOOL_POLICIES: Record<string, ToolPolicy> = {
  showComponentExample: {
    section: "examples",
    sectionTitle: "사용 예시",
    dropFencedCodeFromText: true,
    textSuppressionRules: [
      /^#{1,6}\s*(preview|미리보기|example|사용 예시)\s*$/gim,
      /^\s*(?:[-*]\s*)?(?:preview|미리보기|example|사용 예시)\s*:?\s*$/gim,
    ],
  },
  showInstallation: {
    section: "installations",
    sectionTitle: "설치",
    dropFencedCodeFromText: true,
    textSuppressionRules: [
      /^#{1,6}\s*(installation|install|설치)\s*$/gim,
      /^.*@seed-design\/cli@latest add.*$/gim,
      /^\s*(?:[-*]\s*)?(?:installation|install|설치)\s*:?\s*$/gim,
    ],
  },
  showCodeBlock: {
    section: "examples",
    sectionTitle: "사용 예시",
    dropFencedCodeFromText: true,
    textSuppressionRules: [],
  },
  showReactTypeTable: {
    section: "props",
    sectionTitle: "Props",
    dropFencedCodeFromText: true,
    textSuppressionRules: [
      /^#{1,6}\s*props\s*$/gim,
      /^.*(주요\s*props|props는 다음과 같습니다|prop table|props table|타입 테이블|프로퍼티 목록).*$/gim,
      /^\s*[-*]\s*\*\*[^*]+\*\*.*$/gim,
    ],
    shortTextDiscardPattern:
      /(주요\s*props|props는 다음과 같습니다|prop table|props table|타입 테이블)/i,
  },
};

const GENERATIVE_UI_TOOL_NAMES = new Set<string>(Object.keys(TOOL_POLICIES));

function normalizeForDedupe(raw: string): string {
  return raw.trim().toLowerCase();
}

export function isGenerativeUITool(toolName: string): boolean {
  return GENERATIVE_UI_TOOL_NAMES.has(toolName) || /^show[A-Z]/.test(toolName);
}

export function shouldCollapseToolResult(toolName: string): boolean {
  return !isGenerativeUITool(toolName);
}

export function getToolPolicy(toolName: string): ToolPolicy {
  return TOOL_POLICIES[toolName] ?? DEFAULT_TOOL_POLICY;
}

export function getToolPolicies(toolNames: Iterable<string>): ToolPolicy[] {
  const deduped = new Set<string>();
  const policies: ToolPolicy[] = [];

  for (const toolName of toolNames) {
    if (deduped.has(toolName)) continue;
    deduped.add(toolName);
    policies.push(getToolPolicy(toolName));
  }

  return policies;
}

export function shouldDropFencedCodeFromText(toolNames: Iterable<string>): boolean {
  for (const toolName of toolNames) {
    if (getToolPolicy(toolName).dropFencedCodeFromText) {
      return true;
    }
  }

  return false;
}

function getExampleDedupeKey({ input, output, fallbackKey }: ToolDedupeContext): string {
  const safeOutput = getRecord(output);
  const previewName = getString(safeOutput.previewName) || getString(safeOutput.name);
  const name = getString(input.name);
  const component = getString(input.component) || getString(safeOutput.component);

  return `example:${normalizeForDedupe(previewName || name || component || fallbackKey)}`;
}

function getInstallationDedupeKey({ input, output, fallbackKey }: ToolDedupeContext): string {
  const safeOutput = getRecord(output);
  const component =
    getString(safeOutput.component) || getString(input.component) || getString(input.name);

  return `install:${normalizeForDedupe(component || fallbackKey)}`;
}

function getPropsDedupeKey({ input, output, fallbackKey }: ToolDedupeContext): string {
  const safeOutput = getRecord(output);
  const component = getString(input.component);
  const typeName = getString(safeOutput.typeName) || getString(input.name);

  return `props:${normalizeForDedupe(component || typeName || fallbackKey)}`;
}

function getCodeBlockDedupeKey({ input, fallbackKey }: ToolDedupeContext): string {
  const title = getString(input.title);
  const code = getString(input.code);
  const language = getString(input.language);

  return `code:${normalizeForDedupe(title || `${language}:${code}` || fallbackKey)}`;
}

export function getToolDedupeKey(
  toolName: string,
  input: Record<string, unknown>,
  output: unknown,
  fallbackKey: string,
): string {
  const context: ToolDedupeContext = {
    input,
    output,
    fallbackKey,
  };

  switch (toolName) {
    case "showComponentExample":
      return getExampleDedupeKey(context);
    case "showInstallation":
      return getInstallationDedupeKey(context);
    case "showReactTypeTable":
      return getPropsDedupeKey(context);
    case "showCodeBlock":
      return getCodeBlockDedupeKey(context);
    default:
      return `${toolName}:${fallbackKey}`;
  }
}

import { getReactLlmsComponentIds } from "./llms-props";

export interface ResolvedComponent {
  id: string;
  matchedAlias: string;
}

export interface ComponentGuideIntent {
  type: "component-guide";
  question: string;
  component: ResolvedComponent;
  focus: "installation" | "example" | "props" | "mixed";
}

const CACHE_TTL_MS = 1000 * 60 * 10;
const GUIDE_KEYWORDS = [
  "사용",
  "사용법",
  "예시",
  "설치",
  "설명",
  "컴포넌트",
  "props",
  "prop",
  "타입",
  "type",
  "usage",
  "example",
  "examples",
  "install",
  "installation",
  "how to",
  "how",
] as const;
const INSTALLATION_FOCUS_KEYWORDS = [
  "설치",
  "installation",
  "install",
  "setup",
] as const;
const EXAMPLE_FOCUS_KEYWORDS = [
  "사용",
  "사용법",
  "예시",
  "example",
  "examples",
  "preview",
  "usage",
] as const;
const PROPS_FOCUS_KEYWORDS = [
  "props",
  "prop",
  "타입",
  "type",
  "interface",
] as const;

const componentCacheByBaseUrl = new Map<string, { expiresAt: number; ids: string[] }>();

export function clearComponentGuideIntentCache() {
  componentCacheByBaseUrl.clear();
}

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/+$/, "");
}

function toKebabCase(raw: string): string {
  const withWordBoundary = raw.replace(/([a-z0-9])([A-Z])/g, "$1-$2");
  return withWordBoundary
    .trim()
    .toLowerCase()
    .replace(/^ui:/, "")
    .replace(/[^\w\s-]/g, " ")
    .replace(/_/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeQuery(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[_/]/g, " ")
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildAliases(componentId: string): string[] {
  const compact = componentId.replace(/-/g, "");
  const spaced = componentId.replace(/-/g, " ");
  return Array.from(new Set([componentId, compact, spaced]));
}

function includesAlias(query: string, alias: string): boolean {
  if (!alias) return false;
  if (alias.includes(" ")) {
    return query.includes(alias);
  }
  const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`(?:^|\\s)${escaped}(?:$|\\s)`);
  return pattern.test(query);
}

function hasGuideKeyword(query: string): boolean {
  return GUIDE_KEYWORDS.some((keyword) => query.includes(keyword));
}

function extractPascalCandidates(question: string): string[] {
  const matches = question.match(/\b[A-Z][a-z0-9]*(?:[A-Z][a-z0-9]+)+\b/g) ?? [];
  return matches.map(toKebabCase).filter(Boolean);
}

function resolveComponentByAliases(question: string, componentIds: string[]): ResolvedComponent | null {
  if (componentIds.length === 0) return null;

  const normalizedQuestion = normalizeQuery(question);
  const pascalCandidates = extractPascalCandidates(question);
  const sortedIds = [...componentIds].sort((a, b) => b.length - a.length);

  for (const candidate of pascalCandidates) {
    if (componentIds.includes(candidate)) {
      return { id: candidate, matchedAlias: candidate };
    }
  }

  for (const id of sortedIds) {
    const aliases = buildAliases(id);
    for (const alias of aliases) {
      if (includesAlias(normalizedQuestion, alias)) {
        return { id, matchedAlias: alias };
      }
    }
  }

  return null;
}

async function loadComponentIdsFromLlms(baseUrl: string): Promise<string[]> {
  const now = Date.now();
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl);
  const cached = componentCacheByBaseUrl.get(normalizedBaseUrl);

  if (cached && cached.expiresAt > now) {
    return cached.ids;
  }

  try {
    const ids = Array.from(new Set((await getReactLlmsComponentIds(normalizedBaseUrl)).map(toKebabCase)));
    componentCacheByBaseUrl.set(normalizedBaseUrl, {
      ids,
      expiresAt: now + CACHE_TTL_MS,
    });
    return ids;
  } catch (error) {
    console.error("[ai-intent] Failed to load React component IDs from llms index:", error);
    return [];
  }
}

function shouldTreatAsGuideQuestion(question: string, component: ResolvedComponent): boolean {
  const normalizedQuestion = normalizeQuery(question);

  if (hasGuideKeyword(normalizedQuestion)) {
    return true;
  }

  const canonicalAsSentence = component.id.replace(/-/g, " ");
  return (
    normalizedQuestion === component.id ||
    normalizedQuestion === canonicalAsSentence ||
    normalizedQuestion === component.matchedAlias
  );
}

function countFocusKeywords(question: string, keywords: readonly string[]): number {
  return keywords.reduce((count, keyword) => (question.includes(keyword) ? count + 1 : count), 0);
}

function resolveGuideFocus(question: string): ComponentGuideIntent["focus"] {
  const normalizedQuestion = normalizeQuery(question);
  const installationScore = countFocusKeywords(normalizedQuestion, INSTALLATION_FOCUS_KEYWORDS);
  const exampleScore = countFocusKeywords(normalizedQuestion, EXAMPLE_FOCUS_KEYWORDS);
  const propsScore = countFocusKeywords(normalizedQuestion, PROPS_FOCUS_KEYWORDS);

  const maxScore = Math.max(installationScore, exampleScore, propsScore);
  if (maxScore === 0) {
    return "mixed";
  }

  const winners = [
    installationScore === maxScore ? "installation" : null,
    exampleScore === maxScore ? "example" : null,
    propsScore === maxScore ? "props" : null,
  ].filter(Boolean) as Array<ComponentGuideIntent["focus"]>;

  if (winners.length !== 1) {
    return "mixed";
  }

  return winners[0];
}

export async function detectComponentGuideIntent(
  question: string,
  options?: { componentIds?: string[]; baseUrl?: string },
): Promise<ComponentGuideIntent | null> {
  const trimmedQuestion = question.trim();
  if (!trimmedQuestion) return null;

  const baseUrl = options?.baseUrl ?? "https://seed-design.io";
  const componentIds = options?.componentIds ?? (await loadComponentIdsFromLlms(baseUrl));
  const resolvedComponent = resolveComponentByAliases(trimmedQuestion, componentIds);
  if (!resolvedComponent) return null;

  if (!shouldTreatAsGuideQuestion(trimmedQuestion, resolvedComponent)) {
    return null;
  }

  return {
    type: "component-guide",
    question: trimmedQuestion,
    component: resolvedComponent,
    focus: resolveGuideFocus(trimmedQuestion),
  };
}

function getStringFromPart(part: unknown): string {
  if (!part || typeof part !== "object") return "";
  const text = (part as { text?: unknown }).text;
  if (typeof text === "string") return text;
  return "";
}

function getMessageText(message: unknown): string {
  if (!message || typeof message !== "object") return "";

  const parts = (message as { parts?: unknown }).parts;
  if (Array.isArray(parts)) {
    const joined = parts
      .map((part) => {
        if (!part || typeof part !== "object") return "";
        if ((part as { type?: unknown }).type !== "text") return "";
        return getStringFromPart(part);
      })
      .filter(Boolean)
      .join("\n")
      .trim();
    if (joined) return joined;
  }

  const content = (message as { content?: unknown }).content;
  if (typeof content === "string") return content.trim();
  return "";
}

export function extractLatestUserText(messages: unknown[]): string {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (!message || typeof message !== "object") continue;
    if ((message as { role?: unknown }).role !== "user") continue;

    const text = getMessageText(message);
    if (text) {
      return text;
    }
  }

  return "";
}

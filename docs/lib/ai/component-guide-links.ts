import { resolveReactComponentLlmsPath } from "./llms-props";

export interface ComponentGuideLink {
  title: string;
  url: string;
}

interface VerifiedLinkEntry {
  title: string;
  url: string;
  searchable: string;
}

interface LlmsDocument {
  title: string;
  url: string;
}

interface DocsLlmsComponentEntry {
  componentId: string;
  path: string;
}

interface DocsLlmsComponentIndex {
  byId: Map<string, DocsLlmsComponentEntry[]>;
  all: VerifiedLinkEntry[];
}

const CACHE_TTL_MS = 1000 * 60 * 10;
const COMPONENTS_SECTION_REGEX = /(^|\n)###\s+components\s*\n([\s\S]*?)(?=\n###\s+|$)/i;
const LINK_REGEX = /^\s*[-*]\s*\[([^\]]+)\]\(([^)]+)\)\s*$/gm;
const STOP_WORDS = new Set([
  "the",
  "a",
  "an",
  "and",
  "or",
  "to",
  "for",
  "of",
  "in",
  "on",
  "with",
  "how",
  "what",
  "where",
  "why",
  "who",
  "when",
  "is",
  "are",
  "can",
  "please",
  "show",
  "tell",
  "help",
  "문서",
  "링크",
  "관련",
  "사용",
  "방법",
  "설명",
  "알려줘",
  "보여줘",
  "해주세요",
]);

const docsIndexCache = new Map<string, { expiresAt: number; index: DocsLlmsComponentIndex }>();
const queryIndexCache = new Map<string, { expiresAt: number; entries: VerifiedLinkEntry[] }>();
const textCache = new Map<string, { expiresAt: number; text: string }>();

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/+$/, "");
}

function toKebabCase(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/^ui:/, "")
    .replace(/[^\w\s-]/g, " ")
    .replace(/_/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function isSeedDomain(hostname: string): boolean {
  return hostname === "seed-design.io" || hostname === "www.seed-design.io";
}

function normalizeSeedAbsoluteUrl(raw: string, baseUrl: string): string | null {
  if (raw.startsWith("/")) {
    return `https://seed-design.io${raw}`;
  }

  try {
    const parsed = new URL(raw, baseUrl);
    const isAllowedHost =
      isSeedDomain(parsed.hostname) ||
      parsed.hostname === "localhost" ||
      parsed.hostname === "127.0.0.1";
    const isDocsPath =
      parsed.pathname.startsWith("/docs/") ||
      parsed.pathname.startsWith("/react/") ||
      parsed.pathname.startsWith("/breeze/") ||
      parsed.pathname.startsWith("/lynx/") ||
      parsed.pathname.startsWith("/ai-integration/");

    if (!isAllowedHost || !isDocsPath) {
      return null;
    }

    return `https://seed-design.io${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return null;
  }
}

function getBasenameComponentId(pathname: string): string {
  const fileName = pathname.split("/").pop() ?? "";
  return toKebabCase(fileName.replace(/\.txt$/i, ""));
}

function isDocsComponentLlmsPath(pathname: string): boolean {
  return /^\/llms\/docs\/.+\.txt$/i.test(pathname);
}

function parseLlmsEntryUrl(rawHref: string): URL | null {
  try {
    const parsed = rawHref.startsWith("http://") || rawHref.startsWith("https://")
      ? new URL(rawHref)
      : new URL(rawHref, "https://seed-design.io");
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;

    return parsed;
  } catch {
    return null;
  }
}

function toCanonicalPageUrlFromLlmsPath(pathname: string): string | null {
  const normalized = pathname.replace(/\/+$/, "");
  if (!normalized.endsWith(".txt")) {
    return null;
  }

  if (normalized.startsWith("/llms/docs/")) {
    return `https://seed-design.io/docs/${normalized.replace(/^\/llms\/docs\//, "").replace(/\.txt$/, "")}`;
  }

  if (normalized.startsWith("/llms/react/")) {
    return `https://seed-design.io/react/${normalized.replace(/^\/llms\/react\//, "").replace(/\.txt$/, "")}`;
  }

  return null;
}

function normalizeSearchableText(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s/-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function toQueryTokens(query: string): string[] {
  const tokens = query
    .toLowerCase()
    .match(/[a-z0-9가-힣-]+/g)
    ?.map((token) => token.trim())
    .filter((token) => token.length >= 2 && !STOP_WORDS.has(token));

  if (!tokens) return [];
  return Array.from(new Set(tokens));
}

function scoreLinkEntry(entry: VerifiedLinkEntry, tokens: string[]): number {
  if (tokens.length === 0) return 0;

  let score = 0;
  for (const token of tokens) {
    if (entry.searchable.includes(token)) {
      score += 3;
    }

    const compactToken = token.replaceAll("-", "");
    if (compactToken && entry.searchable.replaceAll("-", "").includes(compactToken)) {
      score += 2;
    }
  }

  return score;
}

async function fetchText(url: string): Promise<string> {
  const cacheKey = url;
  const now = Date.now();
  const cached = textCache.get(cacheKey);
  if (cached && cached.expiresAt > now) {
    return cached.text;
  }

  const response = await fetch(url, {
    cache: "no-store",
    headers: {
      Accept: "text/plain, text/markdown;q=0.9, */*;q=0.8",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url} (HTTP ${response.status})`);
  }

  const text = await response.text();
  textCache.set(cacheKey, {
    text,
    expiresAt: now + CACHE_TTL_MS,
  });

  return text;
}

function parseDocsLlmsComponentIndex(markdown: string): DocsLlmsComponentIndex {
  const section = markdown.match(COMPONENTS_SECTION_REGEX)?.[2] ?? "";
  const byId = new Map<string, DocsLlmsComponentEntry[]>();
  const all: VerifiedLinkEntry[] = [];

  for (const match of section.matchAll(LINK_REGEX)) {
    const title = match[1]?.trim() ?? "";
    const href = match[2]?.trim() ?? "";
    if (!href) continue;

    const parsed = parseLlmsEntryUrl(href);
    if (!parsed || !isDocsComponentLlmsPath(parsed.pathname)) continue;
    const pathname = parsed.pathname;

    const componentId = getBasenameComponentId(pathname);
    if (!componentId) continue;

    const nextEntries = byId.get(componentId) ?? [];
    nextEntries.push({
      componentId,
      path: pathname,
    });
    byId.set(componentId, nextEntries);

    const canonicalUrl = toCanonicalPageUrlFromLlmsPath(pathname);
    if (!canonicalUrl) continue;

    all.push({
      title: title || componentId,
      url: canonicalUrl,
      searchable: normalizeSearchableText(`${title} ${canonicalUrl}`),
    });
  }

  return { byId, all };
}

function parseSectionLlmsIndex(markdown: string): VerifiedLinkEntry[] {
  const entries: VerifiedLinkEntry[] = [];

  for (const match of markdown.matchAll(LINK_REGEX)) {
    const title = match[1]?.trim() ?? "";
    const href = match[2]?.trim() ?? "";
    if (!href || !title) continue;

    const parsed = parseLlmsEntryUrl(href);
    if (!parsed) continue;
    const canonicalUrl = toCanonicalPageUrlFromLlmsPath(parsed.pathname);
    if (!canonicalUrl) continue;

    entries.push({
      title,
      url: canonicalUrl,
      searchable: normalizeSearchableText(`${title} ${canonicalUrl}`),
    });
  }

  return entries;
}

function chooseBestEntry(entries: DocsLlmsComponentEntry[]): DocsLlmsComponentEntry | null {
  if (entries.length === 0) return null;

  return (
    entries.find((entry) => new RegExp(`/components/${entry.componentId}\\.txt$`, "i").test(entry.path)) ??
    entries[0]
  );
}

async function loadDocsLlmsComponentIndex(baseUrl: string): Promise<DocsLlmsComponentIndex> {
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl);
  const now = Date.now();
  const cached = docsIndexCache.get(normalizedBaseUrl);
  if (cached && cached.expiresAt > now) {
    return cached.index;
  }

  const markdown = await fetchText(`${normalizedBaseUrl}/docs/llms.txt`);
  const index = parseDocsLlmsComponentIndex(markdown);

  docsIndexCache.set(normalizedBaseUrl, {
    index,
    expiresAt: now + CACHE_TTL_MS,
  });

  return index;
}

async function resolveDocsComponentLlmsPath(
  componentId: string,
  baseUrl: string,
): Promise<string | null> {
  const normalizedComponent = toKebabCase(componentId);
  if (!normalizedComponent) return null;

  try {
    const index = await loadDocsLlmsComponentIndex(baseUrl);
    const indexed = chooseBestEntry(index.byId.get(normalizedComponent) ?? []);
    if (indexed) {
      return indexed.path;
    }
  } catch (error) {
    console.error("[ai-links] Failed to resolve docs component path from docs/llms.txt:", error);
  }

  return `/llms/docs/components/${normalizedComponent}.txt`;
}

function parseLlmsDocument(text: string, baseUrl: string): LlmsDocument | null {
  const title = text.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? "";
  const rawUrl = text.match(/^URL:\s*(\S+)$/m)?.[1]?.trim() ?? "";

  if (!title || !rawUrl) {
    return null;
  }

  const url = normalizeSeedAbsoluteUrl(rawUrl, baseUrl);
  if (!url) {
    return null;
  }

  return {
    title,
    url,
  };
}

async function fetchLlmsDocument(baseUrl: string, llmsPath: string): Promise<LlmsDocument | null> {
  try {
    const normalizedBaseUrl = normalizeBaseUrl(baseUrl);
    const absoluteUrl = llmsPath.startsWith("http://") || llmsPath.startsWith("https://")
      ? llmsPath
      : `${normalizedBaseUrl}${llmsPath.startsWith("/") ? llmsPath : `/${llmsPath}`}`;
    const text = await fetchText(absoluteUrl);
    return parseLlmsDocument(text, normalizedBaseUrl);
  } catch {
    return null;
  }
}

function dedupeLinks(links: ComponentGuideLink[]): ComponentGuideLink[] {
  const byUrl = new Map<string, ComponentGuideLink>();
  for (const link of links) {
    if (!byUrl.has(link.url)) {
      byUrl.set(link.url, link);
    }
  }

  return Array.from(byUrl.values());
}

export async function resolveComponentGuideLinks(input: {
  componentId: string;
  baseUrl: string;
}): Promise<ComponentGuideLink[]> {
  const normalizedComponentId = toKebabCase(input.componentId);
  if (!normalizedComponentId) {
    return [];
  }

  const baseUrl = normalizeBaseUrl(input.baseUrl);

  const [docsLlmsPath, reactLlmsPath] = await Promise.all([
    resolveDocsComponentLlmsPath(normalizedComponentId, baseUrl),
    resolveReactComponentLlmsPath(normalizedComponentId, baseUrl),
  ]);

  const [docsDocument, reactDocument] = await Promise.all([
    docsLlmsPath ? fetchLlmsDocument(baseUrl, docsLlmsPath) : Promise.resolve(null),
    reactLlmsPath ? fetchLlmsDocument(baseUrl, reactLlmsPath) : Promise.resolve(null),
  ]);

  const links: ComponentGuideLink[] = [];

  if (docsDocument) {
    links.push({
      title: `${docsDocument.title} (Docs)`,
      url: docsDocument.url,
    });
  }

  if (reactDocument) {
    links.push({
      title: `${reactDocument.title} (React)`,
      url: reactDocument.url,
    });
  }

  return dedupeLinks(links).slice(0, 3);
}

export async function resolveVerifiedLinksForQuery(input: {
  query: string;
  baseUrl: string;
  limit?: number;
}): Promise<ComponentGuideLink[]> {
  const query = input.query.trim();
  if (!query) return [];

  const limit = Math.max(1, Math.min(5, input.limit ?? 3));
  const baseUrl = normalizeBaseUrl(input.baseUrl);
  const cacheKey = `${baseUrl}:query-index`;

  let entries: VerifiedLinkEntry[] = [];
  const now = Date.now();
  const cached = queryIndexCache.get(cacheKey);
  if (cached && cached.expiresAt > now) {
    entries = cached.entries;
  } else {
    const [docsMarkdown, reactMarkdown] = await Promise.all([
      fetchText(`${baseUrl}/docs/llms.txt`).catch(() => ""),
      fetchText(`${baseUrl}/react/llms.txt`).catch(() => ""),
    ]);

    entries = dedupeLinks([
      ...parseSectionLlmsIndex(docsMarkdown),
      ...parseSectionLlmsIndex(reactMarkdown),
    ]).map((entry) => ({
      title: entry.title,
      url: entry.url,
      searchable: normalizeSearchableText(`${entry.title} ${entry.url}`),
    }));

    queryIndexCache.set(cacheKey, {
      entries,
      expiresAt: now + CACHE_TTL_MS,
    });
  }

  const tokens = toQueryTokens(query);
  if (tokens.length === 0 || entries.length === 0) {
    return [];
  }

  const selected = entries
    .map((entry) => ({ entry, score: scoreLinkEntry(entry, tokens) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => ({
      title: item.entry.title,
      url: item.entry.url,
    }));

  return dedupeLinks(selected).slice(0, limit);
}

export function clearComponentGuideLinksCache() {
  docsIndexCache.clear();
  queryIndexCache.clear();
  textCache.clear();
}

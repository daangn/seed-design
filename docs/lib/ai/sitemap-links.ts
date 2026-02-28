const DEFAULT_SITEMAP_URL = "https://seed-design.io/sitemap.xml";
const CACHE_TTL_MS = 1000 * 60 * 10;

export interface RelatedLink {
  title: string;
  url: string;
}

interface SitemapEntry {
  url: string;
  pathname: string;
  normalizedPath: string;
}

interface SitemapCache {
  expiresAt: number;
  entries: SitemapEntry[];
}

interface ScoredEntry {
  entry: SitemapEntry;
  score: number;
}

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

let sitemapCache: SitemapCache | null = null;

function toTokens(query: string): string[] {
  const tokens = query
    .toLowerCase()
    .match(/[a-z0-9가-힣-]+/g)
    ?.map((token) => token.trim())
    .filter((token) => token.length >= 2 && !STOP_WORDS.has(token));

  if (!tokens) return [];
  return Array.from(new Set(tokens));
}

function parseSitemap(xml: string): SitemapEntry[] {
  const entries: SitemapEntry[] = [];
  const locRegex = /<loc>(.*?)<\/loc>/g;

  for (const match of xml.matchAll(locRegex)) {
    const raw = match[1];
    if (!raw) continue;

    try {
      const url = new URL(raw.replaceAll("&amp;", "&"));
      if (url.pathname === "/sitemap.xml") continue;

      const pathname = decodeURIComponent(url.pathname);
      const normalizedPath = pathname.toLowerCase();

      entries.push({
        url: url.toString(),
        pathname,
        normalizedPath,
      });
    } catch {
      // ignore invalid URLs and continue
    }
  }

  return entries;
}

function formatTitle(pathname: string): string {
  const segments = pathname
    .split("/")
    .filter(Boolean)
    .map((segment) => segment.replaceAll("-", " "));

  if (segments.length === 0) return "SEED Design";
  return segments.join(" / ");
}

function getTopSection(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  return (segments[0] ?? "").toLowerCase();
}

function scoreEntry(entry: SitemapEntry, tokens: string[]): number {
  if (tokens.length === 0) return 0;

  let score = 0;
  const normalizedPath = entry.normalizedPath;
  const pathSegments = normalizedPath.split("/").filter(Boolean);

  for (const token of tokens) {
    if (normalizedPath.includes(token)) {
      score += 3;
    }

    for (const segment of pathSegments) {
      if (segment === token) {
        score += 5;
      } else if (segment.includes(token)) {
        score += 2;
      }

      const normalizedSegment = segment.replaceAll("-", "");
      const normalizedToken = token.replaceAll("-", "");
      if (normalizedSegment === normalizedToken) {
        score += 3;
      }
    }
  }

  return score;
}

async function loadSitemapEntries(): Promise<SitemapEntry[]> {
  const now = Date.now();
  if (sitemapCache && sitemapCache.expiresAt > now) {
    return sitemapCache.entries;
  }

  try {
    const response = await fetch(DEFAULT_SITEMAP_URL, {
      headers: {
        Accept: "application/xml, text/xml;q=0.9, */*;q=0.8",
      },
      next: { revalidate: CACHE_TTL_MS / 1000 },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const xml = await response.text();
    const entries = parseSitemap(xml);

    sitemapCache = {
      entries,
      expiresAt: now + CACHE_TTL_MS,
    };

    return entries;
  } catch {
    return sitemapCache?.entries ?? [];
  }
}

export async function findRelatedLinks(query: string, limit = 3): Promise<RelatedLink[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const tokens = toTokens(trimmed);
  const entries = await loadSitemapEntries();

  if (entries.length === 0 || tokens.length === 0) {
    return [];
  }

  const scored: ScoredEntry[] = entries
    .map((entry) => ({ entry, score: scoreEntry(entry, tokens) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length === 0) {
    return [];
  }

  const selectedEntries: SitemapEntry[] = [];
  const seenEntryUrls = new Set<string>();

  // docs/react 문서를 우선적으로 한 개씩 포함해 다양성을 높인다.
  for (const preferredSection of ["docs", "react"]) {
    if (selectedEntries.length >= limit) break;

    const candidate = scored.find(({ entry }) => {
      return getTopSection(entry.pathname) === preferredSection && !seenEntryUrls.has(entry.url);
    });

    if (!candidate) continue;

    selectedEntries.push(candidate.entry);
    seenEntryUrls.add(candidate.entry.url);
  }

  for (const { entry } of scored) {
    if (selectedEntries.length >= limit) break;
    if (seenEntryUrls.has(entry.url)) continue;

    selectedEntries.push(entry);
    seenEntryUrls.add(entry.url);
  }

  const deduped: RelatedLink[] = [];
  const seen = new Set<string>();

  for (const entry of selectedEntries) {
    if (seen.has(entry.url)) continue;
    seen.add(entry.url);

    deduped.push({
      title: formatTitle(entry.pathname),
      url: entry.url,
    });
  }

  return deduped;
}

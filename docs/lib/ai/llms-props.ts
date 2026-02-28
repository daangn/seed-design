export interface ReactTypeTableRow {
  name: string;
  type: string;
  required: boolean;
  description: string;
  defaultValue: string | null;
}

export interface ReactLlmsComponentEntry {
  componentId: string;
  path: string;
  title: string;
}

export interface ReactLlmsComponentIndex {
  byId: Map<string, ReactLlmsComponentEntry[]>;
}

const CACHE_TTL_MS = 1000 * 60 * 10;
const COMPONENTS_SECTION_REGEX = /(^|\n)###\s+components\s*\n([\s\S]*?)(?=\n###\s+|$)/i;
const LINK_REGEX = /^\s*[-*]\s*\[([^\]]+)\]\(([^)]+)\)\s*$/gm;
const PROPS_HEADER_REGEX = /^(?:##\s+Props\b|Props\s+\\?\[#props\\?\])\s*$/i;
const NEXT_SECTION_REGEX = /^(?:##\s+\S|[A-Za-z가-힣0-9][^\n]*\s+\\?\#[^\]]*\]?\s*)$/;

const indexCache = new Map<string, { expiresAt: number; index: ReactLlmsComponentIndex }>();
const textCache = new Map<string, { expiresAt: number; text: string }>();

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/+$/, "");
}

function toKebabCase(raw: string): string {
  const withBoundary = raw.trim().replace(/([a-z0-9])([A-Z])/g, "$1-$2");
  return withBoundary
    .toLowerCase()
    .replace(/[_\s]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function toBoolean(raw: string): boolean {
  return raw.trim().toLowerCase() === "true";
}

function getBasenameComponentId(pathname: string): string {
  const fileName = pathname.split("/").pop() ?? "";
  return toKebabCase(fileName.replace(/\.txt$/i, ""));
}

function isReactComponentLlmsPath(pathname: string): boolean {
  return /^\/llms\/react\/components\/.+\.txt$/i.test(pathname);
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

export function parseReactLlmsComponentIndex(markdown: string): ReactLlmsComponentIndex {
  const sectionMatch = markdown.match(COMPONENTS_SECTION_REGEX);
  const section = sectionMatch?.[2] ?? "";

  const byId = new Map<string, ReactLlmsComponentEntry[]>();

  for (const match of section.matchAll(LINK_REGEX)) {
    const title = match[1]?.trim() ?? "";
    const href = match[2]?.trim() ?? "";
    if (!href) continue;

    let path: string;
    try {
      const parsed = href.startsWith("http://") || href.startsWith("https://")
        ? new URL(href)
        : new URL(href, "https://seed-design.io");

      if (!isReactComponentLlmsPath(parsed.pathname)) continue;
      path = parsed.pathname;
    } catch {
      continue;
    }

    const componentId = getBasenameComponentId(path);
    if (!componentId) continue;

    const entry: ReactLlmsComponentEntry = {
      componentId,
      path,
      title,
    };

    const prev = byId.get(componentId) ?? [];
    prev.push(entry);
    byId.set(componentId, prev);
  }

  return {
    byId,
  };
}

function chooseBestEntry(entries: ReactLlmsComponentEntry[]): ReactLlmsComponentEntry | null {
  if (entries.length === 0) return null;

  return (
    entries.find((entry) => new RegExp(`/components/${entry.componentId}\\.txt$`, "i").test(entry.path)) ??
    entries[0]
  );
}

export async function loadReactLlmsComponentIndex(baseUrl: string): Promise<ReactLlmsComponentIndex> {
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl);
  const now = Date.now();
  const cached = indexCache.get(normalizedBaseUrl);
  if (cached && cached.expiresAt > now) {
    return cached.index;
  }

  const markdown = await fetchText(`${normalizedBaseUrl}/react/llms.txt`);
  const index = parseReactLlmsComponentIndex(markdown);

  indexCache.set(normalizedBaseUrl, {
    index,
    expiresAt: now + CACHE_TTL_MS,
  });

  return index;
}

export async function getReactLlmsComponentIds(baseUrl: string): Promise<string[]> {
  const index = await loadReactLlmsComponentIndex(baseUrl);
  return Array.from(index.byId.keys());
}

export async function resolveReactComponentLlmsPath(
  component: string,
  baseUrl: string,
): Promise<string | null> {
  const normalizedComponent = toKebabCase(component);
  if (!normalizedComponent) return null;

  try {
    const index = await loadReactLlmsComponentIndex(baseUrl);
    const indexed = chooseBestEntry(index.byId.get(normalizedComponent) ?? []);
    if (indexed) {
      return indexed.path;
    }
  } catch (error) {
    console.error("[ai-tools] Failed to resolve component path from react/llms.txt:", error);
  }

  const candidates = [
    `/llms/react/components/${normalizedComponent}.txt`,
    `/llms/react/components/layout/${normalizedComponent}.txt`,
    `/llms/react/components/typography/${normalizedComponent}.txt`,
    `/llms/react/components/iconography/${normalizedComponent}.txt`,
  ];

  const normalizedBaseUrl = normalizeBaseUrl(baseUrl);
  for (const candidate of candidates) {
    try {
      const response = await fetch(`${normalizedBaseUrl}${candidate}`, {
        cache: "no-store",
        method: "HEAD",
      });
      if (response.ok) return candidate;
    } catch {
      // ignore and try next path
    }
  }

  return null;
}

function extractPropsSection(markdown: string): string[] {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const startIndex = lines.findIndex((line) => PROPS_HEADER_REGEX.test(line.trim()));
  if (startIndex < 0) return [];

  const sectionLines: string[] = [];
  for (let index = startIndex + 1; index < lines.length; index += 1) {
    const line = lines[index];
    const trimmed = line.trim();

    if (!trimmed) {
      sectionLines.push(line);
      continue;
    }

    if (NEXT_SECTION_REGEX.test(trimmed) && !trimmed.startsWith("-")) {
      break;
    }

    sectionLines.push(line);
  }

  return sectionLines;
}

export function parseReactPropsRowsFromLlms(markdown: string): ReactTypeTableRow[] {
  const sectionLines = extractPropsSection(markdown);
  if (sectionLines.length === 0) return [];

  const rows: ReactTypeTableRow[] = [];
  let current: ReactTypeTableRow | null = null;

  const flush = () => {
    if (!current) return;
    if (!current.type) {
      current = null;
      return;
    }
    rows.push(current);
    current = null;
  };

  for (const line of sectionLines) {
    const propMatch = line.match(/^\s*[-*]\s+`([^`]+)`\s*$/);
    if (propMatch) {
      flush();
      current = {
        name: propMatch[1],
        type: "",
        required: false,
        description: "",
        defaultValue: null,
      };
      continue;
    }

    if (!current) continue;

    const typeMatch = line.match(/^\s*[-*]\s+type:\s+`([^`]*)`\s*$/i);
    if (typeMatch) {
      current.type = typeMatch[1];
      continue;
    }

    const requiredMatch = line.match(/^\s*[-*]\s+required:\s+`?([^`\s]+)`?\s*$/i);
    if (requiredMatch) {
      current.required = toBoolean(requiredMatch[1]);
      continue;
    }

    const defaultMatch = line.match(/^\s*[-*]\s+default:\s+`([^`]*)`\s*$/i);
    if (defaultMatch) {
      current.defaultValue = defaultMatch[1] === "undefined" ? null : defaultMatch[1];
      continue;
    }

    const descriptionMatch = line.match(/^\s*[-*]\s+description:\s+(.+)$/i);
    if (descriptionMatch) {
      current.description = descriptionMatch[1].trim();
      continue;
    }
  }

  flush();

  return rows;
}

function extractFirstTsxCodeBlock(markdown: string): string | null {
  const match = markdown.match(/```tsx\n([\s\S]*?)\n```/i);
  return match?.[1]?.trim() ?? null;
}

export async function loadReactComponentPropsFromLlms(input: {
  component?: string;
  path?: string;
  baseUrl: string;
}): Promise<{ rows: ReactTypeTableRow[]; sourcePath: string | null; error?: string }> {
  const normalizedBaseUrl = normalizeBaseUrl(input.baseUrl);
  const component = toKebabCase(input.component ?? "");

  const sourcePath =
    input.path?.trim() ||
    (component ? await resolveReactComponentLlmsPath(component, normalizedBaseUrl) : null);

  if (!sourcePath) {
    return {
      rows: [],
      sourcePath: input.path?.trim() ?? null,
      error: "Props 타입 테이블을 찾지 못했어요.",
    };
  }

  const normalizedPath = sourcePath.startsWith("http://") || sourcePath.startsWith("https://")
    ? new URL(sourcePath).pathname
    : sourcePath.startsWith("/")
      ? sourcePath
      : `/${sourcePath.replace(/^\.?\/?/, "")}`;

  try {
    const markdown = await fetchText(`${normalizedBaseUrl}${normalizedPath}`);
    const rows = parseReactPropsRowsFromLlms(markdown);

    return {
      rows,
      sourcePath: normalizedPath,
      ...(rows.length === 0 ? { error: "타입 테이블 항목을 찾지 못했어요." } : {}),
    };
  } catch (error) {
    console.error("[ai-tools] Failed to load React props table from llms:", {
      sourcePath: normalizedPath,
      error,
    });
    return {
      rows: [],
      sourcePath: normalizedPath,
      error: error instanceof Error ? error.message : "타입 테이블 로딩에 실패했습니다.",
    };
  }
}

export async function loadReactComponentCodeFromLlms(input: {
  component: string;
  baseUrl: string;
}): Promise<{ code: string | null; sourcePath: string | null }> {
  const normalizedBaseUrl = normalizeBaseUrl(input.baseUrl);
  const sourcePath = await resolveReactComponentLlmsPath(input.component, normalizedBaseUrl);
  if (!sourcePath) {
    return {
      code: null,
      sourcePath: null,
    };
  }

  try {
    const markdown = await fetchText(`${normalizedBaseUrl}${sourcePath}`);
    return {
      code: extractFirstTsxCodeBlock(markdown),
      sourcePath,
    };
  } catch (error) {
    console.error("[ai-tools] Failed to load React component code from llms:", {
      sourcePath,
      error,
    });
    return {
      code: null,
      sourcePath,
    };
  }
}

export function clearLlmsPropsCache() {
  indexCache.clear();
  textCache.clear();
}

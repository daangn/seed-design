"use client";

import * as MonochromeIcons from "@karrotmarket/react-monochrome-icon";
import * as MulticolorIcons from "@karrotmarket/react-multicolor-icon";
import { forwardRef, type ComponentType } from "react";

const DOCS_BASE_URL = "https://seed-design.io/docs/foundation/iconography/library";
const DOCS_HOSTS = new Set(["seed-design.io", "www.seed-design.io"]);
const ICON_NAME_REGEX = /\bicon_[a-z0-9_]+\b/g;

type IconType = "monochrome" | "multicolor";

interface IconItem {
  name: string;
  type: IconType;
  variant?: "line" | "fill";
  service?: string;
}

interface IconToolPayload {
  toolName: string;
  icons: IconItem[];
  totalCount?: number;
  returnedCount?: number;
  query?: string;
  searchUrl?: string;
  suggestions?: string[];
  error?: string;
}

interface ToolIconResultProps {
  toolName: string;
  output?: unknown;
  maxItems?: number;
}

type IconComponentType = ComponentType<{
  size?: number | string;
  width?: number | string;
  height?: number | string;
  className?: string;
}>;

function getRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object") return {};
  return value as Record<string, unknown>;
}

function getString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function getNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function getStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((entry): entry is string => typeof entry === "string");
}

function extractTextOutput(output: unknown): string {
  if (typeof output === "string") {
    return output;
  }

  const safeOutput = getRecord(output);
  const content = safeOutput.content;

  if (typeof content === "string") {
    return content;
  }

  if (!Array.isArray(content)) {
    return "";
  }

  const chunks: string[] = [];
  for (const part of content) {
    const safePart = getRecord(part);
    if (safePart.type !== "text" || typeof safePart.text !== "string") {
      continue;
    }
    chunks.push(safePart.text);
  }

  return chunks.join("\n").trim();
}

function parseJsonRecord(text: string): Record<string, unknown> | null {
  if (!text.trim()) return null;

  try {
    const parsed = JSON.parse(text);
    if (!parsed || typeof parsed !== "object") {
      return null;
    }
    return parsed as Record<string, unknown>;
  } catch {
    return null;
  }
}

function resolveStructuredOutput(output: unknown): Record<string, unknown> {
  const safeOutput = getRecord(output);
  const structured = getRecord(safeOutput.structuredContent);
  if (Object.keys(structured).length > 0) {
    return structured;
  }

  if ("icons" in safeOutput || "results" in safeOutput || "icon" in safeOutput) {
    return safeOutput;
  }

  const parsedFromText = parseJsonRecord(extractTextOutput(output));
  if (parsedFromText) {
    return parsedFromText;
  }

  return {};
}

function inferIconType(iconName: string, typeHint?: string | null): IconType {
  if (typeHint === "monochrome" || typeHint === "multicolor") {
    return typeHint;
  }

  return /_(line|fill)$/i.test(iconName) ? "monochrome" : "multicolor";
}

function parseIconCandidate(
  candidate: unknown,
  fallbackType?: IconType,
): IconItem | null {
  const safe = getRecord(candidate);
  const name = getString(safe.name);
  if (!name || !name.startsWith("icon_")) {
    return null;
  }

  const type = inferIconType(name, getString(safe.type) ?? fallbackType ?? null);
  const variant = getString(safe.variant);
  const service = getString(safe.service);

  return {
    name,
    type,
    ...(variant === "line" || variant === "fill" ? { variant } : {}),
    ...(service ? { service } : {}),
  };
}

function parseIconArray(value: unknown, fallbackType?: IconType): IconItem[] {
  if (!Array.isArray(value)) return [];

  const deduped = new Map<string, IconItem>();
  for (const candidate of value) {
    const parsed = parseIconCandidate(candidate, fallbackType);
    if (!parsed) continue;
    deduped.set(parsed.name, parsed);
  }

  return Array.from(deduped.values());
}

function parseLegacyIconText(toolName: string, text: string): IconToolPayload | null {
  if (!text.trim()) return null;

  const iconNames = Array.from(text.matchAll(ICON_NAME_REGEX)).map((match) => match[0]);
  if (iconNames.length === 0) {
    return null;
  }

  const dedupedNames = Array.from(new Set(iconNames));
  const icons = dedupedNames.map((name) => ({
    name,
    type: inferIconType(name),
  }));

  const queryMatch = text.match(/matching\s+"([^"]+)"/i) ?? text.match(/for\s+"([^"]+)"/i);
  const searchUrlMatch = text.match(/https?:\/\/[^\s)]+/i);

  return {
    toolName,
    icons,
    ...(queryMatch?.[1] ? { query: queryMatch[1] } : {}),
    ...(searchUrlMatch?.[0] ? { searchUrl: searchUrlMatch[0] } : {}),
  };
}

export function toIconComponentName(iconName: string): string {
  return iconName
    .split("_")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join("");
}

export function extractIconToolPayload(toolName: string, output: unknown): IconToolPayload | null {
  const data = resolveStructuredOutput(output);
  const error = getString(data.error) ?? undefined;

  if (toolName === "list_icons") {
    const icons = parseIconArray(data.icons);
    const totalCount = getNumber(data.totalCount);
    const returnedCount = getNumber(data.returnedCount);
    if (icons.length === 0 && !error) {
      return parseLegacyIconText(toolName, extractTextOutput(output));
    }

    return {
      toolName,
      icons,
      ...(totalCount != null ? { totalCount } : {}),
      ...(returnedCount != null ? { returnedCount } : {}),
      ...(error ? { error } : {}),
    };
  }

  if (toolName === "search_icons") {
    const icons = parseIconArray(data.results);
    if (icons.length === 0 && !error) {
      return parseLegacyIconText(toolName, extractTextOutput(output));
    }

    return {
      toolName,
      icons,
      ...(getString(data.query) ? { query: getString(data.query) ?? undefined } : {}),
      ...(getString(data.searchUrl) ? { searchUrl: getString(data.searchUrl) ?? undefined } : {}),
      ...(error ? { error } : {}),
    };
  }

  if (toolName === "read_icon") {
    const icon = parseIconCandidate(data.icon);
    const suggestions = getStringArray(data.suggestions);

    if (!icon && suggestions.length === 0 && !error) {
      return parseLegacyIconText(toolName, extractTextOutput(output));
    }

    return {
      toolName,
      icons: icon ? [icon] : [],
      ...(suggestions.length > 0 ? { suggestions } : {}),
      ...(icon ? { searchUrl: getString(getRecord(data.icon).docsUrl) ?? undefined } : {}),
      ...(error ? { error } : {}),
    };
  }

  return null;
}

function getReactIconPackage(iconType: IconType): string {
  return iconType === "multicolor"
    ? "@karrotmarket/react-multicolor-icon"
    : "@karrotmarket/react-monochrome-icon";
}

function getIconDocsUrl(icon: IconItem): string {
  const params = new URLSearchParams();
  params.set("icon", icon.name);
  if (icon.type === "multicolor") {
    params.set("style", "multicolor");
  }

  return `${DOCS_BASE_URL}?${params.toString()}`;
}

function getSafeDocsUrl(url: string | null | undefined): string | null {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    if (!DOCS_HOSTS.has(parsed.hostname)) {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

function IconPreview({ icon }: { icon: IconItem }) {
  const componentName = toIconComponentName(icon.name);
  const iconMap =
    icon.type === "multicolor"
      ? (MulticolorIcons as Record<string, IconComponentType>)
      : (MonochromeIcons as Record<string, IconComponentType>);
  const IconComponent = iconMap[componentName];

  if (!IconComponent) {
    return (
      <div className="text-[11px] text-fd-muted-foreground leading-[1.3] text-center">
        미리보기를 찾지 못했어요.
      </div>
    );
  }

  return (
    <div className="inline-flex rounded-md bg-fd-card p-2">
      <IconComponent size={22} />
    </div>
  );
}

function IconMeta({ icon }: { icon: IconItem }) {
  return (
    <div className="mt-1 text-[11px] leading-[1.35] text-fd-muted-foreground">
      <div className="truncate font-medium text-fd-foreground">{icon.name}</div>
      <div>
        {icon.type}
        {icon.variant ? ` · ${icon.variant}` : ""}
        {icon.service ? ` · ${icon.service}` : ""}
      </div>
    </div>
  );
}

function IconImportSnippet({ icon }: { icon: IconItem }) {
  const componentName = toIconComponentName(icon.name);
  const packageName = getReactIconPackage(icon.type);
  const code = `import { ${componentName} } from "${packageName}"`;

  return (
    <pre className="mt-2 overflow-x-auto rounded-md bg-fd-muted px-2.5 py-2 text-[11px] text-fd-foreground">
      {code}
    </pre>
  );
}

function IconSummary({
  payload,
  visibleCount,
  maxItems,
}: {
  payload: IconToolPayload;
  visibleCount: number;
  maxItems: number;
}) {
  if (payload.toolName === "search_icons") {
    const query = payload.query ? `"${payload.query}"` : "검색";
    return (
      <div className="mb-2 text-xs text-fd-muted-foreground">
        {query} 결과 {payload.icons.length}개
      </div>
    );
  }

  if (payload.toolName === "list_icons") {
    const totalCount = payload.totalCount ?? payload.icons.length;
    return (
      <div className="mb-2 text-xs text-fd-muted-foreground">
        아이콘 {totalCount}개 중 {visibleCount}개 표시
        {payload.icons.length > maxItems ? ` (최대 ${maxItems}개)` : ""}
      </div>
    );
  }

  return null;
}

export const ToolIconResult = forwardRef<HTMLDivElement, ToolIconResultProps>(
  function ToolIconResult(
    { toolName, output, maxItems = 8 }: ToolIconResultProps,
    ref,
  ) {
    const payload = extractIconToolPayload(toolName, output);
    if (!payload) {
      return (
        <div ref={ref} className="text-xs text-fd-muted-foreground">
          아이콘 결과를 파싱하지 못했어요.
        </div>
      );
    }

    const safeMaxItems = Math.max(1, maxItems);
    const visibleIcons = payload.icons.slice(0, safeMaxItems);
    const firstIcon = visibleIcons[0];
    const primaryIcon = firstIcon ?? visibleIcons[0]!;
    const isDetailTool = payload.toolName === "read_icon";
    const actionUrl = getSafeDocsUrl(payload.searchUrl);

    if (visibleIcons.length === 0) {
      return (
        <div ref={ref} className="space-y-1 text-xs text-fd-muted-foreground">
          <div>{payload.error ?? "표시할 아이콘이 없어요."}</div>
          {payload.suggestions && payload.suggestions.length > 0 && (
            <div>
              추천 아이콘: {payload.suggestions.join(", ")}
            </div>
          )}
          {actionUrl && (
            <a
              href={actionUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex text-fd-primary underline underline-offset-2"
            >
              아이콘 라이브러리에서 확인하기
            </a>
          )}
        </div>
      );
    }

    return (
      <div ref={ref}>
        <IconSummary payload={payload} visibleCount={visibleIcons.length} maxItems={safeMaxItems} />

        {isDetailTool && firstIcon ? (
          <div className="rounded-md border border-fd-border bg-fd-card px-3 py-3">
            <div className="flex items-center gap-3">
              <IconPreview icon={firstIcon} />
              <div className="min-w-0 flex-1">
                <IconMeta icon={firstIcon} />
              </div>
            </div>
            <IconImportSnippet icon={firstIcon} />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {visibleIcons.map((icon) => (
              <div key={icon.name} className="rounded-md border border-fd-border bg-fd-card px-2.5 py-2">
                <IconPreview icon={icon} />
                <IconMeta icon={icon} />
              </div>
            ))}
          </div>
        )}

        <div className="mt-2 flex items-center gap-2 text-xs">
          {payload.error && <span className="text-fd-destructive">{payload.error}</span>}
          <a
            href={actionUrl ?? getIconDocsUrl(primaryIcon)}
            target="_blank"
            rel="noreferrer"
            className="text-fd-primary underline underline-offset-2"
          >
            아이콘 라이브러리 열기
          </a>
        </div>
      </div>
    );
  },
);

ToolIconResult.displayName = "ToolIconResult";

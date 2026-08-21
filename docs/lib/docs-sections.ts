// A URL's first matching prefix names its section, so order matters. Nothing under /react is
// carved out: /react/updates holds the React package's own changelog and upgrade guides, which
// belong to React, not to the design system news at /updates.
export const DOCS_SECTIONS = [
  { href: "/get-started", label: "Get Started" },
  { href: "/foundations", label: "Foundations" },
  { href: "/components", label: "Components" },
  { href: "/patterns", label: "Patterns" },
  { href: "/react", label: "React" },
  { href: "/lynx", label: "Lynx" },
  { href: "/ai-integration", label: "AI & Tools" },
  { href: "/updates", label: "Updates" },
  { href: "/breeze", label: "Breeze" },
  { href: "/docs", label: "Docs" },
] as const satisfies readonly { href: string; label: string }[];

const INTERNAL_ORIGIN = "https://seed-docs.local";

function internalPathname(url: string): string | undefined {
  if (!url.startsWith("/") || url.startsWith("//")) return undefined;

  try {
    const parsed = new URL(url, INTERNAL_ORIGIN);
    return parsed.origin === INTERNAL_ORIGIN ? parsed.pathname : undefined;
  } catch {
    return undefined;
  }
}

export function resolveDocsSection(url: string): { href: string; label: string } | undefined {
  const pathname = internalPathname(url);
  if (!pathname) return undefined;

  return DOCS_SECTIONS.find(({ href }) => pathname === href || pathname.startsWith(`${href}/`));
}

export function sectionLabel(url: string): string {
  return resolveDocsSection(url)?.label ?? "";
}

import { buildEntryLookup, type EntryLookup } from "@/lib/changelog-data";
import type { ChangelogEntry, ChangelogSource } from "./parse-changelog";
import { loadChangelogSources, parseChangelogSources } from "./parse-changelog";

export type { EntryLookup };

const SCOPE = "@seed-design/";

export function toSlug(packageName: string): string {
  return packageName.replace(SCOPE, "");
}

export function toPackageName(slug: string): string {
  return `${SCOPE}${slug}`;
}

let sourcesCache: Awaited<ReturnType<typeof loadChangelogSources>> | null = null;

export async function getSources(): Promise<ChangelogSource[]> {
  if (!sourcesCache) {
    sourcesCache = await loadChangelogSources(process.cwd());
  }
  return sourcesCache;
}

export async function buildLookupFromSources(sources: ChangelogSource[]): Promise<{
  entries: ChangelogEntry[];
  lookup: EntryLookup;
}> {
  const entries = await parseChangelogSources(sources);
  const lookup = buildEntryLookup(entries);
  return { entries, lookup };
}

function entryPlainText(entry: ChangelogEntry): string {
  return entry.contentBlocks
    .map((block) => {
      if (block.type === "code") return `\`\`\`${block.lang}\n${block.code}\n\`\`\``;
      return block.plainText;
    })
    .join("\n");
}

function formatListItem(text: string, indent = ""): string {
  const lines = text.split("\n");
  const first = lines[0] ?? "";
  const rest = lines.slice(1);
  return [`${indent}- ${first}`, ...rest.map((line) => (line ? `${indent}  ${line}` : ""))].join(
    "\n",
  );
}

export function renderVersionMarkdown(
  packageName: string,
  version: string,
  entries: ChangelogEntry[],
  lookup: EntryLookup,
): string {
  const sorted = [...entries].sort((a, b) => a.order - b.order);

  const directEntries: ChangelogEntry[] = [];
  const depRelatedPackages: ChangelogEntry["relatedPackages"] = [];

  for (const entry of sorted) {
    if (entry.isDependencyOnly) {
      for (const pkg of entry.relatedPackages) {
        depRelatedPackages.push(pkg);
      }
    } else {
      directEntries.push(entry);
    }
  }

  const lines: string[] = [`## ${version}`];

  // Group direct entries by section
  const bySection = new Map<string, ChangelogEntry[]>();
  for (const entry of directEntries) {
    const section = entry.section ?? "Changes";
    const existing = bySection.get(section);
    if (existing) {
      existing.push(entry);
    } else {
      bySection.set(section, [entry]);
    }
  }

  for (const [section, sectionEntries] of bySection) {
    lines.push("", `### ${section}`, "");
    for (const entry of sectionEntries) {
      lines.push(formatListItem(entryPlainText(entry)));
    }
  }

  // Resolve and render dependency updates
  const uniqueDeps = Array.from(
    new Map(depRelatedPackages.map((pkg) => [`${pkg.name}@${pkg.version}`, pkg] as const)).values(),
  );

  if (uniqueDeps.length > 0) {
    lines.push("", "### Updated Dependencies", "");
    for (const dep of uniqueDeps) {
      const resolvedEntries = (lookup.get(`${dep.name}@${dep.version}`) ?? []).filter(
        (e) => !e.isDependencyOnly,
      );

      lines.push(`- **${dep.name}@${dep.version}**`);
      for (const resolved of resolvedEntries) {
        const sectionLabel = resolved.section ? `[${resolved.section}]` : "";
        const text = entryPlainText(resolved);
        lines.push(formatListItem(`${sectionLabel ? `${sectionLabel} ` : ""}${text}`, "  "));
      }
    }
  }

  return lines.join("\n");
}

export function groupEntriesByVersion(
  entries: ChangelogEntry[],
  packageName: string,
): Map<string, ChangelogEntry[]> {
  const groups = new Map<string, ChangelogEntry[]>();
  for (const entry of entries) {
    if (entry.package.name !== packageName) continue;
    const existing = groups.get(entry.package.version);
    if (existing) {
      existing.push(entry);
    } else {
      groups.set(entry.package.version, [entry]);
    }
  }
  return groups;
}

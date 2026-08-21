import { buildEntryLookup, type EntryLookup } from "@/lib/changelog-data";
import type { ChangelogEntry, ChangelogSource } from "./parse-changelog";
import {
  loadChangelogSources,
  parseChangelogSources,
  splitVersionSections,
} from "./parse-changelog";

export type { EntryLookup };

const SCOPE = "@seed-design/";

export interface ChangelogLlmPackageData {
  packageName: string;
  versions: string[];
  versionIndex: ReadonlyMap<string, number>;
  renderedBlocks: string[];
}

export interface ChangelogLlmData {
  sources: ChangelogSource[];
  entries: ChangelogEntry[];
  lookup: EntryLookup;
  packages: ReadonlyMap<string, ChangelogLlmPackageData>;
}

export function toSlug(packageName: string): string {
  return packageName.replace(SCOPE, "");
}

export function toPackageName(slug: string): string {
  return `${SCOPE}${slug}`;
}

export function toVersionSlug(version: string): string {
  return encodeURIComponent(version);
}

let sourcesPromise: Promise<ChangelogSource[]> | null = null;

export async function getSources(): Promise<ChangelogSource[]> {
  sourcesPromise ??= loadChangelogSources(process.cwd());
  return sourcesPromise;
}

export async function buildLookupFromSources(sources: ChangelogSource[]): Promise<{
  entries: ChangelogEntry[];
  lookup: EntryLookup;
}> {
  const entries = await parseChangelogSources(sources);
  const lookup = buildEntryLookup(entries);
  return { entries, lookup };
}

export async function buildChangelogLlmData(sources: ChangelogSource[]): Promise<ChangelogLlmData> {
  const { entries, lookup } = await buildLookupFromSources(sources);
  const packages = new Map<string, ChangelogLlmPackageData>();

  for (const source of sources) {
    const versions = splitVersionSections(source.raw).map(({ version }) => version);
    const versionGroups = groupEntriesByVersion(entries, source.packageName);
    const renderedBlocks = versions.map((version) => {
      const group = versionGroups.get(version);
      if (!group) return `## ${version}\n\n(no entries)`;
      return renderVersionMarkdown(version, group, lookup);
    });

    packages.set(source.packageName, {
      packageName: source.packageName,
      versions,
      versionIndex: new Map(versions.map((version, index) => [version, index])),
      renderedBlocks,
    });
  }

  return { sources, entries, lookup, packages };
}

export function createChangelogLlmDataLoader(
  loadSources: () => Promise<ChangelogSource[]> = getSources,
): () => Promise<ChangelogLlmData> {
  let dataPromise: Promise<ChangelogLlmData> | null = null;

  return () => {
    dataPromise ??= loadSources().then(buildChangelogLlmData);
    return dataPromise;
  };
}

export const getChangelogLlmData = createChangelogLlmDataLoader();

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

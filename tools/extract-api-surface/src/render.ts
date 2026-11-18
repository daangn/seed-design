import type { EntrySurface, ExportSurface, Member, PackageSurface } from "./extract";

/**
 * One line per export or member, so a line diff between two renders reads as an API diff.
 */
export function renderPackage(pkg: PackageSurface) {
  const lines = [
    `# ${pkg.name}`,
    ...pkg.bins.map((bin) => `bin ${bin}`),
    ...pkg.entries.flatMap((entry) => ["", ...renderEntry(entry)]),
  ];

  return `${lines.join("\n")}\n`;
}

export const renderSurface = (packages: PackageSurface[]) => packages.map(renderPackage).join("\n");

function renderEntry(entry: EntrySurface) {
  if (entry.kind === "asset")
    return [`## ${entry.subpath}`, ...entry.targets.map((target) => `asset ${target}`)];
  if (entry.kind === "unresolved") return [`## ${entry.subpath}`, `unresolved ${entry.target}`];

  return [`## ${entry.subpath}`, ...entry.exports.flatMap(renderExport)];
}

function renderExport(surface: ExportSurface) {
  const head = `${surface.kind} ${surface.name}`;
  const separator = surface.kind === "type" || surface.kind === "alias" ? " = " : ": ";
  const signatures = surface.signatures ?? [];

  return [
    ...(signatures.length === 0
      ? [head]
      : signatures.map((signature) => `${head}${separator}${signature}`)),
    ...renderDoc(surface.doc, "  "),
    ...(surface.members ?? []).flatMap((member) => renderMember(member, "")),
    ...(surface.external ?? []).map(({ source, count }) => `  ...${source} (${count})`),
    ...(surface.statics ?? []).flatMap((member) => renderMember(member, "static ")),
  ];
}

const renderMember = (member: Member, prefix: string) => [
  `  ${prefix}${member.name}${member.optional ? "?" : ""}: ${member.type}${member.declaredIn ? `  [${member.declaredIn}]` : ""}`,
  ...renderDoc(member.doc, "    "),
];

/** Docs get their own line, so a doc edit and a type change show up as separate diff lines. */
const renderDoc = (doc: string | undefined, indent: string) => (doc ? [`${indent}// ${doc}`] : []);

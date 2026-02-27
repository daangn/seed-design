import type { PublicRegistry } from "@/src/schema";
import { getPackageInfo } from "@/src/utils/get-package-info";
import * as p from "@clack/prompts";
import fs from "fs-extra";
import path from "path";
import { intersects, satisfies, valid, validRange } from "semver";
import { highlight } from "./color";

export const COMPAT_PACKAGE_NAMES = ["@seed-design/react", "@seed-design/css"] as const;
export type CompatPackageName = (typeof COMPAT_PACKAGE_NAMES)[number];

const WORKSPACE_VERSION_PREFIX = "workspace:";
const NPM_ALIAS_PREFIX = "npm:";

export interface CompatibilityIssue {
  itemKey: string;
  packageName: CompatPackageName;
  requiredRanges: string[];
  installedVersionSpec?: string;
  type: "missing-package" | "invalid-version-spec" | "incompatible-version";
}

export interface CompatibilityReport {
  checkedItemKeys: string[];
  projectPackageVersions: Partial<Record<CompatPackageName, string>>;
  issues: CompatibilityIssue[];
}

export function getProjectSeedPackageVersionSpecs(
  cwd: string,
): Partial<Record<CompatPackageName, string>> {
  try {
    const packageInfo = getPackageInfo(cwd);
    const packageDeps = {
      ...packageInfo.dependencies,
      ...packageInfo.devDependencies,
      ...packageInfo.peerDependencies,
      ...packageInfo.optionalDependencies,
    };
    const result: Partial<Record<CompatPackageName, string>> = {};

    for (const packageName of COMPAT_PACKAGE_NAMES) {
      const value = packageDeps[packageName];
      if (typeof value === "string") {
        result[packageName] = value;
      }
    }

    return result;
  } catch {
    return {};
  }
}

export function analyzeRegistryItemCompatibility({
  publicRegistries,
  itemKeys,
  projectPackageVersions,
}: {
  publicRegistries: PublicRegistry[];
  itemKeys: string[];
  projectPackageVersions: Partial<Record<CompatPackageName, string>>;
}): CompatibilityReport {
  const checkedItemKeys = Array.from(new Set(itemKeys));
  const itemMap = new Map<string, PublicRegistry["items"][number]>(
    publicRegistries.flatMap((registry) =>
      registry.items.map((item) => [`${registry.id}:${item.id}`, item] as const),
    ),
  );

  const issues: CompatibilityIssue[] = [];

  for (const itemKey of checkedItemKeys) {
    const item = itemMap.get(itemKey);
    if (!item) continue;

    const requiredRangesByPackage = collectRequiredRangesByPackage(item);

    for (const packageName of COMPAT_PACKAGE_NAMES) {
      const requiredRanges = Array.from(requiredRangesByPackage[packageName] ?? []);

      if (!requiredRanges.length) continue;

      const installedVersionSpec = projectPackageVersions[packageName];

      if (!installedVersionSpec) {
        issues.push({
          itemKey,
          packageName,
          requiredRanges,
          type: "missing-package",
        });
        continue;
      }

      const normalizedVersionSpec = normalizeVersionSpec(installedVersionSpec);

      if (!normalizedVersionSpec) {
        issues.push({
          itemKey,
          packageName,
          requiredRanges,
          installedVersionSpec,
          type: "invalid-version-spec",
        });
        continue;
      }

      const isRangeCompatible = requiredRanges.every((requiredRange) =>
        isVersionCompatible({
          currentVersionSpec: normalizedVersionSpec,
          requiredRange,
        }),
      );

      if (!isRangeCompatible) {
        issues.push({
          itemKey,
          packageName,
          requiredRanges,
          installedVersionSpec,
          type: "incompatible-version",
        });
      }
    }
  }

  return {
    checkedItemKeys,
    projectPackageVersions,
    issues,
  };
}

export function logCompatibilityReport({
  report,
  title,
}: {
  report: CompatibilityReport;
  title: string;
}) {
  if (!report.issues.length) return;

  p.log.warn(title);
  p.log.info(
    `현재 프로젝트 버전: ${COMPAT_PACKAGE_NAMES.map((packageName) => `${packageName}@${highlight(report.projectPackageVersions[packageName] ?? "미설치")}`).join(", ")}`,
  );

  const issuesByItem = new Map<string, CompatibilityIssue[]>();

  for (const issue of report.issues) {
    const found = issuesByItem.get(issue.itemKey) ?? [];
    found.push(issue);
    issuesByItem.set(issue.itemKey, found);
  }

  for (const [itemKey, issues] of issuesByItem.entries()) {
    p.log.warn(highlight(itemKey));

    for (const issue of issues) {
      const required = issue.requiredRanges.join(" | ");

      if (issue.type === "missing-package") {
        p.log.info(
          `  - ${issue.packageName}: 패키지가 설치되어 있지 않아요. 필요 범위: ${required}`,
        );
        continue;
      }

      if (issue.type === "invalid-version-spec") {
        p.log.info(
          `  - ${issue.packageName}: 현재 버전 형식을 해석하지 못했어요 (${issue.installedVersionSpec}). 필요 범위: ${required}`,
        );
        continue;
      }

      p.log.info(
        `  - ${issue.packageName}: 현재 ${issue.installedVersionSpec}, 필요 범위 ${required}`,
      );
    }
  }
}

export function findInstalledSnippetItemKeys({
  publicRegistries,
  rootPath,
}: {
  publicRegistries: PublicRegistry[];
  rootPath: string;
}): string[] {
  const installedItemKeys: string[] = [];

  for (const registry of publicRegistries) {
    for (const item of registry.items) {
      const isInstalled = item.snippets.some((snippet) =>
        getSnippetPathCandidates(snippet.path).some((snippetPath) =>
          fs.existsSync(path.join(rootPath, registry.id, snippetPath)),
        ),
      );

      if (isInstalled) {
        installedItemKeys.push(`${registry.id}:${item.id}`);
      }
    }
  }

  return installedItemKeys;
}

function collectRequiredRangesByPackage(item: PublicRegistry["items"][number]) {
  const requiredRangesByPackage = Object.fromEntries(
    COMPAT_PACKAGE_NAMES.map((packageName) => [packageName, new Set<string>()]),
  ) as Record<CompatPackageName, Set<string>>;

  for (const snippet of item.snippets) {
    for (const [packageName, requiredRange] of Object.entries(snippet.dependencies ?? {})) {
      if (!isCompatPackageName(packageName)) continue;
      requiredRangesByPackage[packageName].add(requiredRange);
    }
  }

  return requiredRangesByPackage;
}

function normalizeVersionSpec(versionSpec: string): string | null {
  let normalized = versionSpec.trim();

  if (normalized.startsWith(WORKSPACE_VERSION_PREFIX)) {
    normalized = normalized.slice(WORKSPACE_VERSION_PREFIX.length).trim();
  }

  if (normalized.startsWith(NPM_ALIAS_PREFIX)) {
    const aliasVersionToken = normalized.split("@").at(-1);
    if (!aliasVersionToken) return null;
    normalized = aliasVersionToken;
  }

  if (!normalized || normalized === "*") return null;

  if (valid(normalized)) return normalized;
  if (validRange(normalized)) return normalized;

  return null;
}

function isVersionCompatible({
  currentVersionSpec,
  requiredRange,
}: {
  currentVersionSpec: string;
  requiredRange: string;
}) {
  const normalizedRequiredRange = validRange(requiredRange);
  if (!normalizedRequiredRange) return false;

  if (valid(currentVersionSpec)) {
    return satisfies(currentVersionSpec, normalizedRequiredRange, {
      includePrerelease: true,
    });
  }

  return intersects(currentVersionSpec, normalizedRequiredRange, {
    includePrerelease: true,
  });
}

function getSnippetPathCandidates(originalPath: string): string[] {
  const candidates = new Set([originalPath]);

  if (originalPath.endsWith(".tsx")) {
    candidates.add(`${originalPath.slice(0, -4)}.jsx`);
  }

  if (originalPath.endsWith(".ts")) {
    candidates.add(`${originalPath.slice(0, -3)}.js`);
  }

  if (originalPath.endsWith(".jsx")) {
    candidates.add(`${originalPath.slice(0, -4)}.tsx`);
  }

  if (originalPath.endsWith(".js")) {
    candidates.add(`${originalPath.slice(0, -3)}.ts`);
  }

  return Array.from(candidates);
}

function isCompatPackageName(packageName: string): packageName is CompatPackageName {
  return COMPAT_PACKAGE_NAMES.includes(packageName as CompatPackageName);
}

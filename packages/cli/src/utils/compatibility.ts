import type { CompatManifest, PublicRegistry } from "@/src/schema";
import { getInstalledPackageVersion, getPackageInfo } from "@/src/utils/get-package-info";
import * as p from "@clack/prompts";
import fs from "fs-extra";
import path from "path";
import { gt, intersects, minVersion, satisfies, valid, validRange } from "semver";
import { highlight } from "./color";

const REACT_COMPAT_PACKAGES = ["@seed-design/react", "@seed-design/css"] as const;
const LYNX_COMPAT_PACKAGES = ["@seed-design/lynx-react", "@seed-design/lynx-css"] as const;

export type CompatPackageName =
  | (typeof REACT_COMPAT_PACKAGES)[number]
  | (typeof LYNX_COMPAT_PACKAGES)[number];

export function getCompatPackageNames(framework: string): readonly CompatPackageName[] {
  return framework === "lynx" ? LYNX_COMPAT_PACKAGES : REACT_COMPAT_PACKAGES;
}

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
  framework = "react",
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
    const compatPackages = getCompatPackageNames(framework);

    for (const packageName of compatPackages) {
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
  framework = "react",
}: {
  publicRegistries: PublicRegistry[];
  itemKeys: string[];
  projectPackageVersions: Partial<Record<CompatPackageName, string>>;
  framework?: string;
}): CompatibilityReport {
  const checkedItemKeys = Array.from(new Set(itemKeys));
  const itemMap = new Map<string, PublicRegistry["items"][number]>(
    publicRegistries.flatMap((registry) =>
      registry.items.map((item) => [`${registry.id}:${item.id}`, item] as const),
    ),
  );

  const issues: CompatibilityIssue[] = [];
  const compatPackages = getCompatPackageNames(framework);

  for (const itemKey of checkedItemKeys) {
    const item = itemMap.get(itemKey);
    if (!item) continue;

    const requiredRangesByPackage = collectRequiredRangesByPackage(item, framework);

    for (const packageName of compatPackages) {
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
  framework = "react",
}: {
  report: CompatibilityReport;
  title: string;
  framework?: string;
}) {
  if (!report.issues.length) return;

  const compatPackages = getCompatPackageNames(framework);

  p.log.warn(title);
  p.log.info(
    `현재 프로젝트 버전: ${compatPackages.map((packageName) => `${packageName}@${highlight(report.projectPackageVersions[packageName] ?? "미설치")}`).join(", ")}`,
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

function collectRequiredRangesByPackage(
  item: PublicRegistry["items"][number],
  framework = "react",
) {
  const compatPackages = getCompatPackageNames(framework);
  const requiredRangesByPackage = Object.fromEntries(
    compatPackages.map((packageName) => [packageName, new Set<string>()]),
  ) as Record<CompatPackageName, Set<string>>;

  for (const snippet of item.snippets) {
    for (const [packageName, requiredRange] of Object.entries(snippet.dependencies ?? {})) {
      if (!isCompatPackageName(packageName, framework)) continue;
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

function isCompatPackageName(
  packageName: string,
  framework = "react",
): packageName is CompatPackageName {
  return (getCompatPackageNames(framework) as readonly string[]).includes(packageName);
}

///////////////////////////////////////////////////////////////
// 패키지 간 호환성 (manifest 기반)
//
// 스니펫 검사(위)와 달리, 설치된 seed 패키지들끼리의 peer 선언이
// 서로 만족되는지(예: react@1.1.12 가 요구하는 css 범위를 설치된 css 가 만족하는지)를
// compat manifest 로 판정해요. manifest 의 선언(Layer 1)에 overlay(Layer 2)를 덮어
// "effective 범위"를 계산해요.
///////////////////////////////////////////////////////////////

export interface PackagePeerIssue {
  /** 요구하는 쪽, 예: "@seed-design/react@1.1.12" */
  from: string;
  fromPackage: string;
  fromVersion: string;
  /** 요구되는 대상 패키지, 예: "@seed-design/css" */
  requires: string;
  /** effective 요구 범위 */
  range: string;
  /** 설치된 대상 버전 (미설치면 null) */
  installed: string | null;
  type: "incompatible" | "missing";
}

export interface KnownBadIssue {
  type: "known-bad";
  packages: Record<string, string>;
  reason: string;
}

export interface PackagePeerReport {
  installed: Record<string, string>;
  issues: PackagePeerIssue[];
  knownBad: KnownBadIssue[];
  /** 대상 패키지별로 "어디까지 올리면 모두 풀리나" (위반 범위들의 최대 하한) */
  resolution: Record<string, string>;
  ok: boolean;
}

/** manifest 에 등재된 패키지들의 실제 설치 버전을 node_modules 에서 읽어요. */
export function getInstalledManifestPackageVersions({
  manifest,
  cwd,
}: {
  manifest: CompatManifest;
  cwd: string;
}): Record<string, string> {
  const installed: Record<string, string> = {};
  for (const packageName of Object.keys(manifest.packages)) {
    const version = getInstalledPackageVersion(packageName, cwd);
    if (version) installed[packageName] = version;
  }
  return installed;
}

/**
 * 특정 패키지 버전의 effective peer 범위를 계산해요.
 * declared(Layer 1) 위에 correction(override) → backfill(빈 곳 채움) 순으로 overlay 를 적용해요.
 */
export function resolveEffectivePeers({
  packageName,
  version,
  manifest,
}: {
  packageName: string;
  version: string;
  manifest: CompatManifest;
}): Record<string, string> {
  const declared =
    manifest.packages[packageName]?.versions.find((v) => v.version === version)?.peers ?? {};
  const peers: Record<string, string> = { ...declared };

  const matches = (range: string) => valid(version) !== null && satisfies(version, range);

  // correction: 선언을 덮어씀
  for (const overlay of manifest.overlays) {
    if (
      overlay.kind === "correction" &&
      overlay.package === packageName &&
      matches(overlay.versionRange)
    ) {
      Object.assign(peers, overlay.peers);
    }
  }
  // backfill: 선언이 비어 있는 키만 채움
  for (const overlay of manifest.overlays) {
    if (
      overlay.kind === "backfill" &&
      overlay.package === packageName &&
      matches(overlay.versionRange)
    ) {
      for (const [target, range] of Object.entries(overlay.peers)) {
        if (!(target in peers)) peers[target] = range;
      }
    }
  }

  return peers;
}

export function analyzePackagePeerCompatibility({
  manifest,
  installedVersions,
}: {
  manifest: CompatManifest;
  installedVersions: Record<string, string>;
}): PackagePeerReport {
  const issues: PackagePeerIssue[] = [];

  for (const [packageName, version] of Object.entries(installedVersions)) {
    const peers = resolveEffectivePeers({ packageName, version, manifest });

    for (const [requires, range] of Object.entries(peers)) {
      const installedTarget = installedVersions[requires];

      if (!installedTarget) {
        issues.push({
          from: `${packageName}@${version}`,
          fromPackage: packageName,
          fromVersion: version,
          requires,
          range,
          installed: null,
          type: "missing",
        });
        continue;
      }

      if (!satisfies(installedTarget, range)) {
        issues.push({
          from: `${packageName}@${version}`,
          fromPackage: packageName,
          fromVersion: version,
          requires,
          range,
          installed: installedTarget,
          type: "incompatible",
        });
      }
    }
  }

  // known-bad: 설치 조합이 사고로 기록된 조합과 모두 일치하면 보고
  const knownBad: KnownBadIssue[] = [];
  for (const overlay of manifest.overlays) {
    if (overlay.kind !== "known-bad") continue;
    const entries = Object.entries(overlay.packages);
    const allMatch =
      entries.length > 0 &&
      entries.every(([pkg, range]) => {
        const installed = installedVersions[pkg];
        return installed != null && satisfies(installed, range);
      });
    if (allMatch) {
      knownBad.push({ type: "known-bad", packages: overlay.packages, reason: overlay.reason });
    }
  }

  return {
    installed: installedVersions,
    issues,
    knownBad,
    resolution: computePeerResolution(issues),
    ok: issues.length === 0 && knownBad.length === 0,
  };
}

/** 대상 패키지별로 위반 범위들의 "최대 하한"을 모아 `>=x.y.z` 형태로 돌려줘요. */
function computePeerResolution(issues: PackagePeerIssue[]): Record<string, string> {
  const highestMinByTarget = new Map<string, string>();

  for (const issue of issues) {
    const min = minVersion(issue.range);
    if (!min) continue;
    const current = highestMinByTarget.get(issue.requires);
    if (!current || gt(min.version, current)) {
      highestMinByTarget.set(issue.requires, min.version);
    }
  }

  return Object.fromEntries(
    Array.from(highestMinByTarget.entries()).map(([target, version]) => [target, `>=${version}`]),
  );
}

export function logPackagePeerReport({ report }: { report: PackagePeerReport }) {
  const installedLine = Object.entries(report.installed)
    .map(([pkg, version]) => `${pkg}@${highlight(version)}`)
    .join(", ");
  p.log.info(`설치된 버전: ${installedLine || "없음"}`);

  if (report.ok) {
    p.log.success("설치된 seed 패키지들이 서로 호환돼요.");
    return;
  }

  for (const issue of report.issues) {
    if (issue.type === "missing") {
      p.log.warn(
        `${issue.from} 는 ${issue.requires} ${issue.range} 를 요구하나 설치되어 있지 않아요.`,
      );
      continue;
    }
    p.log.warn(
      `${issue.from} 는 ${issue.requires} ${issue.range} 를 요구하나 ${issue.installed} 가 설치됐어요.`,
    );
  }

  for (const bad of report.knownBad) {
    const combo = Object.entries(bad.packages)
      .map(([pkg, range]) => `${pkg}@${range}`)
      .join(", ");
    p.log.warn(`알려진 비호환 조합이에요 (${combo}): ${bad.reason}`);
  }

  const resolutionEntries = Object.entries(report.resolution);
  if (resolutionEntries.length) {
    const suggestion = resolutionEntries
      .map(([target, range]) => `${target} ${highlight(range)}`)
      .join(", ");
    p.log.info(`→ ${suggestion} 로 올리면 모두 해결돼요.`);
  }
}

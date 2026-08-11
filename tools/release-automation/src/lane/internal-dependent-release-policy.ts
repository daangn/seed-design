import { compareSemver, parseSemver } from "../publish/publish";

export type ChangesetsReleaseType = "none" | "patch" | "minor" | "major";

export interface ChangesetsReleasePlan {
  changesets: Array<{
    id: string;
    releases: Array<{ name: string; type: Exclude<ChangesetsReleaseType, "none"> }>;
  }>;
  releases: Array<{
    name: string;
    type: ChangesetsReleaseType;
    oldVersion: string;
    newVersion: string;
    changesets: string[];
  }>;
}

export interface VersionPolicyPackage {
  path: string;
  value: Record<string, unknown>;
}

export interface VersionPolicyConfig {
  fixed: string[][];
  linked: string[][];
  changelog: boolean;
}

export interface InternalDependentReleasePolicyInput {
  releasePlan: ChangesetsReleasePlan;
  config: VersionPolicyConfig;
  basePackages: VersionPolicyPackage[];
  versionedPackages: VersionPolicyPackage[];
  versionedChangelogs: Record<string, string | null>;
}

export interface InternalDependentReleasePolicyOutput {
  packages: VersionPolicyPackage[];
  changelogs: Record<string, string>;
  versionOverrides: Record<string, string>;
}

const webPeerConsumers = new Set([
  "@seed-design/react",
  "@seed-design/stackflow",
  "@seed-design/tailwind3-plugin",
  "@seed-design/tailwind4-theme",
  "@seed-design/vite-plugin",
  "@seed-design/rsbuild-plugin",
  "@seed-design/webpack-plugin",
]);

const lynxZeroMajorPackages = new Set(["@seed-design/lynx-css", "@seed-design/lynx-react"]);

const releaseTypeRank: Record<ChangesetsReleaseType, number> = {
  none: 0,
  patch: 1,
  minor: 2,
  major: 3,
};

function asRecord(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label}이 객체가 아닙니다.`);
  }
  return value as Record<string, unknown>;
}

function parseReleaseType(value: unknown, allowNone: boolean): ChangesetsReleaseType {
  if (
    value !== "patch" &&
    value !== "minor" &&
    value !== "major" &&
    !(allowNone && value === "none")
  ) {
    throw new Error(`Changesets release type이 올바르지 않습니다: ${String(value)}`);
  }
  return value;
}

export function parseChangesetsReleasePlan(value: unknown): ChangesetsReleasePlan {
  const plan = asRecord(value, "Changesets release plan");
  if (!Array.isArray(plan.changesets) || !Array.isArray(plan.releases)) {
    throw new Error("Changesets release plan의 changesets/releases가 배열이 아닙니다.");
  }
  const changesets = plan.changesets.map((candidate, index) => {
    const changeset = asRecord(candidate, `Changesets changesets[${index}]`);
    if (
      typeof changeset.id !== "string" ||
      !/^[a-z0-9][a-z0-9-]*$/.test(changeset.id) ||
      !Array.isArray(changeset.releases) ||
      changeset.releases.length === 0
    ) {
      throw new Error(`Changesets changeset[${index}]가 올바르지 않습니다.`);
    }
    const releases = changeset.releases.map((candidateRelease, releaseIndex) => {
      const release = asRecord(
        candidateRelease,
        `Changesets changesets[${index}].releases[${releaseIndex}]`,
      );
      if (typeof release.name !== "string") {
        throw new Error(`Changesets changeset ${changeset.id}의 package name이 올바르지 않습니다.`);
      }
      const type = parseReleaseType(release.type, false);
      return {
        name: release.name,
        type: type as Exclude<ChangesetsReleaseType, "none">,
      };
    });
    return { id: changeset.id, releases };
  });
  if (new Set(changesets.map((changeset) => changeset.id)).size !== changesets.length) {
    throw new Error("Changesets changeset id가 중복됩니다.");
  }

  const releases = plan.releases.map((candidate, index) => {
    const release = asRecord(candidate, `Changesets releases[${index}]`);
    if (
      typeof release.name !== "string" ||
      typeof release.oldVersion !== "string" ||
      typeof release.newVersion !== "string" ||
      !Array.isArray(release.changesets) ||
      !release.changesets.every((id) => typeof id === "string") ||
      new Set(release.changesets).size !== release.changesets.length
    ) {
      throw new Error(`Changesets release[${index}]가 올바르지 않습니다.`);
    }
    parseSemver(release.oldVersion);
    parseSemver(release.newVersion);
    return {
      name: release.name,
      type: parseReleaseType(release.type, true),
      oldVersion: release.oldVersion,
      newVersion: release.newVersion,
      changesets: release.changesets as string[],
    };
  });
  if (new Set(releases.map((release) => release.name)).size !== releases.length) {
    throw new Error("Changesets release package가 중복됩니다.");
  }
  return { changesets, releases };
}

function packageIdentity(
  pkg: VersionPolicyPackage,
  label: string,
): { name: string; version: string } {
  if (typeof pkg.value.name !== "string" || typeof pkg.value.version !== "string") {
    throw new Error(`${label} ${pkg.path}의 name/version이 올바르지 않습니다.`);
  }
  return { name: pkg.value.name, version: pkg.value.version };
}

function packageMap(
  packages: VersionPolicyPackage[],
  label: string,
): Map<string, VersionPolicyPackage> {
  const result = new Map<string, VersionPolicyPackage>();
  for (const pkg of packages) {
    const { name } = packageIdentity(pkg, label);
    if (result.has(name)) throw new Error(`${label} package name이 중복됩니다: ${name}`);
    result.set(name, pkg);
  }
  return result;
}

function dependencyMap(value: Record<string, unknown>, field: string): Record<string, string> {
  const candidate = value[field];
  if (candidate === undefined) return {};
  if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
    throw new Error(`${field}가 문자열 map이 아닙니다.`);
  }
  const entries = Object.entries(candidate);
  if (!entries.every(([, range]) => typeof range === "string")) {
    throw new Error(`${field}가 문자열 map이 아닙니다.`);
  }
  return Object.fromEntries(entries) as Record<string, string>;
}

function highestReleaseType(
  current: Exclude<ChangesetsReleaseType, "none"> | null,
  candidate: Exclude<ChangesetsReleaseType, "none">,
): Exclude<ChangesetsReleaseType, "none"> {
  if (current === null || releaseTypeRank[candidate] > releaseTypeRank[current]) return candidate;
  return current;
}

function directReleaseType(
  releasePlan: ChangesetsReleasePlan,
  packageName: string,
  releaseChangesets: string[],
): Exclude<ChangesetsReleaseType, "none"> | null {
  const declared = new Map<string, Exclude<ChangesetsReleaseType, "none">>();
  for (const changeset of releasePlan.changesets) {
    const direct = changeset.releases.find((release) => release.name === packageName);
    if (direct) declared.set(changeset.id, direct.type);
  }
  const actualIds = [...new Set(releaseChangesets)].sort();
  const declaredIds = [...declared.keys()].sort();
  if (JSON.stringify(actualIds) !== JSON.stringify(declaredIds)) {
    throw new Error(`${packageName} direct Changeset provenance를 증명할 수 없습니다.`);
  }
  let result: Exclude<ChangesetsReleaseType, "none"> | null = null;
  for (const type of declared.values()) result = highestReleaseType(result, type);
  return result;
}

function isGrouped(config: VersionPolicyConfig, packageName: string): boolean {
  return [...config.fixed, ...config.linked].some((group) => group.includes(packageName));
}

function assertPeerMajorProvenance(
  packageName: string,
  basePackage: VersionPolicyPackage,
  releasePlan: ChangesetsReleasePlan,
  config: VersionPolicyConfig,
): void {
  if (isGrouped(config, packageName)) {
    throw new Error(
      `${packageName} major가 fixed/linked 전파와 결합되어 원인을 증명할 수 없습니다.`,
    );
  }
  const releases = new Map(releasePlan.releases.map((release) => [release.name, release]));
  const peerDependencies = dependencyMap(basePackage.value, "peerDependencies");
  const releasedPeers = Object.keys(peerDependencies).filter((name) => {
    const release = releases.get(name);
    return release && release.type !== "none" && release.type !== "patch";
  });
  if (releasedPeers.length === 0) {
    throw new Error(`${packageName} major가 internal peer 전파에서 왔음을 증명할 수 없습니다.`);
  }
}

function incrementCoreVersion(
  version: string,
  type: Exclude<ChangesetsReleaseType, "none">,
): string {
  const parsed = parseSemver(version);
  let { major, minor, patch } = parsed;
  if (type === "patch") {
    if (parsed.prerelease.length === 0) patch += 1;
  } else if (type === "minor") {
    if (parsed.prerelease.length === 0 || patch !== 0) {
      minor += 1;
      patch = 0;
    }
  } else if (parsed.prerelease.length === 0 || minor !== 0 || patch !== 0) {
    major += 1;
    minor = 0;
    patch = 0;
  }
  return `${major}.${minor}.${patch}`;
}

export function remapChangesetsVersion(
  oldVersion: string,
  upstreamVersion: string,
  type: Exclude<ChangesetsReleaseType, "none">,
): string {
  const core = incrementCoreVersion(oldVersion, type);
  const upstream = parseSemver(upstreamVersion);
  if (upstream.prerelease.length === 0) return core;
  if (
    upstream.prerelease.length !== 2 ||
    !/^[a-z][a-z0-9-]{0,31}$/.test(upstream.prerelease[0] ?? "") ||
    !/^(0|[1-9]\d*)$/.test(upstream.prerelease[1] ?? "")
  ) {
    throw new Error(
      `Changesets prerelease suffix가 exact tag.counter가 아닙니다: ${upstreamVersion}`,
    );
  }
  return `${core}-${upstream.prerelease.join(".")}`;
}

function canonicalDependencyRange(
  previousRange: string,
  targetVersion: string,
  field: "peerDependencies" | "devDependencies",
): string {
  if (/^(?:file:|link:|npm:|git(?:\+|:)|https?:)/.test(previousRange)) return previousRange;
  const workspacePrefix = previousRange.startsWith("workspace:") ? "workspace:" : "";
  const prerelease = parseSemver(targetVersion).prerelease.length > 0;
  const rangePrefix = field === "peerDependencies" && !prerelease ? "^" : "";
  return `${workspacePrefix}${rangePrefix}${targetVersion}`;
}

export function rewriteChangelogVersion(
  changelog: string,
  fromVersion: string,
  toVersion: string,
): string {
  const lines = changelog.split("\n");
  const heading = `## ${fromVersion}`;
  const matches = lines.flatMap((line, index) => (line === heading ? [index] : []));
  const firstVersionHeading = lines.findIndex((line) => line.startsWith("## "));
  if (matches.length !== 1 || matches[0] !== firstVersionHeading) {
    throw new Error(`CHANGELOG 최상단 ${heading} heading을 exact하게 식별할 수 없습니다.`);
  }
  lines[matches[0]!] = `## ${toVersion}`;
  return lines.join("\n");
}

export function applyInternalDependentReleasePolicy(
  input: InternalDependentReleasePolicyInput,
): InternalDependentReleasePolicyOutput {
  const basePackages = packageMap(input.basePackages, "base");
  const versionedPackages = packageMap(input.versionedPackages, "versioned");
  const releases = new Map(input.releasePlan.releases.map((release) => [release.name, release]));
  const desiredVersions = new Map<string, string>();

  for (const release of input.releasePlan.releases) {
    const basePackage = basePackages.get(release.name);
    const versionedPackage = versionedPackages.get(release.name);
    if (!basePackage || !versionedPackage) {
      throw new Error(`${release.name} release package manifest가 없습니다.`);
    }
    const baseIdentity = packageIdentity(basePackage, "base");
    const versionedIdentity = packageIdentity(versionedPackage, "versioned");
    if (
      baseIdentity.version !== release.oldVersion ||
      versionedIdentity.version !== release.newVersion
    ) {
      throw new Error(`${release.name} manifest version이 Changesets release plan과 다릅니다.`);
    }

    let desiredVersion = release.newVersion;
    if (release.type === "major" && webPeerConsumers.has(release.name)) {
      const directType = directReleaseType(input.releasePlan, release.name, release.changesets);
      if (directType !== "major") {
        assertPeerMajorProvenance(release.name, basePackage, input.releasePlan, input.config);
        desiredVersion = remapChangesetsVersion(
          release.oldVersion,
          release.newVersion,
          directType ?? "patch",
        );
      }
    }
    if (release.type === "major" && lynxZeroMajorPackages.has(release.name)) {
      const directType = directReleaseType(input.releasePlan, release.name, release.changesets);
      if (directType === "major") {
        throw new Error(
          `${release.name}의 explicit major Changeset은 Lynx 0.x 정책에서 허용되지 않습니다.`,
        );
      }
      assertPeerMajorProvenance(release.name, basePackage, input.releasePlan, input.config);
      desiredVersion = remapChangesetsVersion(release.oldVersion, release.newVersion, "minor");
      if (parseSemver(desiredVersion).major !== 0) {
        throw new Error(`${release.name}의 Lynx 0.x version 정책을 유지할 수 없습니다.`);
      }
    }
    if (release.type !== "none" && compareSemver(desiredVersion, release.oldVersion) <= 0) {
      throw new Error(`${release.name} policy version이 단조 증가하지 않습니다.`);
    }
    desiredVersions.set(release.name, desiredVersion);
  }

  const outputPackages = input.versionedPackages.map((pkg) => ({
    path: pkg.path,
    value: structuredClone(pkg.value),
  }));
  const outputPackageMap = packageMap(outputPackages, "policy output");
  const versionOverrides: Record<string, string> = {};
  const changelogs: Record<string, string> = {};

  for (const [name, desiredVersion] of desiredVersions) {
    const release = releases.get(name)!;
    const pkg = outputPackageMap.get(name)!;
    if (desiredVersion === release.newVersion) continue;
    pkg.value.version = desiredVersion;
    versionOverrides[name] = desiredVersion;
    const changelogPath = pkg.path.replace(/package\.json$/, "CHANGELOG.md");
    const changelog = input.versionedChangelogs[changelogPath];
    if (input.config.changelog && (changelog === undefined || changelog === null)) {
      throw new Error(`${name} version override에 필요한 CHANGELOG가 없습니다.`);
    }
    if (changelog !== undefined && changelog !== null) {
      changelogs[changelogPath] = rewriteChangelogVersion(
        changelog,
        release.newVersion,
        desiredVersion,
      );
    }
  }

  for (const [ownerName, basePackage] of basePackages) {
    const outputPackage = outputPackageMap.get(ownerName);
    if (!outputPackage) throw new Error(`${ownerName} versioned package manifest가 없습니다.`);
    for (const field of ["peerDependencies", "devDependencies"] as const) {
      const baseDependencies = dependencyMap(basePackage.value, field);
      if (Object.keys(baseDependencies).length === 0) continue;
      const outputDependencies = dependencyMap(outputPackage.value, field);
      let changed = false;
      for (const [targetName, previousRange] of Object.entries(baseDependencies)) {
        const release = releases.get(targetName);
        const targetVersion = desiredVersions.get(targetName);
        if (!release || !targetVersion || targetVersion === release.oldVersion) continue;
        if (outputDependencies[targetName] === undefined) {
          throw new Error(
            `${ownerName}의 ${field}.${targetName} edge가 version output에서 사라졌습니다.`,
          );
        }
        const expectedRange = canonicalDependencyRange(previousRange, targetVersion, field);
        if (outputDependencies[targetName] !== expectedRange) {
          outputDependencies[targetName] = expectedRange;
          changed = true;
        }
      }
      if (changed) outputPackage.value[field] = outputDependencies;
    }
  }

  return {
    packages: outputPackages,
    changelogs,
    versionOverrides,
  };
}

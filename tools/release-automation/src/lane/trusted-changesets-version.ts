import { lstat, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import {
  applyInternalDependentReleasePolicy,
  type ChangesetsReleasePlan,
  parseChangesetsReleasePlan,
  type VersionPolicyConfig,
  type VersionPolicyPackage,
} from "./internal-dependent-release-policy";

export interface CapturedChangesetsVersionPolicy {
  releasePlan: ChangesetsReleasePlan;
  config: VersionPolicyConfig;
  basePackages: VersionPolicyPackage[];
}

function asRecord(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label}이 객체가 아닙니다.`);
  }
  return value as Record<string, unknown>;
}

function parsePackageGroups(value: unknown, label: string): string[][] {
  if (value === undefined) return [];
  if (
    !Array.isArray(value) ||
    !value.every(
      (group) =>
        Array.isArray(group) &&
        group.length > 0 &&
        group.every((packageName) => typeof packageName === "string"),
    )
  ) {
    throw new Error(`${label}이 package name 배열의 배열이 아닙니다.`);
  }
  return value as string[][];
}

function credentialFreeEnvironment(): Record<string, string | undefined> {
  return {
    ...process.env,
    CI: "true",
    BUN_CONFIG: undefined,
    BUN_OPTIONS: undefined,
    GH_TOKEN: undefined,
    GITHUB_TOKEN: undefined,
    NODE_AUTH_TOKEN: undefined,
    NODE_OPTIONS: undefined,
    NODE_PATH: undefined,
    NPM_TOKEN: undefined,
  };
}

async function runNode(
  repositoryPath: string,
  cliPath: string,
  arguments_: string[],
): Promise<void> {
  const cliStat = await lstat(cliPath).catch(() => null);
  if (!cliStat?.isFile()) {
    throw new Error(
      "trusted Changesets CLI가 없습니다. trusted dependencies를 먼저 설치해야 합니다.",
    );
  }
  const child = Bun.spawn(["node", cliPath, ...arguments_], {
    cwd: repositoryPath,
    env: credentialFreeEnvironment(),
    stdout: "pipe",
    stderr: "pipe",
  });
  const [stdout, stderr, code] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]);
  if (code !== 0) {
    throw new Error(
      `trusted Changesets ${arguments_.join(" ")}가 실패했습니다 (${code}):\n${stderr.trim() || stdout.trim()}`,
    );
  }
}

export async function runChangesetsVersion(repositoryPath: string, cliPath: string): Promise<void> {
  await runNode(repositoryPath, cliPath, ["version"]);
}

export async function readChangesetsReleasePlan(
  repositoryPath: string,
  cliPath: string,
): Promise<ChangesetsReleasePlan> {
  const outputDirectory = await mkdtemp(join(tmpdir(), "seed-release-changesets-status-"));
  const outputPath = join(outputDirectory, "release-plan.json");
  try {
    await runNode(repositoryPath, cliPath, [
      "status",
      `--output=${relative(repositoryPath, outputPath)}`,
    ]);
    return parseChangesetsReleasePlan(JSON.parse(await readFile(outputPath, "utf8")));
  } finally {
    await rm(outputDirectory, { recursive: true, force: true });
  }
}

async function trackedPackageJsonPaths(repositoryPath: string): Promise<string[]> {
  const child = Bun.spawn(["git", "ls-files", "package.json", ":(glob)**/package.json"], {
    cwd: repositoryPath,
    env: credentialFreeEnvironment(),
    stdout: "pipe",
    stderr: "pipe",
  });
  const [stdout, stderr, code] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]);
  if (code !== 0) throw new Error(`package manifest 목록을 읽지 못했습니다:\n${stderr.trim()}`);
  return stdout
    .trim()
    .split("\n")
    .filter(
      (path) => path.length > 0 && (path === "package.json" || path.endsWith("/package.json")),
    )
    .sort();
}

export async function readVersionPolicyPackages(
  repositoryPath: string,
): Promise<VersionPolicyPackage[]> {
  const paths = await trackedPackageJsonPaths(repositoryPath);
  const packages: VersionPolicyPackage[] = [];
  for (const path of paths) {
    const value = asRecord(JSON.parse(await readFile(join(repositoryPath, path), "utf8")), path);
    if (typeof value.name !== "string" || typeof value.version !== "string") continue;
    packages.push({ path, value });
  }
  return packages;
}

async function readVersionPolicyConfig(repositoryPath: string): Promise<VersionPolicyConfig> {
  const config = asRecord(
    JSON.parse(await readFile(join(repositoryPath, ".changeset/config.json"), "utf8")),
    "Changesets config",
  );
  return {
    fixed: parsePackageGroups(config.fixed, "Changesets fixed"),
    linked: parsePackageGroups(config.linked, "Changesets linked"),
    changelog: config.changelog !== undefined && config.changelog !== false,
  };
}

async function readChangelogs(
  repositoryPath: string,
  packages: VersionPolicyPackage[],
): Promise<Record<string, string | null>> {
  const result: Record<string, string | null> = {};
  for (const pkg of packages) {
    const path = join(dirname(pkg.path), "CHANGELOG.md");
    result[path] = await readFile(join(repositoryPath, path), "utf8").catch(() => null);
  }
  return result;
}

export async function captureChangesetsVersionPolicy(
  repositoryPath: string,
  cliPath: string,
  statusBaseBranch?: string,
): Promise<CapturedChangesetsVersionPolicy> {
  const configPath = join(repositoryPath, ".changeset/config.json");
  const originalConfig = statusBaseBranch ? await readFile(configPath, "utf8") : null;
  try {
    if (originalConfig !== null) {
      const statusConfig = asRecord(JSON.parse(originalConfig), "Changesets status config");
      statusConfig.baseBranch = statusBaseBranch;
      await writeFile(configPath, `${JSON.stringify(statusConfig, null, 2)}\n`);
    }
    const [releasePlan, config, basePackages] = await Promise.all([
      readChangesetsReleasePlan(repositoryPath, cliPath),
      readVersionPolicyConfig(repositoryPath),
      readVersionPolicyPackages(repositoryPath),
    ]);
    return { releasePlan, config, basePackages };
  } finally {
    if (originalConfig !== null) await writeFile(configPath, originalConfig);
  }
}

export async function applyCapturedChangesetsVersionPolicy(
  repositoryPath: string,
  captured: CapturedChangesetsVersionPolicy,
): Promise<Record<string, string>> {
  const versionedPackages = await readVersionPolicyPackages(repositoryPath);
  const output = applyInternalDependentReleasePolicy({
    releasePlan: captured.releasePlan,
    config: captured.config,
    basePackages: captured.basePackages,
    versionedPackages,
    versionedChangelogs: await readChangelogs(repositoryPath, versionedPackages),
  });
  const currentByPath = new Map(versionedPackages.map((pkg) => [pkg.path, pkg.value]));
  for (const pkg of output.packages) {
    if (JSON.stringify(currentByPath.get(pkg.path)) === JSON.stringify(pkg.value)) continue;
    await writeFile(join(repositoryPath, pkg.path), `${JSON.stringify(pkg.value, null, 2)}\n`);
  }
  for (const [path, changelog] of Object.entries(output.changelogs)) {
    await writeFile(join(repositoryPath, path), changelog);
  }
  return output.versionOverrides;
}

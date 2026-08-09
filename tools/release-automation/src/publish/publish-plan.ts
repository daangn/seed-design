import { appendFile } from "node:fs/promises";
import { dirname } from "node:path";
import { assertStableVersionsAdvance, parseSemver } from "./publish";
import { isLaneName, parseLaneConfig } from "../core/config";
import { parseAuthorizedPackageManifestPaths } from "./publish-state";
import type { LaneName } from "../core/types";

interface PackageManifest {
  name?: string;
  version?: string;
  private?: boolean;
}

interface RegistryDocument {
  versions?: Record<string, unknown>;
  "dist-tags"?: Record<string, string>;
}

const gitShaPattern = /^[0-9a-f]{40}$/;

interface PublishPreState {
  mode: "pre";
  tag: string;
}

function validatePrereleaseTag(tag: string, protectedTags: string[]): string {
  const normalized = tag.trim().toLowerCase();
  if (!/^[a-z][a-z0-9-]{0,31}$/.test(normalized)) {
    throw new Error(
      "pre-release tag는 영문 소문자로 시작하는 1~32자의 영문·숫자·하이픈이어야 합니다.",
    );
  }
  if (protectedTags.includes(normalized)) {
    throw new Error(`'${normalized}'은 stable용으로 보호된 dist-tag입니다.`);
  }
  return normalized;
}

export function assertPublishLanePackageContract(
  lane: LaneName,
  packages: Array<{ name: string; version: string }>,
): void {
  const stable = packages.filter((item) => parseSemver(item.version).prerelease.length === 0);
  const prerelease = packages.filter((item) => parseSemver(item.version).prerelease.length > 0);
  if (lane === "dev" && prerelease.length > 0) {
    throw new Error(
      `dev에서 pre-release package를 게시할 수 없습니다: ${prerelease.map((item) => item.name).join(", ")}`,
    );
  }
  if (lane !== "dev" && stable.length > 0) {
    throw new Error(
      `${lane} pre-release 레인에서 stable package를 게시할 수 없습니다: ${stable.map((item) => item.name).join(", ")}`,
    );
  }
}

async function run(command: string[], cwd = process.cwd()): Promise<string> {
  const child = Bun.spawn(command, { cwd, stdout: "pipe", stderr: "pipe" });
  const stdout = await new Response(child.stdout).text();
  const stderr = await new Response(child.stderr).text();
  const exitCode = await child.exited;
  if (exitCode !== 0) throw new Error(`${command.join(" ")} 실패:\n${stderr}`);
  return stdout.trim();
}

async function registryDocument(name: string): Promise<RegistryDocument | null> {
  const response = await fetch(`https://registry.npmjs.org/${encodeURIComponent(name)}`, {
    headers: { accept: "application/json" },
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`${name} registry 조회 실패: ${response.status}`);
  return (await response.json()) as RegistryDocument;
}

export async function packagesFromAuthorizedPullFiles(
  paths: string[],
  mergeSha: string,
  repositoryPath = process.cwd(),
): Promise<Array<{ name: string; version: string; path: string }>> {
  if (!gitShaPattern.test(mergeSha)) throw new Error("승인 merge SHA가 올바르지 않습니다.");
  const head = await run(["git", "rev-parse", "HEAD"], repositoryPath);
  if (head !== mergeSha) {
    throw new Error(`checkout ${head}이 승인 merge SHA ${mergeSha}와 다릅니다.`);
  }
  const packages = await Promise.all(
    paths.map(async (path) => {
      const manifest = JSON.parse(
        await run(["git", "show", `${mergeSha}:${path}`], repositoryPath),
      ) as PackageManifest;
      if (manifest.private || !manifest.name || !manifest.version) return null;
      return { name: manifest.name, version: manifest.version, path: dirname(path) };
    }),
  );
  const result = packages.filter((item): item is NonNullable<typeof item> => item !== null);
  if (result.length === 0) {
    throw new Error("승인된 Version PR에 게시 가능한 package manifest가 없습니다.");
  }
  const names = new Set<string>();
  for (const item of result) {
    if (names.has(item.name))
      throw new Error(`승인된 PR에 package 이름이 중복됩니다: ${item.name}`);
    names.add(item.name);
  }
  return result;
}

export function resolvePublishDistTag(
  packages: Array<{ name: string; version: string }>,
  preState: PublishPreState | null,
  protectedTags: string[],
): string {
  const stable = packages.filter((item) => parseSemver(item.version).prerelease.length === 0);
  const prerelease = packages.filter((item) => parseSemver(item.version).prerelease.length > 0);
  if (stable.length > 0 && prerelease.length > 0) {
    throw new Error("한 Version Packages PR에서 stable과 pre-release를 함께 게시할 수 없습니다.");
  }
  if (stable.length > 0) {
    if (preState) throw new Error("stable package를 Changesets pre mode에서 게시할 수 없습니다.");
    return "latest";
  }
  if (!preState || preState.mode !== "pre") {
    throw new Error("pre-release package의 exact Changesets pre state가 없습니다.");
  }
  const tag = validatePrereleaseTag(preState.tag, protectedTags);
  const mismatched = prerelease.filter((item) => parseSemver(item.version).prerelease[0] !== tag);
  if (mismatched.length > 0) {
    throw new Error(
      `pre-release version과 dist-tag가 다릅니다: ${mismatched
        .map((item) => `${item.name}@${item.version}`)
        .join(", ")}`,
    );
  }
  return tag;
}

async function main(): Promise<void> {
  const lane = Bun.argv[2] ?? "";
  if (!isLaneName(lane)) throw new Error(`지원하지 않는 릴리즈 레인입니다: ${lane}`);
  const mergeSha = process.env.PUBLISH_MERGE_SHA ?? "";
  const repositoryPath = process.env.PUBLISH_REPOSITORY_PATH ?? process.cwd();
  const packagePaths = parseAuthorizedPackageManifestPaths(process.env.PUBLISH_PACKAGE_PATHS ?? "");

  const packages = await packagesFromAuthorizedPullFiles(packagePaths, mergeSha, repositoryPath);
  assertPublishLanePackageContract(lane, packages);
  const registryEntries = await Promise.all(
    packages.map(async (item) => [item.name, await registryDocument(item.name)] as const),
  );
  const registry = Object.fromEntries(registryEntries);
  const missing = packages.filter((item) => !registry[item.name]?.versions?.[item.version]);
  const stable = packages.filter((item) => parseSemver(item.version).prerelease.length === 0);

  const laneConfig = parseLaneConfig(
    JSON.parse(await run(["git", "show", "origin/dev:.github/release/lanes.json"], repositoryPath)),
  );
  const preStateText = await run(
    ["git", "show", `${mergeSha}:.changeset/pre.json`],
    repositoryPath,
  ).catch(() => "");
  const preState = preStateText ? (JSON.parse(preStateText) as PublishPreState) : null;
  const distTag = resolvePublishDistTag(packages, preState, laneConfig.protectedDistTags);
  if (stable.length > 0) {
    const stableMissing = stable.filter((item) => !registry[item.name]?.versions?.[item.version]);
    assertStableVersionsAdvance(
      Object.fromEntries(stableMissing.map((item) => [item.name, item.version])),
      Object.fromEntries(
        stableMissing.map((item) => [
          item.name,
          registry[item.name]?.["dist-tags"]?.latest ?? null,
        ]),
      ),
    );
  }

  const rootage = packages.find((item) => item.name === "@seed-design/rootage-artifacts");
  const result = {
    lane,
    stable: stable.length > 0,
    distTag,
    packages,
    missing,
    rootageVersion: rootage?.version ?? "",
  };
  console.log(JSON.stringify(result, null, 2));

  const outputPath = process.env.GITHUB_OUTPUT;
  if (outputPath) {
    await appendFile(
      outputPath,
      `${[
        `stable=${result.stable}`,
        `distTag=${result.distTag}`,
        `missingCount=${missing.length}`,
        `rootageVersion=${result.rootageVersion}`,
        `packages=${JSON.stringify(packages)}`,
      ].join("\n")}\n`,
    );
  }

  const summaryPath = process.env.GITHUB_STEP_SUMMARY;
  if (summaryPath) {
    await appendFile(
      summaryPath,
      [
        "## 게시 계획",
        "",
        `- 레인: \`${lane}\``,
        `- 유형: ${result.stable ? "stable" : "pre-release"}`,
        `- npm dist-tag: \`${result.distTag}\``,
        `- 대상 package: ${packages.length}개`,
        `- 아직 게시되지 않은 package: ${missing.length}개`,
        `- Rootage: ${result.rootageVersion || "변경 없음"}`,
        "",
        ...packages.map((item) => `- \`${item.name}@${item.version}\``),
        "",
      ].join("\n"),
    );
  }
}

if (import.meta.main) await main();

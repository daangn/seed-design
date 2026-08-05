import { appendFile, readFile } from "node:fs/promises";
import { dirname } from "node:path";
import { assertStableVersionsAdvance, parseSemver } from "./publish";
import { isLaneName, parseReleaseControl } from "./config";

interface PackageManifest {
  name?: string;
  version?: string;
  private?: boolean;
}

interface RegistryDocument {
  versions?: Record<string, unknown>;
  "dist-tags"?: Record<string, string>;
}

async function run(command: string[]): Promise<string> {
  const child = Bun.spawn(command, { stdout: "pipe", stderr: "pipe" });
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

async function changedPackages(): Promise<Array<{ name: string; version: string; path: string }>> {
  const parent = await run(["git", "rev-parse", "HEAD^"]);
  const output = await run(["git", "diff", "--name-only", parent, "HEAD", "--", "**/package.json"]);
  const paths = output ? output.split("\n") : [];
  const packages = await Promise.all(
    paths.map(async (path) => {
      const manifest = JSON.parse(await readFile(path, "utf8")) as PackageManifest;
      if (manifest.private || !manifest.name || !manifest.version) return null;
      return { name: manifest.name, version: manifest.version, path: dirname(path) };
    }),
  );
  return packages.filter((item): item is NonNullable<typeof item> => item !== null);
}

const lane = Bun.argv[2] ?? "";
if (!isLaneName(lane)) throw new Error(`지원하지 않는 릴리즈 레인입니다: ${lane}`);

const packages = await changedPackages();
const registryEntries = await Promise.all(
  packages.map(async (item) => [item.name, await registryDocument(item.name)] as const),
);
const registry = Object.fromEntries(registryEntries);
const missing = packages.filter((item) => !registry[item.name]?.versions?.[item.version]);
const stable = packages.filter((item) => parseSemver(item.version).prerelease.length === 0);
const prerelease = packages.filter((item) => parseSemver(item.version).prerelease.length > 0);

if (lane === "dev" && prerelease.length > 0) {
  throw new Error(
    `dev에서 pre-release package를 게시할 수 없습니다: ${prerelease.map((item) => item.name).join(", ")}`,
  );
}
if (stable.length > 0 && prerelease.length > 0) {
  throw new Error("한 Version Packages PR에서 stable과 pre-release를 함께 게시할 수 없습니다.");
}
const control = parseReleaseControl(
  JSON.parse(await run(["git", "show", "origin/dev:.github/release/control.json"])),
);
if (
  control.freeze?.frozenLanes.includes(lane as Exclude<typeof lane, "dev">) &&
  prerelease.length > 0
) {
  throw new Error(`${lane} 레인은 stable 승격 중이므로 pre-release publish를 할 수 없습니다.`);
}
if (
  control.freeze &&
  stable.length > 0 &&
  lane !== "dev" &&
  control.freeze.promotionLane !== lane
) {
  throw new Error(
    `${control.freeze.promotionLane} 승격 중에는 ${lane} stable을 게시할 수 없습니다.`,
  );
}
if (stable.length > 0) {
  const stableMissing = stable.filter((item) => !registry[item.name]?.versions?.[item.version]);
  assertStableVersionsAdvance(
    Object.fromEntries(stableMissing.map((item) => [item.name, item.version])),
    Object.fromEntries(
      stableMissing.map((item) => [item.name, registry[item.name]?.["dist-tags"]?.latest ?? null]),
    ),
  );
}

const rootage = packages.find((item) => item.name === "@seed-design/rootage-artifacts");
const result = {
  lane,
  stable: stable.length > 0,
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
      `- 대상 package: ${packages.length}개`,
      `- 아직 게시되지 않은 package: ${missing.length}개`,
      `- Rootage: ${result.rootageVersion || "변경 없음"}`,
      "",
      ...packages.map((item) => `- \`${item.name}@${item.version}\``),
      "",
    ].join("\n"),
  );
}

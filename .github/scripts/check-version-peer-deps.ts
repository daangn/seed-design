import { appendFile } from "node:fs/promises";
import { resolve } from "node:path";
import { parseArgs } from "node:util";
import { compareStableVersions, parseStableVersion } from "./bump-peer-deps";

const CSS_PACKAGE = "@seed-design/css";
const CSS_MANIFEST_PATH = "packages/css/package.json";
const REACT_MANIFEST_PATH = "packages/react/package.json";
const LYNX_CSS_PACKAGE = "@seed-design/lynx-css";
const LYNX_CSS_MANIFEST_PATH = "packages/lynx-css/package.json";
const LYNX_REACT_PACKAGE = "@seed-design/lynx-react";
const LYNX_REACT_MANIFEST_PATH = "packages/lynx-react/package.json";
const SHA_PATTERN = /^[0-9a-f]{40}$/;
const STATUS_DESCRIPTION_MAX_LENGTH = 140;

type JsonRecord = Record<string, unknown>;

interface PairValidationResult {
  checked: boolean;
  dependencyVersion: string;
  dependentVersion: string;
}

interface ValidationResult {
  react: PairValidationResult;
  lynxReact: PairValidationResult;
}

interface CliInput {
  root: string;
  baseSha: string;
  sourceSha: string;
}

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readManifest(text: string, path: string): JsonRecord {
  const value: unknown = JSON.parse(text);

  if (!isRecord(value)) {
    throw new Error(`${path}가 JSON 객체가 아닙니다.`);
  }

  return value;
}

function readVersion(manifest: JsonRecord, path: string): string {
  const version = manifest.version;

  if (typeof version !== "string") {
    throw new Error(`${path}에 문자열 version이 없습니다.`);
  }

  return version;
}

function readPeerRange(manifest: JsonRecord, path: string, dependencyName: string): string {
  if (!isRecord(manifest.peerDependencies)) {
    throw new Error(`${path}에 peerDependencies가 없습니다.`);
  }

  const range = manifest.peerDependencies[dependencyName];

  if (typeof range !== "string") {
    throw new Error(`${path}에 ${dependencyName} peerDependency가 없습니다.`);
  }

  return range;
}

function didBothVersionsChange(input: {
  baseDependencyVersion: string;
  baseDependentVersion: string;
  dependencyVersion: string;
  dependentVersion: string;
}): boolean {
  return (
    input.baseDependencyVersion !== input.dependencyVersion &&
    input.baseDependentVersion !== input.dependentVersion
  );
}

function assertVersionIncreased(input: {
  baseVersion: string;
  packageName: string;
  version: string;
}): void {
  if (compareStableVersions(input.version, input.baseVersion) <= 0) {
    throw new Error(
      `${input.packageName} 버전이 올라가지 않았습니다: ${input.baseVersion} -> ${input.version}`,
    );
  }
}

function assertPeerRange(input: {
  baseRange: string;
  dependencyName: string;
  dependentManifestPath: string;
  desiredRange: string;
  sourceRange: string;
}): void {
  if (input.sourceRange === input.baseRange && input.sourceRange !== input.desiredRange) {
    throw new Error(
      `${input.dependentManifestPath}의 ${input.dependencyName} peerDependency가 변경되지 않았습니다. 최신 Version Packages PR에서 /bump-peer-deps를 다시 실행해 주세요.`,
    );
  }

  if (input.sourceRange !== input.desiredRange) {
    throw new Error(
      `${input.dependentManifestPath}의 ${input.dependencyName} peerDependency가 새 버전과 다릅니다: ${input.sourceRange} (예상: ${input.desiredRange})`,
    );
  }
}

function validatePair(input: {
  baseDependencyManifest: string;
  baseDependentManifest: string;
  dependencyManifestPath: string;
  dependencyName: string;
  dependentManifestPath: string;
  dependentName: string;
  desiredRange: (dependencyVersion: string) => string;
  sourceDependencyManifest: string;
  sourceDependentManifest: string;
}): PairValidationResult {
  const baseDependency = readManifest(
    input.baseDependencyManifest,
    `base:${input.dependencyManifestPath}`,
  );
  const baseDependent = readManifest(
    input.baseDependentManifest,
    `base:${input.dependentManifestPath}`,
  );
  const sourceDependency = readManifest(
    input.sourceDependencyManifest,
    input.dependencyManifestPath,
  );
  const sourceDependent = readManifest(input.sourceDependentManifest, input.dependentManifestPath);
  const baseDependencyVersion = readVersion(baseDependency, `base:${input.dependencyManifestPath}`);
  const baseDependentVersion = readVersion(baseDependent, `base:${input.dependentManifestPath}`);
  const dependencyVersion = readVersion(sourceDependency, input.dependencyManifestPath);
  const dependentVersion = readVersion(sourceDependent, input.dependentManifestPath);
  if (
    !didBothVersionsChange({
      baseDependencyVersion,
      baseDependentVersion,
      dependencyVersion,
      dependentVersion,
    })
  ) {
    return { checked: false, dependencyVersion, dependentVersion };
  }

  assertVersionIncreased({
    baseVersion: baseDependencyVersion,
    packageName: input.dependencyName,
    version: dependencyVersion,
  });
  assertVersionIncreased({
    baseVersion: baseDependentVersion,
    packageName: input.dependentName,
    version: dependentVersion,
  });

  const basePeerRange = readPeerRange(
    baseDependent,
    `base:${input.dependentManifestPath}`,
    input.dependencyName,
  );
  const sourcePeerRange = readPeerRange(
    sourceDependent,
    input.dependentManifestPath,
    input.dependencyName,
  );
  const desiredPeerRange = input.desiredRange(dependencyVersion);

  assertPeerRange({
    baseRange: basePeerRange,
    dependencyName: input.dependencyName,
    dependentManifestPath: input.dependentManifestPath,
    desiredRange: desiredPeerRange,
    sourceRange: sourcePeerRange,
  });

  return { checked: true, dependencyVersion, dependentVersion };
}

function createLynxCssPeerRange(version: string): string {
  const [major, minor] = parseStableVersion(version);

  if (major !== 0) {
    throw new Error(`${LYNX_CSS_PACKAGE} 버전의 major가 0이 아닙니다: ${version}`);
  }

  return `0.0.0 || >=0.${minor}.0 <1.0.0`;
}

export function validateVersionPeerDependencies(input: {
  baseCssManifest: string;
  baseLynxCssManifest: string;
  baseLynxReactManifest: string;
  baseReactManifest: string;
  sourceCssManifest: string;
  sourceLynxCssManifest: string;
  sourceLynxReactManifest: string;
  sourceReactManifest: string;
}): ValidationResult {
  return {
    react: validatePair({
      baseDependencyManifest: input.baseCssManifest,
      baseDependentManifest: input.baseReactManifest,
      dependencyManifestPath: CSS_MANIFEST_PATH,
      dependencyName: CSS_PACKAGE,
      dependentManifestPath: REACT_MANIFEST_PATH,
      dependentName: "@seed-design/react",
      desiredRange: (version) => `^${version}`,
      sourceDependencyManifest: input.sourceCssManifest,
      sourceDependentManifest: input.sourceReactManifest,
    }),
    lynxReact: validatePair({
      baseDependencyManifest: input.baseLynxCssManifest,
      baseDependentManifest: input.baseLynxReactManifest,
      dependencyManifestPath: LYNX_CSS_MANIFEST_PATH,
      dependencyName: LYNX_CSS_PACKAGE,
      dependentManifestPath: LYNX_REACT_MANIFEST_PATH,
      dependentName: LYNX_REACT_PACKAGE,
      desiredRange: createLynxCssPeerRange,
      sourceDependencyManifest: input.sourceLynxCssManifest,
      sourceDependentManifest: input.sourceLynxReactManifest,
    }),
  };
}

async function runGit(root: string, args: string[]): Promise<string> {
  const process = Bun.spawn(["git", "-C", root, ...args], {
    stdout: "pipe",
    stderr: "pipe",
  });
  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(process.stdout).text(),
    new Response(process.stderr).text(),
    process.exited,
  ]);

  if (exitCode !== 0) {
    throw new Error(`git ${args.join(" ")} 실패: ${stderr.trim()}`);
  }

  return stdout;
}

function requireOption(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`${name}이 필요합니다.`);
  }

  return value;
}

function assertSha(value: string, name: string): void {
  if (!SHA_PATTERN.test(value)) {
    throw new Error(`${name} SHA 형식이 올바르지 않습니다.`);
  }
}

function readCliInput(): CliInput {
  const { values } = parseArgs({
    options: {
      root: { type: "string" },
      "base-sha": { type: "string" },
      "source-sha": { type: "string" },
    },
    strict: true,
  });
  const root = resolve(requireOption(values.root, "--root"));
  const baseSha = requireOption(values["base-sha"], "--base-sha");
  const sourceSha = requireOption(values["source-sha"], "--source-sha");

  assertSha(baseSha, "base");
  assertSha(sourceSha, "source");

  return { root, baseSha, sourceSha };
}

async function assertCheckedOutSource(root: string, sourceSha: string): Promise<void> {
  const checkedOutSha = (await runGit(root, ["rev-parse", "HEAD"])).trim();
  if (checkedOutSha !== sourceSha) {
    throw new Error(`체크아웃한 SHA가 PR head와 다릅니다: ${checkedOutSha}`);
  }
}

async function findMergeBase(root: string, baseSha: string, sourceSha: string): Promise<string> {
  const mergeBaseSha = (await runGit(root, ["merge-base", baseSha, sourceSha])).trim();
  if (!SHA_PATTERN.test(mergeBaseSha)) {
    throw new Error("PR base와 head의 공통 조상을 찾지 못했습니다.");
  }

  return mergeBaseSha;
}

async function loadValidationInput(
  root: string,
  mergeBaseSha: string,
): Promise<Parameters<typeof validateVersionPeerDependencies>[0]> {
  return {
    baseCssManifest: await runGit(root, ["show", `${mergeBaseSha}:${CSS_MANIFEST_PATH}`]),
    baseLynxCssManifest: await runGit(root, ["show", `${mergeBaseSha}:${LYNX_CSS_MANIFEST_PATH}`]),
    baseLynxReactManifest: await runGit(root, [
      "show",
      `${mergeBaseSha}:${LYNX_REACT_MANIFEST_PATH}`,
    ]),
    baseReactManifest: await runGit(root, ["show", `${mergeBaseSha}:${REACT_MANIFEST_PATH}`]),
    sourceCssManifest: await Bun.file(resolve(root, CSS_MANIFEST_PATH)).text(),
    sourceLynxCssManifest: await Bun.file(resolve(root, LYNX_CSS_MANIFEST_PATH)).text(),
    sourceLynxReactManifest: await Bun.file(resolve(root, LYNX_REACT_MANIFEST_PATH)).text(),
    sourceReactManifest: await Bun.file(resolve(root, REACT_MANIFEST_PATH)).text(),
  };
}

function reportPair(input: {
  result: PairValidationResult;
  successMessage: (result: PairValidationResult) => string;
  skippedMessage: string;
}): void {
  if (input.result.checked) {
    console.log(input.successMessage(input.result));
    return;
  }

  console.log(input.skippedMessage);
}

function reportValidation(result: ValidationResult): void {
  reportPair({
    result: result.react,
    successMessage: (react) =>
      `React ${react.dependentVersion}의 CSS peerDependency가 CSS ${react.dependencyVersion}과 일치합니다.`,
    skippedMessage: "CSS와 React 버전이 함께 바뀐 PR이 아니므로 검사를 건너뜁니다.",
  });
  reportPair({
    result: result.lynxReact,
    successMessage: (lynxReact) =>
      `Lynx React ${lynxReact.dependentVersion}의 Lynx CSS peerDependency가 Lynx CSS ${lynxReact.dependencyVersion}과 일치합니다.`,
    skippedMessage: "Lynx CSS와 Lynx React 버전이 함께 바뀐 PR이 아니므로 검사를 건너뜁니다.",
  });
}

async function main(): Promise<void> {
  const { root, baseSha, sourceSha } = readCliInput();
  await assertCheckedOutSource(root, sourceSha);
  const mergeBaseSha = await findMergeBase(root, baseSha, sourceSha);
  const result = validateVersionPeerDependencies(await loadValidationInput(root, mergeBaseSha));

  reportValidation(result);
}

export function formatStatusDescription(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);

  return message.replaceAll(/\s+/g, " ").trim().slice(0, STATUS_DESCRIPTION_MAX_LENGTH);
}

async function reportFailure(error: unknown): Promise<void> {
  const description = formatStatusDescription(error);
  const githubOutput = process.env.GITHUB_OUTPUT;

  console.error(description);
  if (githubOutput) {
    await appendFile(githubOutput, `error_message=${description}\n`);
  }
  process.exitCode = 1;
}

if (import.meta.main) {
  try {
    await main();
  } catch (error) {
    await reportFailure(error);
  }
}

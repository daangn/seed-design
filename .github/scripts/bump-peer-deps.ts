import { appendFile } from "node:fs/promises";
import { resolve } from "node:path";
import { parseArgs } from "node:util";

const CSS_PACKAGE = "@seed-design/css";
const CSS_MANIFEST_PATH = "packages/css/package.json";
const REACT_MANIFEST_PATH = "packages/react/package.json";
const LYNX_CSS_PACKAGE = "@seed-design/lynx-css";
const LYNX_CSS_MANIFEST_PATH = "packages/lynx-css/package.json";
const LYNX_REACT_MANIFEST_PATH = "packages/lynx-react/package.json";
const LOCKFILE_PATH = "bun.lock";
const SHA_PATTERN = /^[0-9a-f]{40}$/;
const STABLE_VERSION_PATTERN = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
const CARET_STABLE_RANGE_PATTERN = /^\^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
const LYNX_RANGE_PATTERN = /^0\.0\.0 \|\| >=0\.(0|[1-9]\d*)\.0 <1\.0\.0$/;

type JsonRecord = Record<string, unknown>;

interface SyncResult {
  changed: boolean;
  cssVersion: string;
  previousRange: string;
  desiredRange: string;
  reactManifest: string;
  lockfile: string;
}

interface WorkflowResult {
  changed: boolean;
  reactChanged: boolean;
  lynxReactChanged: boolean;
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

export function parseStableVersion(version: string): [number, number, number] {
  const match = STABLE_VERSION_PATTERN.exec(version);

  if (!match) {
    throw new Error(`안정 버전 형식이 아닙니다: ${version}`);
  }

  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

export function compareStableVersions(left: string, right: string): number {
  const leftParts = parseStableVersion(left);
  const rightParts = parseStableVersion(right);

  for (let index = 0; index < leftParts.length; index += 1) {
    const difference = leftParts[index] - rightParts[index];
    if (difference !== 0) return difference;
  }

  return 0;
}

function findWorkspaceBlock(lockfile: string, workspacePath: string): [number, number] {
  const marker = `    "${workspacePath}": {`;
  const start = lockfile.indexOf(marker);

  if (start === -1) {
    throw new Error(`bun.lock에서 ${workspacePath} workspace를 찾지 못했습니다.`);
  }

  const nextWorkspace = lockfile.indexOf('\n    "', start + marker.length);
  const workspacesEnd = lockfile.indexOf("\n  },", start + marker.length);
  const endCandidates = [nextWorkspace, workspacesEnd].filter((index) => index !== -1);
  const end = Math.min(...endCandidates);

  if (!Number.isFinite(end)) {
    throw new Error(`bun.lock에서 ${workspacePath} workspace의 끝을 찾지 못했습니다.`);
  }

  return [start, end];
}

function updateLockfilePeerRange(
  lockfile: string,
  workspacePath: string,
  dependencyName: string,
  desiredRange: string,
): string {
  const [workspaceStart, workspaceEnd] = findWorkspaceBlock(lockfile, workspacePath);
  const workspace = lockfile.slice(workspaceStart, workspaceEnd);
  const peerDependenciesStart = workspace.indexOf('\n      "peerDependencies": {');

  if (peerDependenciesStart === -1) {
    throw new Error(`bun.lock의 ${workspacePath} workspace에 peerDependencies가 없습니다.`);
  }

  const peerDependenciesEnd = workspace.indexOf("\n      },", peerDependenciesStart);
  if (peerDependenciesEnd === -1) {
    throw new Error(`bun.lock의 ${workspacePath} peerDependencies 끝을 찾지 못했습니다.`);
  }

  const peerDependencies = workspace.slice(peerDependenciesStart, peerDependenciesEnd);
  const entryPrefix = `        "${dependencyName}": "`;
  const entryStart = peerDependencies.indexOf(entryPrefix);
  const duplicateEntryStart =
    entryStart === -1 ? -1 : peerDependencies.indexOf(entryPrefix, entryStart + entryPrefix.length);

  if (entryStart === -1 || duplicateEntryStart !== -1) {
    throw new Error(
      `bun.lock의 ${workspacePath} peerDependencies에서 ${dependencyName} 항목을 정확히 하나 찾지 못했습니다.`,
    );
  }

  const valueStart = entryStart + entryPrefix.length;
  const entryEnd = peerDependencies.indexOf('",', valueStart);
  if (entryEnd === -1 || peerDependencies.slice(valueStart, entryEnd).includes("\n")) {
    throw new Error(
      `bun.lock의 ${workspacePath} peerDependencies에서 ${dependencyName} 항목 형식이 올바르지 않습니다.`,
    );
  }

  const desiredEntry = `${entryPrefix}${desiredRange}",`;
  const updatedPeerDependencies = `${peerDependencies.slice(0, entryStart)}${desiredEntry}${peerDependencies.slice(entryEnd + 2)}`;
  const updatedWorkspace = `${workspace.slice(0, peerDependenciesStart)}${updatedPeerDependencies}${workspace.slice(peerDependenciesEnd)}`;

  return `${lockfile.slice(0, workspaceStart)}${updatedWorkspace}${lockfile.slice(workspaceEnd)}`;
}

export function synchronizePeerDependencyText(input: {
  cssManifest: string;
  reactManifest: string;
  lockfile: string;
}): SyncResult {
  const cssManifest = readManifest(input.cssManifest, CSS_MANIFEST_PATH);
  const reactManifest = readManifest(input.reactManifest, REACT_MANIFEST_PATH);
  const cssVersion = cssManifest.version;

  if (typeof cssVersion !== "string") {
    throw new Error(`${CSS_MANIFEST_PATH}에 문자열 version이 없습니다.`);
  }

  parseStableVersion(cssVersion);

  if (!isRecord(reactManifest.peerDependencies)) {
    throw new Error(`${REACT_MANIFEST_PATH}에 peerDependencies가 없습니다.`);
  }

  const previousRange = reactManifest.peerDependencies[CSS_PACKAGE];
  if (typeof previousRange !== "string") {
    throw new Error(`${REACT_MANIFEST_PATH}에 ${CSS_PACKAGE} peerDependency가 없습니다.`);
  }
  if (!CARET_STABLE_RANGE_PATTERN.test(previousRange)) {
    throw new Error(
      `${CSS_PACKAGE} peerDependency가 caret 안정 버전 범위가 아닙니다: ${previousRange}`,
    );
  }

  const desiredRange = `^${cssVersion}`;
  const nextLockfile = updateLockfilePeerRange(
    input.lockfile,
    REACT_MANIFEST_PATH.replace("/package.json", ""),
    CSS_PACKAGE,
    desiredRange,
  );

  if (previousRange === desiredRange) {
    return {
      changed: false,
      cssVersion,
      previousRange,
      desiredRange,
      reactManifest: input.reactManifest,
      lockfile: input.lockfile,
    };
  }

  const nextReactManifest = {
    ...reactManifest,
    peerDependencies: {
      ...reactManifest.peerDependencies,
      [CSS_PACKAGE]: desiredRange,
    },
  };

  return {
    changed: true,
    cssVersion,
    previousRange,
    desiredRange,
    reactManifest: `${JSON.stringify(nextReactManifest, null, 2)}\n`,
    lockfile: nextLockfile,
  };
}

export function synchronizeLynxPeerDependencyText(input: {
  lynxCssManifest: string;
  lynxReactManifest: string;
  lockfile: string;
}): SyncResult {
  const lynxCssManifest = readManifest(input.lynxCssManifest, LYNX_CSS_MANIFEST_PATH);
  const lynxReactManifest = readManifest(input.lynxReactManifest, LYNX_REACT_MANIFEST_PATH);
  const lynxCssVersion = lynxCssManifest.version;

  if (typeof lynxCssVersion !== "string") {
    throw new Error(`${LYNX_CSS_MANIFEST_PATH}에 문자열 version이 없습니다.`);
  }

  const [major, minor] = parseStableVersion(lynxCssVersion);
  if (major !== 0) {
    throw new Error(`${LYNX_CSS_PACKAGE} 버전의 major가 0이 아닙니다: ${lynxCssVersion}`);
  }

  if (!isRecord(lynxReactManifest.peerDependencies)) {
    throw new Error(`${LYNX_REACT_MANIFEST_PATH}에 peerDependencies가 없습니다.`);
  }

  const previousRange = lynxReactManifest.peerDependencies[LYNX_CSS_PACKAGE];
  if (typeof previousRange !== "string") {
    throw new Error(`${LYNX_REACT_MANIFEST_PATH}에 ${LYNX_CSS_PACKAGE} peerDependency가 없습니다.`);
  }
  if (!LYNX_RANGE_PATTERN.test(previousRange)) {
    throw new Error(
      `${LYNX_CSS_PACKAGE} peerDependency 범위가 올바르지 않습니다: ${previousRange}`,
    );
  }

  const desiredRange = `0.0.0 || >=0.${minor}.0 <1.0.0`;
  const nextLockfile = updateLockfilePeerRange(
    input.lockfile,
    LYNX_REACT_MANIFEST_PATH.replace("/package.json", ""),
    LYNX_CSS_PACKAGE,
    desiredRange,
  );

  if (previousRange === desiredRange) {
    return {
      changed: false,
      cssVersion: lynxCssVersion,
      previousRange,
      desiredRange,
      reactManifest: input.lynxReactManifest,
      lockfile: input.lockfile,
    };
  }

  const nextLynxReactManifest = {
    ...lynxReactManifest,
    peerDependencies: {
      ...lynxReactManifest.peerDependencies,
      [LYNX_CSS_PACKAGE]: desiredRange,
    },
  };

  return {
    changed: true,
    cssVersion: lynxCssVersion,
    previousRange,
    desiredRange,
    reactManifest: `${JSON.stringify(nextLynxReactManifest, null, 2)}\n`,
    lockfile: nextLockfile,
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

async function writeOutputs(result: WorkflowResult): Promise<void> {
  const output = [
    `changed=${result.changed}`,
    `react-changed=${result.reactChanged}`,
    `lynx-react-changed=${result.lynxReactChanged}`,
    "",
  ].join("\n");
  const githubOutput = process.env.GITHUB_OUTPUT;

  if (githubOutput) {
    await appendFile(githubOutput, output);
  } else {
    process.stdout.write(output);
  }
}

async function main(): Promise<void> {
  const { values } = parseArgs({
    options: {
      root: { type: "string" },
      "base-sha": { type: "string" },
      "source-sha": { type: "string" },
    },
    strict: true,
  });
  const root = values.root ? resolve(values.root) : undefined;
  const baseSha = values["base-sha"];
  const sourceSha = values["source-sha"];

  if (!root || !baseSha || !sourceSha) {
    throw new Error("--root, --base-sha, --source-sha가 모두 필요합니다.");
  }
  if (!SHA_PATTERN.test(baseSha) || !SHA_PATTERN.test(sourceSha)) {
    throw new Error("base/source SHA 형식이 올바르지 않습니다.");
  }

  const checkedOutSha = (await runGit(root, ["rev-parse", "HEAD"])).trim();
  if (checkedOutSha !== sourceSha) {
    throw new Error(`체크아웃한 SHA가 PR head와 다릅니다: ${checkedOutSha}`);
  }

  const mergeBaseSha = (await runGit(root, ["merge-base", baseSha, sourceSha])).trim();
  if (!SHA_PATTERN.test(mergeBaseSha)) {
    throw new Error("PR base와 head의 공통 조상을 찾지 못했습니다.");
  }

  const changedDependencyManifests = (
    await runGit(root, [
      "diff",
      "--name-only",
      "--no-renames",
      mergeBaseSha,
      sourceSha,
      "--",
      CSS_MANIFEST_PATH,
      LYNX_CSS_MANIFEST_PATH,
    ])
  )
    .split("\n")
    .filter(Boolean);

  if (changedDependencyManifests.length === 0) {
    throw new Error(
      `${CSS_MANIFEST_PATH} 또는 ${LYNX_CSS_MANIFEST_PATH} 버전 변경이 포함된 PR에서만 실행할 수 있습니다.`,
    );
  }

  const cssManifestPath = resolve(root, CSS_MANIFEST_PATH);
  const reactManifestPath = resolve(root, REACT_MANIFEST_PATH);
  const lynxCssManifestPath = resolve(root, LYNX_CSS_MANIFEST_PATH);
  const lynxReactManifestPath = resolve(root, LYNX_REACT_MANIFEST_PATH);
  const lockfilePath = resolve(root, LOCKFILE_PATH);
  let lockfile = await Bun.file(lockfilePath).text();
  let nextReactManifest: string | undefined;
  let nextLynxReactManifest: string | undefined;
  let reactChanged = false;
  let lynxReactChanged = false;

  if (changedDependencyManifests.includes(CSS_MANIFEST_PATH)) {
    const baseManifest = readManifest(
      await runGit(root, ["show", `${mergeBaseSha}:${CSS_MANIFEST_PATH}`]),
      `${mergeBaseSha}:${CSS_MANIFEST_PATH}`,
    );
    const baseVersion = baseManifest.version;
    const result = synchronizePeerDependencyText({
      cssManifest: await Bun.file(cssManifestPath).text(),
      reactManifest: await Bun.file(reactManifestPath).text(),
      lockfile,
    });

    if (typeof baseVersion !== "string") {
      throw new Error(`base의 ${CSS_MANIFEST_PATH}에 문자열 version이 없습니다.`);
    }
    if (compareStableVersions(result.cssVersion, baseVersion) <= 0) {
      throw new Error(
        `${CSS_PACKAGE} 버전이 올라가지 않았습니다: ${baseVersion} -> ${result.cssVersion}`,
      );
    }

    reactChanged = result.changed;
    lockfile = result.lockfile;
    if (result.changed) nextReactManifest = result.reactManifest;
  }

  if (changedDependencyManifests.includes(LYNX_CSS_MANIFEST_PATH)) {
    const baseManifest = readManifest(
      await runGit(root, ["show", `${mergeBaseSha}:${LYNX_CSS_MANIFEST_PATH}`]),
      `${mergeBaseSha}:${LYNX_CSS_MANIFEST_PATH}`,
    );
    const baseVersion = baseManifest.version;
    const result = synchronizeLynxPeerDependencyText({
      lynxCssManifest: await Bun.file(lynxCssManifestPath).text(),
      lynxReactManifest: await Bun.file(lynxReactManifestPath).text(),
      lockfile,
    });

    if (typeof baseVersion !== "string") {
      throw new Error(`base의 ${LYNX_CSS_MANIFEST_PATH}에 문자열 version이 없습니다.`);
    }
    if (compareStableVersions(result.cssVersion, baseVersion) <= 0) {
      throw new Error(
        `${LYNX_CSS_PACKAGE} 버전이 올라가지 않았습니다: ${baseVersion} -> ${result.cssVersion}`,
      );
    }

    lynxReactChanged = result.changed;
    lockfile = result.lockfile;
    if (result.changed) nextLynxReactManifest = result.reactManifest;
  }

  const changed = reactChanged || lynxReactChanged;
  if (changed) {
    const writes = [Bun.write(lockfilePath, lockfile)];
    if (nextReactManifest) writes.push(Bun.write(reactManifestPath, nextReactManifest));
    if (nextLynxReactManifest) {
      writes.push(Bun.write(lynxReactManifestPath, nextLynxReactManifest));
    }
    await Promise.all(writes);
  }

  await writeOutputs({ changed, reactChanged, lynxReactChanged });
}

if (import.meta.main) {
  await main();
}

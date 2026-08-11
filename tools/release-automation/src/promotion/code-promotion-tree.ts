import { createHash } from "node:crypto";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const gitShaPattern = /^[0-9a-f]{40}$/;
const changesetPathPattern = /^\.changeset\/[a-z0-9][a-z0-9-]*\.md$/;

const forbiddenExactPaths = new Set([
  ".changeset/config.json",
  ".changeset/pre.json",
  ".github/release/control.json",
  ".github/release/lanes.json",
]);

const forbiddenRoots = [
  ".github/actions",
  ".github/release",
  ".github/workflows",
  "tools/release-automation",
  "tools/rootage-cdn",
];

const baselineGeneratedPaths = new Set([
  "bun.lock",
  "packages/rootage/__generated__/index.json",
  "packages/rootage/__generated__/index.d.ts",
]);

export interface CodePromotionSourceEffect {
  sourcePr: number;
  parentSha: string;
  mergeSha: string;
}

export interface ProjectedBaselineEffect {
  baseSha: string;
  headSha: string;
}

export interface CodePromotionTreeInput {
  repositoryPath: string;
  targetBaseSha: string;
  sourceEffects: readonly CodePromotionSourceEffect[];
  projectedBaseline?: ProjectedBaselineEffect;
}

export type CodePromotionEffectDisposition = "applied" | "already-applied" | "changeset-only";

export interface VerifiedCodePromotionEffect extends CodePromotionSourceEffect {
  patchSha256: string;
  files: string[];
  excludedChangesets: string[];
  disposition: CodePromotionEffectDisposition;
}

export interface ProjectedBaselineTree {
  baseSha: string;
  headSha: string;
  patchSha256: string;
  files: string[];
  treeSha: string;
}

export interface CodePromotionTreeResult {
  targetBaseSha: string;
  targetTreeSha: string;
  codeTreeSha: string;
  patchSha256: string;
  noOp: boolean;
  changedFiles: string[];
  sourceEffects: VerifiedCodePromotionEffect[];
  projectedBaseline?: ProjectedBaselineTree;
}

interface GitResult {
  code: number;
  stdout: string;
  stderr: string;
}

interface NameStatusEntry {
  status: string;
  paths: string[];
}

interface ManifestVersion {
  path: string;
  version: string;
}

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function assertSha(value: string, label: string): void {
  if (!gitShaPattern.test(value)) throw new Error(`${label} SHA가 올바르지 않습니다.`);
}

function isPackageJson(path: string): boolean {
  return path === "package.json" || path.endsWith("/package.json");
}

function isChangelog(path: string): boolean {
  return path === "CHANGELOG.md" || path.endsWith("/CHANGELOG.md");
}

function isForbiddenPath(path: string): boolean {
  return (
    forbiddenExactPaths.has(path) ||
    forbiddenRoots.some((root) => path === root || path.startsWith(`${root}/`))
  );
}

function isAllowedBaselinePath(path: string): boolean {
  return baselineGeneratedPaths.has(path) || isPackageJson(path) || isChangelog(path);
}

async function git(
  cwd: string,
  args: string[],
  options: {
    allowFailure?: boolean;
    environment?: Record<string, string>;
    stdin?: string;
    trim?: boolean;
  } = {},
): Promise<GitResult> {
  const child = Bun.spawn(["git", ...args], {
    cwd,
    env: {
      ...process.env,
      GH_TOKEN: undefined,
      GITHUB_TOKEN: undefined,
      NODE_AUTH_TOKEN: undefined,
      NPM_TOKEN: undefined,
      ...options.environment,
    },
    ...(options.stdin === undefined ? {} : { stdin: "pipe" }),
    stdout: "pipe",
    stderr: "pipe",
  });
  if (options.stdin !== undefined && child.stdin && typeof child.stdin !== "number") {
    child.stdin.write(options.stdin);
    child.stdin.end();
  }
  const [stdout, stderr, code] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]);
  if (code !== 0 && !options.allowFailure) {
    throw new Error(`git ${args[0]} 실패: ${stderr.trim()}`);
  }
  return {
    code,
    stdout: options.trim === false ? stdout : stdout.trim(),
    stderr: stderr.trim(),
  };
}

function parseNameStatus(value: string): NameStatusEntry[] {
  const fields = value.split("\0");
  if (fields.at(-1) === "") fields.pop();
  const entries: NameStatusEntry[] = [];
  for (let index = 0; index < fields.length; ) {
    const status = fields[index++];
    if (!status || !/^(?:[AMDMTUXB]|[RC][0-9]{1,3})$/.test(status)) {
      throw new Error(`source effect의 name-status가 올바르지 않습니다: ${status ?? "없음"}`);
    }
    const pathCount = status.startsWith("R") || status.startsWith("C") ? 2 : 1;
    const paths = fields.slice(index, index + pathCount);
    if (paths.length !== pathCount || paths.some((path) => !path)) {
      throw new Error("source effect의 변경 경로가 불완전합니다.");
    }
    index += pathCount;
    entries.push({ status, paths });
  }
  return entries;
}

async function nameStatus(
  cwd: string,
  baseSha: string,
  headSha: string,
): Promise<NameStatusEntry[]> {
  const result = await git(
    cwd,
    ["diff", "--name-status", "-z", "--find-renames", "--find-copies", baseSha, headSha, "--"],
    { trim: false },
  );
  return parseNameStatus(result.stdout);
}

async function readJsonAt(
  cwd: string,
  ref: string,
  path: string,
): Promise<Record<string, unknown>> {
  const result = await git(cwd, ["show", `${ref}:${path}`]);
  let value: unknown;
  try {
    value = JSON.parse(result.stdout);
  } catch {
    throw new Error(`${path}가 올바른 JSON이 아닙니다.`);
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${path}가 JSON 객체가 아닙니다.`);
  }
  return value as Record<string, unknown>;
}

async function assertManifestVersionUnchanged(
  cwd: string,
  baseSha: string,
  headSha: string,
  entry: NameStatusEntry,
): Promise<void> {
  const packagePaths = entry.paths.filter(isPackageJson);
  if (packagePaths.length === 0) return;
  if (entry.status === "A" || entry.status === "D") return;

  const beforePath = entry.paths[0];
  const afterPath = entry.paths.at(-1);
  if (!beforePath || !afterPath || !isPackageJson(beforePath) || !isPackageJson(afterPath)) {
    throw new Error("package.json을 가로지르는 rename/copy는 코드 승격할 수 없습니다.");
  }
  const [before, after] = await Promise.all([
    readJsonAt(cwd, baseSha, beforePath),
    readJsonAt(cwd, headSha, afterPath),
  ]);
  if (
    typeof before.version !== "string" ||
    typeof after.version !== "string" ||
    before.version !== after.version
  ) {
    throw new Error(`${afterPath}의 package version 변경은 코드 승격할 수 없습니다.`);
  }
}

async function verifyEffectFiles(
  cwd: string,
  effect: CodePromotionSourceEffect,
): Promise<{ includedFiles: string[]; excludedChangesets: string[] }> {
  const entries = await nameStatus(cwd, effect.parentSha, effect.mergeSha);
  const included = new Set<string>();
  const excluded = new Set<string>();

  for (const entry of entries) {
    const changesetPaths = entry.paths.filter((path) => path.startsWith(".changeset/"));
    if (changesetPaths.length > 0) {
      const [onlyPath] = entry.paths;
      if (
        entry.status !== "A" ||
        entry.paths.length !== 1 ||
        !onlyPath ||
        !changesetPathPattern.test(onlyPath) ||
        onlyPath === ".changeset/README.md"
      ) {
        throw new Error(
          `source PR #${effect.sourcePr}은 정상 신규 Changeset Markdown 외의 .changeset 변경을 포함합니다: ${entry.paths.join(", ")}`,
        );
      }
      excluded.add(onlyPath);
      continue;
    }
    for (const path of entry.paths) {
      if (isForbiddenPath(path)) {
        throw new Error(`source PR #${effect.sourcePr}의 금지된 릴리즈 제어 파일: ${path}`);
      }
      if (isChangelog(path)) {
        throw new Error(
          `source PR #${effect.sourcePr}은 CHANGELOG를 직접 변경할 수 없습니다: ${path}`,
        );
      }
    }
    await assertManifestVersionUnchanged(cwd, effect.parentSha, effect.mergeSha, entry);
    for (const path of entry.paths) included.add(path);
  }

  return {
    includedFiles: [...included].sort(),
    excludedChangesets: [...excluded].sort(),
  };
}

async function assertSquashEffect(cwd: string, effect: CodePromotionSourceEffect): Promise<void> {
  if (!Number.isSafeInteger(effect.sourcePr) || effect.sourcePr <= 0) {
    throw new Error("source PR 번호가 올바르지 않습니다.");
  }
  assertSha(effect.parentSha, `source PR #${effect.sourcePr} parent`);
  assertSha(effect.mergeSha, `source PR #${effect.sourcePr} merge`);
  const line = (await git(cwd, ["rev-list", "--parents", "-n", "1", effect.mergeSha])).stdout
    .split(/\s+/)
    .filter(Boolean);
  if (line.length !== 2 || line[0] !== effect.mergeSha || line[1] !== effect.parentSha) {
    throw new Error(
      `source PR #${effect.sourcePr} merge는 기록된 parent의 exact squash/single-parent commit이 아닙니다.`,
    );
  }
}

async function assertOrderedEffects(
  cwd: string,
  sourceEffects: readonly CodePromotionSourceEffect[],
): Promise<void> {
  const pullNumbers = new Set<number>();
  const mergeShas = new Set<string>();
  for (let index = 0; index < sourceEffects.length; index += 1) {
    const effect = sourceEffects[index];
    if (!effect) continue;
    await assertSquashEffect(cwd, effect);
    if (pullNumbers.has(effect.sourcePr) || mergeShas.has(effect.mergeSha)) {
      throw new Error("코드 승격 source effect에 중복 PR 또는 merge SHA가 있습니다.");
    }
    pullNumbers.add(effect.sourcePr);
    mergeShas.add(effect.mergeSha);
    const previous = sourceEffects[index - 1];
    if (previous) {
      const ordering = await git(
        cwd,
        ["merge-base", "--is-ancestor", previous.mergeSha, effect.parentSha],
        { allowFailure: true },
      );
      if (ordering.code !== 0) {
        throw new Error("코드 승격 source effect가 source lane first-parent 순서가 아닙니다.");
      }
    }
  }
}

async function patchForFiles(
  cwd: string,
  baseSha: string,
  headSha: string,
  files: string[],
): Promise<string> {
  if (files.length === 0) return "";
  return (
    await git(cwd, ["diff", "--binary", "--full-index", baseSha, headSha, "--", ...files], {
      trim: false,
    })
  ).stdout;
}

async function applyOrProveAlreadyApplied(
  worktree: string,
  patch: string,
  label: string,
): Promise<"applied" | "already-applied"> {
  const temporary = await mkdtemp(join(tmpdir(), "seed-code-promotion-index-"));
  const indexPath = join(temporary, "index");
  const environment = { GIT_INDEX_FILE: indexPath };
  try {
    await git(worktree, ["read-tree", "HEAD"], { environment });
    const forward = await git(
      worktree,
      ["apply", "--3way", "--cached", "--whitespace=nowarn", "-"],
      { allowFailure: true, environment, stdin: patch },
    );
    if (forward.code === 0) {
      const [beforeTree, afterTree] = await Promise.all([
        treeSha(worktree, "HEAD"),
        git(worktree, ["write-tree"], { environment }).then((result) => result.stdout),
      ]);
      if (beforeTree === afterTree) return "already-applied";
      const parent = (await git(worktree, ["rev-parse", "HEAD"])).stdout;
      const commit = (
        await git(worktree, ["commit-tree", afterTree, "-p", parent, "-m", `project ${label}`])
      ).stdout;
      await git(worktree, ["update-ref", "HEAD", commit, parent]);
      return "applied";
    }

    await rm(indexPath, { force: true });
    await git(worktree, ["read-tree", "HEAD"], { environment });
    const reverse = await git(
      worktree,
      ["apply", "--reverse", "--check", "--cached", "--whitespace=nowarn", "-"],
      { allowFailure: true, environment, stdin: patch },
    );
    if (reverse.code === 0) return "already-applied";
    throw new Error(
      `${label} patch는 exact target에 적용할 수도, 완전히 적용된 상태로 증명할 수도 없습니다. partial already-applied 또는 충돌 상태입니다.`,
    );
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
}

async function treeSha(cwd: string, ref: string): Promise<string> {
  return (await git(cwd, ["rev-parse", `${ref}^{tree}`])).stdout;
}

async function changedFiles(cwd: string, baseRef: string, headRef: string): Promise<string[]> {
  const output = (
    await git(cwd, ["diff", "--name-only", "-z", baseRef, headRef, "--"], { trim: false })
  ).stdout;
  return output.split("\0").filter(Boolean).sort();
}

async function treeListing(cwd: string, ref: string, path: string): Promise<string> {
  return (
    await git(cwd, ["ls-tree", "-r", "-z", ref, "--", path], {
      trim: false,
    })
  ).stdout;
}

async function manifestVersions(cwd: string, ref: string): Promise<ManifestVersion[]> {
  const listing = (
    await git(cwd, ["ls-tree", "-r", "--name-only", "-z", ref, "--"], { trim: false })
  ).stdout;
  const paths = listing.split("\0").filter(isPackageJson).sort();
  return Promise.all(
    paths.map(async (path) => {
      const manifest = await readJsonAt(cwd, ref, path);
      if (typeof manifest.version !== "string") {
        throw new Error(`${path}의 version이 문자열이 아닙니다.`);
      }
      return { path, version: manifest.version };
    }),
  );
}

async function assertTargetStatePreserved(
  cwd: string,
  targetBaseSha: string,
  codeRef: string,
): Promise<void> {
  const [baseChangesets, resultChangesets, beforeVersions, afterVersions] = await Promise.all([
    treeListing(cwd, targetBaseSha, ".changeset"),
    treeListing(cwd, codeRef, ".changeset"),
    manifestVersions(cwd, targetBaseSha),
    manifestVersions(cwd, codeRef),
  ]);
  if (baseChangesets !== resultChangesets) {
    throw new Error("코드 승격 결과가 target의 기존 Changeset 또는 prerelease state를 바꿨습니다.");
  }
  const afterByPath = new Map(afterVersions.map((entry) => [entry.path, entry.version]));
  for (const before of beforeVersions) {
    const after = afterByPath.get(before.path);
    if (after !== undefined && after !== before.version) {
      throw new Error(`코드 승격 결과가 target ${before.path} version을 바꿨습니다.`);
    }
  }
}

async function projectBaseline(
  repositoryPath: string,
  worktree: string,
  baseline: ProjectedBaselineEffect,
): Promise<ProjectedBaselineTree> {
  assertSha(baseline.baseSha, "projected baseline base");
  assertSha(baseline.headSha, "projected baseline head");
  const parentLine = (
    await git(repositoryPath, ["rev-list", "--parents", "-n", "1", baseline.headSha])
  ).stdout
    .split(/\s+/)
    .filter(Boolean);
  if (parentLine.length !== 2 || parentLine[1] !== baseline.baseSha) {
    throw new Error(
      "projected baseline head가 exact baseline base의 single-parent commit이 아닙니다.",
    );
  }
  const entries = await nameStatus(repositoryPath, baseline.baseSha, baseline.headSha);
  const files = [
    ...new Set(entries.flatMap((entry) => entry.paths).filter(isAllowedBaselinePath)),
  ].sort();
  if (files.length === 0)
    throw new Error("projected baseline에 허용된 Stable Version 산출물이 없습니다.");
  const patch = await patchForFiles(repositoryPath, baseline.baseSha, baseline.headSha, files);
  const disposition = await applyOrProveAlreadyApplied(worktree, patch, "projected baseline");
  if (disposition !== "applied") {
    throw new Error(
      "projected baseline은 코드 승격 target에 새 Stable Version 산출물을 적용해야 합니다.",
    );
  }
  return {
    ...baseline,
    patchSha256: sha256(patch),
    files,
    treeSha: await treeSha(worktree, "HEAD"),
  };
}

export async function computeCodePromotionTrees(
  input: CodePromotionTreeInput,
): Promise<CodePromotionTreeResult> {
  const { repositoryPath, sourceEffects, targetBaseSha } = input;
  assertSha(targetBaseSha, "target base");
  await git(repositoryPath, ["cat-file", "-e", `${targetBaseSha}^{commit}`]);
  await assertOrderedEffects(repositoryPath, sourceEffects);

  const temporary = await mkdtemp(join(tmpdir(), "seed-code-promotion-tree-"));
  const worktree = join(temporary, "worktree");
  let worktreeAdded = false;
  try {
    await git(repositoryPath, ["worktree", "add", "--detach", worktree, targetBaseSha]);
    worktreeAdded = true;
    await git(worktree, ["config", "user.name", "github-actions[bot]"]);
    await git(worktree, [
      "config",
      "user.email",
      "41898282+github-actions[bot]@users.noreply.github.com",
    ]);
    const targetTreeSha = await treeSha(worktree, "HEAD");
    const verifiedEffects: VerifiedCodePromotionEffect[] = [];

    for (const effect of sourceEffects) {
      const { excludedChangesets, includedFiles } = await verifyEffectFiles(repositoryPath, effect);
      const patch = await patchForFiles(
        repositoryPath,
        effect.parentSha,
        effect.mergeSha,
        includedFiles,
      );
      const disposition = patch
        ? await applyOrProveAlreadyApplied(worktree, patch, `source PR #${effect.sourcePr}`)
        : "changeset-only";
      verifiedEffects.push({
        ...effect,
        patchSha256: sha256(patch),
        files: includedFiles,
        excludedChangesets,
        disposition,
      });
    }

    await assertTargetStatePreserved(worktree, targetBaseSha, "HEAD");
    const codeTreeSha = await treeSha(worktree, "HEAD");
    const aggregatePatch = (
      await git(worktree, ["diff", "--binary", "--full-index", targetBaseSha, "HEAD", "--"], {
        trim: false,
      })
    ).stdout;
    const result: CodePromotionTreeResult = {
      targetBaseSha,
      targetTreeSha,
      codeTreeSha,
      patchSha256: sha256(aggregatePatch),
      noOp: codeTreeSha === targetTreeSha,
      changedFiles: await changedFiles(worktree, targetBaseSha, "HEAD"),
      sourceEffects: verifiedEffects,
    };
    if (input.projectedBaseline) {
      result.projectedBaseline = await projectBaseline(
        repositoryPath,
        worktree,
        input.projectedBaseline,
      );
    }
    return result;
  } finally {
    if (worktreeAdded) {
      await git(repositoryPath, ["worktree", "remove", "--force", worktree], {
        allowFailure: true,
      });
    }
    await rm(temporary, { recursive: true, force: true });
  }
}

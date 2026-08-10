import { appendFile } from "node:fs/promises";
import { validateChangesets } from "../core/changesets";
import { parseLaneConfig, parseReleaseControl } from "../core/config";
import { verifyGeneratedPrProvenance } from "../core/generated-pr-provenance";
import { GitHubClient, type GitHubPullRequest } from "../core/github";
import {
  isBaselineMarker,
  isPrereleaseMarker,
  isStablePromotionMarker,
  validateGeneratedPr,
} from "../core/marker";
import { isActivationOperation } from "../core/types";
import { verifyGeneratedLaneWritePlan } from "../lane/lane-write-plan";
import { verifyGeneratedPrereleasePlan } from "../lane/prerelease-write-plan";
import { assertLanePullAllowed } from "../lane/pull-policy";
import { classifyPrereleaseState, parseOptionalPrereleaseState } from "../lane/prerelease-state";
import { activationOperationSpecs } from "../setup/activation";
import { verifyBootstrapPull, verifyBootstrapReadiness } from "../setup/bootstrap-policy";
import { selectTrustedGeneratedPullForHead, trustedSyncMarkerForPull } from "../sync/sync-policy";
import {
  createGitHubSyncPullDiffFetcher,
  createTrustedSyncValidationClient,
  verifyTrustedGeneratedSync,
} from "../sync/trusted-sync-validation";
import {
  assertStablePromotionControlMode,
  verifyStablePromotionProvenance,
} from "./stable-promotion";
import { verifyBaselineReconciliation } from "./baseline-reconciliation";
import { assertDevStablePublishReconciled } from "../publish/baseline-reconciliation-state";

type AssociatedPullRequest = GitHubPullRequest & { state: "open" | "closed" };

async function git(arguments_: string[]): Promise<string> {
  const child = Bun.spawn(["git", ...arguments_], { stdout: "pipe", stderr: "pipe" });
  const [stdout, stderr, code] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]);
  if (code !== 0) throw new Error(`git ${arguments_.join(" ")} 실패:\n${stderr}`);
  return stdout.trim();
}

const token = process.env.GH_TOKEN;
const repository = process.env.GITHUB_REPOSITORY;
const headSha = process.env.VALIDATION_HEAD_SHA;
const headRef = process.env.VALIDATION_HEAD_REF;
if (!token || !repository || !headSha || !headRef) {
  throw new Error("GitHub dispatch 검증 환경과 exact generated head 입력이 필요합니다.");
}

const client = new GitHubClient(repository, token);
async function assertDormantSibling(lane: "minor" | "major"): Promise<void> {
  const sibling = lane === "minor" ? "major" : "minor";
  await git([
    "fetch",
    "--no-tags",
    "origin",
    `+refs/heads/${sibling}:refs/remotes/origin/${sibling}`,
  ]);
  const state = parseOptionalPrereleaseState(
    await git(["show", `origin/${sibling}:.changeset/pre.json`]).catch(() => null),
    `${sibling} sibling prerelease state`,
  );
  if (classifyPrereleaseState(sibling, state) !== "dormant") {
    throw new Error(`stable promotion 전 sibling ${sibling} lane은 dormant여야 합니다.`);
  }
  const open = await client.paginate<GitHubPullRequest>(
    `/repos/${repository}/pulls?state=open&base=${sibling}&sort=created&direction=asc`,
  );
  if (
    open.some((candidate) => {
      const generated = validateGeneratedPr({
        author: candidate.user.login,
        body: candidate.body ?? "",
        baseRef: candidate.base.ref,
        headRef: candidate.head.ref,
        baseRepository: candidate.base.repo.full_name,
        headRepository: candidate.head.repo?.full_name ?? "",
      });
      return (
        generated?.type === "version" ||
        generated?.type === "prerelease" ||
        generated?.type === "baseline"
      );
    })
  ) {
    throw new Error(`sibling ${sibling} lane에 경쟁 중인 state/Version PR이 있습니다.`);
  }
}
async function resolveAssociatedPull(
  exactRepository: string,
  exactHeadSha: string,
  exactHeadRef: string,
) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const associated = await client.paginate<AssociatedPullRequest>(
      `/repos/${exactRepository}/commits/${exactHeadSha}/pulls`,
    );
    const selected = selectTrustedGeneratedPullForHead(
      associated,
      exactRepository,
      exactHeadSha,
      exactHeadRef,
    );
    if (selected) return selected;
    if (attempt < 4) await Bun.sleep(500 * 2 ** attempt);
  }
  return null;
}

const selected = await resolveAssociatedPull(repository, headSha, headRef);
if (!selected) {
  throw new Error(
    "dispatch head에 정확히 연결된 ready trusted generated PR을 하나 찾지 못했습니다.",
  );
}
const { pull, marker } = selected;

await git([
  "fetch",
  "--no-tags",
  "origin",
  `+refs/heads/${headRef}:refs/remotes/origin/generated-validation-head`,
  `+refs/heads/${marker.lane}:refs/remotes/origin/${marker.lane}`,
]);
const fetchedHeadSha = await git(["rev-parse", "refs/remotes/origin/generated-validation-head"]);
if (fetchedHeadSha !== headSha || pull.head.sha !== headSha || pull.head.ref !== headRef) {
  throw new Error("dispatch 입력이 GitHub API의 current generated PR head/ref와 다릅니다.");
}
const filesOutput = await git(["diff", "--name-only", `origin/${marker.lane}...${headSha}`, "--"]);
const changedFiles = filesOutput ? filesOutput.split("\n") : [];
const provenance = await verifyGeneratedPrProvenance({ marker, headSha, changedFiles });
const basePreState =
  marker.lane === "dev"
    ? null
    : parseOptionalPrereleaseState(
        await git(["show", `origin/${marker.lane}:.changeset/pre.json`]).catch(() => null),
        "generated PR base prerelease state",
      );
if (basePreState?.mode === "exit" && marker.type !== "version") {
  throw new Error("exiting lane에는 exact Stable Version Packages PR만 허용됩니다.");
}
if (marker.type === "version") {
  await verifyGeneratedLaneWritePlan(process.cwd(), marker, pull.base.sha, headSha);
  if (basePreState?.mode === "exit") {
    if (!isStablePromotionMarker(marker)) {
      throw new Error("exiting lane의 Version PR에는 exact stable promotion marker가 필요합니다.");
    }
    await assertDormantSibling(marker.lane);
    await verifyStablePromotionProvenance({ repository, marker, versionPull: pull, client });
  } else if (isStablePromotionMarker(marker)) {
    throw new Error("stable promotion Version PR의 base가 exact exit state가 아닙니다.");
  }
}
if (marker.type === "prerelease" && isPrereleaseMarker(marker)) {
  await assertDormantSibling(marker.lane);
  if (marker.operation === "enter") {
    const currentDevSha = await git(["rev-parse", "origin/dev"]);
    await assertDevStablePublishReconciled({ repository, currentDevSha, client });
  }
  await verifyGeneratedPrereleasePlan(process.cwd(), marker, pull.base.sha, headSha);
}
if (marker.type === "baseline" && isBaselineMarker(marker)) {
  await verifyBaselineReconciliation({
    repositoryPath: process.cwd(),
    repository,
    marker,
    baseSha: pull.base.sha,
    headSha,
    client,
  });
}
if (marker.type === "bootstrap") {
  if (marker.lane !== "minor" && marker.lane !== "major") {
    throw new Error("bootstrap PR target은 minor 또는 major여야 합니다.");
  }
  await verifyBootstrapPull({
    marker,
    lane: marker.lane,
    baseSha: pull.base.sha,
    headSha,
  });
}
const activationOperation =
  marker.type === "activation" && isActivationOperation(marker.tag) ? marker.tag : null;
if (
  activationOperation &&
  activationOperationSpecs[activationOperation].requiresBootstrapReadiness
) {
  await git([
    "fetch",
    "--no-tags",
    "origin",
    "+refs/heads/minor:refs/remotes/origin/minor",
    "+refs/heads/major:refs/remotes/origin/major",
  ]);
  await verifyBootstrapReadiness();
}
const control = parseReleaseControl(
  JSON.parse(await git(["show", "origin/dev:.github/release/control.json"])),
);
if (isStablePromotionMarker(marker)) assertStablePromotionControlMode(control.mode);
if (marker.type === "prerelease" && marker.operation === "exit") {
  assertStablePromotionControlMode(control.mode);
}
const proposedControl = activationOperation
  ? parseReleaseControl(JSON.parse(await git(["show", `${headSha}:.github/release/control.json`])))
  : undefined;
const proposedConfig = activationOperation
  ? parseLaneConfig(JSON.parse(await git(["show", `${headSha}:.github/release/lanes.json`])))
  : undefined;
const config = parseLaneConfig(
  JSON.parse(await git(["show", "origin/dev:.github/release/lanes.json"])),
);
if (marker.type !== "prerelease" && marker.type !== "baseline") {
  assertLanePullAllowed({
    lane: marker.lane,
    marker,
    files: changedFiles,
    control,
    config,
    proposedControl,
    proposedConfig,
    headSha,
  });
}

let changesetCount: number | null = null;
if (marker.type === "sync") {
  const syncMarker = trustedSyncMarkerForPull(pull, repository);
  if (!syncMarker) throw new Error("sync marker의 source/tree 결속 정보가 불완전합니다.");
  if (provenance.controlTreeSha256 !== syncMarker.controlTreeSha256) {
    throw new Error("checkout의 control-plane tree가 marker에 고정된 dev overlay와 다릅니다.");
  }
  await verifyTrustedGeneratedSync({
    repository,
    pull,
    marker: syncMarker,
    config,
    client: createTrustedSyncValidationClient(client),
    fetchPullDiff: createGitHubSyncPullDiffFetcher(token),
  });

  const changesetFilesOutput = await git([
    "ls-tree",
    "-r",
    "--name-only",
    headSha,
    "--",
    ".changeset",
  ]);
  const changesetFiles = changesetFilesOutput
    .split("\n")
    .filter((file) => file?.endsWith(".md") && file !== ".changeset/README.md");
  const changesets = await validateChangesets(
    changesetFiles,
    syncMarker.lane,
    config.lanes[syncMarker.lane].bump,
    (file) => git(["show", `${headSha}:${file}`]),
  );
  if (changesets.errors.length > 0) throw new Error(changesets.errors.join("\n"));
  changesetCount = changesets.entries.length;
}

const output = process.env.GITHUB_OUTPUT;
if (output) {
  await appendFile(
    output,
    `type=${marker.type}\nlane=${marker.lane}\npr=${pull.number}\nheadSha=${headSha}\n`,
  );
}
const summary = process.env.GITHUB_STEP_SUMMARY;
if (summary) {
  await appendFile(
    summary,
    [
      "## Trusted generated PR dispatch 검증",
      "",
      `- PR / type: #${pull.number} / \`${marker.type}\``,
      `- head: \`${headSha}\``,
      `- lane: \`${marker.lane}\``,
      ...(changesetCount === null ? [] : [`- normalized changesets: ${changesetCount}개`]),
      "",
    ].join("\n"),
  );
}
console.log(`trusted generated PR #${pull.number} dispatch 입력을 검증했습니다.`);

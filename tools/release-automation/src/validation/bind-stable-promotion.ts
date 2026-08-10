import { appendFile } from "node:fs/promises";
import { GitHubClient, type GitHubPullRequest } from "../core/github";
import { encodeMarker, isStablePromotionMarker, type StablePromotionMarker } from "../core/marker";
import type { PullRequestIdentity } from "../core/types";
import { trustedVersionMarker } from "../publish/publish-state";
import { verifyStablePromotionProvenance } from "./stable-promotion";

const gitShaPattern = /^[0-9a-f]{40}$/;
const markerPattern = /<!-- seed-release:\{[^\n]+\} -->/;

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} 환경 변수가 필요합니다.`);
  return value;
}

function identity(pull: GitHubPullRequest): PullRequestIdentity {
  return {
    author: pull.user.login,
    body: pull.body ?? "",
    baseRef: pull.base.ref,
    headRef: pull.head.ref,
    baseRepository: pull.base.repo.full_name,
    headRepository: pull.head.repo?.full_name ?? "",
  };
}

async function gitHead(): Promise<string> {
  const child = Bun.spawn(["git", "rev-parse", "HEAD"], { stdout: "pipe", stderr: "pipe" });
  const [stdout, stderr, code] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]);
  if (code !== 0) throw new Error(`trusted control SHA 조회 실패:\n${stderr}`);
  return stdout.trim();
}

async function dispatchValidation(
  repository: string,
  token: string,
  headRef: string,
  headSha: string,
): Promise<void> {
  const response = await fetch(
    `https://api.github.com/repos/${repository}/actions/workflows/release-pr-validation.yml/dispatches`,
    {
      method: "POST",
      headers: {
        accept: "application/vnd.github+json",
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
        "x-github-api-version": "2022-11-28",
      },
      body: JSON.stringify({ ref: "dev", inputs: { head_ref: headRef, head_sha: headSha } }),
    },
  );
  if (!response.ok)
    throw new Error(`stable promotion validation dispatch 실패: ${response.status}`);
}

async function main(): Promise<void> {
  const token = required("GH_TOKEN");
  const repository = required("GITHUB_REPOSITORY");
  const lane = required("RELEASE_PLAN_LANE");
  const operationId = required("RELEASE_PROMOTION_OPERATION_ID");
  const expectedBaseSha = required("RELEASE_PLAN_BASE_SHA");
  const expectedHeadSha = required("RELEASE_VERSION_HEAD_SHA");
  const controlSha = required("RELEASE_PLAN_CONTROL_SHA");
  const exitMergeSha = required("RELEASE_PROMOTION_EXIT_MERGE_SHA");
  const exitPr = Number(required("RELEASE_PROMOTION_EXIT_PR"));
  const versionPr = Number(required("RELEASE_VERSION_PR"));
  if (
    (lane !== "minor" && lane !== "major") ||
    !/^[1-9][0-9]*$/.test(operationId) ||
    !gitShaPattern.test(expectedBaseSha) ||
    !gitShaPattern.test(expectedHeadSha) ||
    !gitShaPattern.test(controlSha) ||
    !gitShaPattern.test(exitMergeSha) ||
    expectedBaseSha !== exitMergeSha ||
    !Number.isSafeInteger(exitPr) ||
    exitPr <= 0 ||
    !Number.isSafeInteger(versionPr) ||
    versionPr <= 0
  ) {
    throw new Error("stable promotion workflow identity가 올바르지 않습니다.");
  }
  if ((await gitHead()) !== controlSha)
    throw new Error("binder checkout이 exact control SHA가 아닙니다.");
  const client = new GitHubClient(repository, token);
  const pull = await client.request<GitHubPullRequest>(`/repos/${repository}/pulls/${versionPr}`);
  const existing = trustedVersionMarker(identity(pull), expectedHeadSha);
  if (!existing) throw new Error("binder 대상이 trusted Version Packages PR이 아닙니다.");
  const marker: StablePromotionMarker = {
    schemaVersion: 1,
    type: "version",
    lane,
    releaseKind: "stable-promotion",
    operationId,
    exitPr,
    exitMergeSha,
    expectedBaseSha,
    expectedHeadSha,
    controlSha,
  };
  if (!isStablePromotionMarker(marker))
    throw new Error("stable promotion marker 생성에 실패했습니다.");
  await verifyStablePromotionProvenance({ repository, marker, versionPull: pull, client });
  const body = pull.body ?? "";
  if (!markerPattern.test(body)) throw new Error("Version Packages PR marker body가 없습니다.");
  const nextBody = body.replace(markerPattern, encodeMarker(marker));
  if (nextBody !== body) {
    await client.request(`/repos/${repository}/pulls/${versionPr}`, {
      method: "PATCH",
      body: JSON.stringify({ body: nextBody }),
    });
  }
  await dispatchValidation(repository, token, pull.head.ref, pull.head.sha);
  if (process.env.GITHUB_OUTPUT) {
    await appendFile(
      process.env.GITHUB_OUTPUT,
      `stablePromotion=true\noperationId=${operationId}\nexitPr=${exitPr}\nexitMergeSha=${exitMergeSha}\n`,
    );
  }
}

if (import.meta.main) await main();

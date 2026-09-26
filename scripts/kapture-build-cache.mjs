/**
 * 일반 비교의 base 빌드 직전에, 동일 커밋·정책의 신뢰된 Storybook artifact를 찾습니다.
 * 캐시가 없거나 검증할 수 없으면 정확한 base를 다시 빌드합니다.
 * 캡처·승인을 생략하거나 기존 artifact와 Preview를 삭제하지 않습니다.
 */
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
// Temporary consumer implementation until Kapture's restore-build is released.
// Workflow values own storage policy; GitHub artifact expiration owns the TTL.
export function cacheName(prefix, branch, sha, policyDigest) {
  if (
    !/^[a-zA-Z0-9_-]+$/.test(prefix) ||
    !/^[a-zA-Z0-9_-]+$/.test(branch) ||
    !/^[a-f0-9]{40}$/.test(sha) ||
    !/^[a-f0-9]{64}$/.test(policyDigest)
  ) {
    throw new Error("Invalid build cache identity");
  }
  return `${prefix}${branch}-${sha}-${policyDigest}`;
}

async function readRemote(github, repo, ref, path) {
  const { data } = await github.rest.repos.getContent({ ...repo, ref, path });
  if (!data.content || data.encoding !== "base64") throw new Error(`Missing policy file: ${path}`);
  return Buffer.from(data.content, "base64");
}

export async function resolveBuildCache({
  github,
  context,
  core,
  policyRoot,
  branch,
  sha,
  workflow,
  prefix,
}) {
  core.setOutput("cache-hit", "false");
  core.setOutput("cache-name", "");
  const policyFiles = [workflow, "scripts/kapture-build-cache.mjs"];
  try {
    const { data: repository } = await github.rest.repos.get(context.repo);
    const { data: defaultRef } = await github.rest.repos.getBranch({
      ...context.repo,
      branch: repository.default_branch,
    });
    const trustedSha = defaultRef.commit.sha;
    const local = await Promise.all(policyFiles.map((file) => readFile(resolve(policyRoot, file))));
    const trusted = await Promise.all(
      policyFiles.map((file) => readRemote(github, context.repo, trustedSha, file)),
    );
    if (!local.every((value, index) => value.equals(trusted[index]))) {
      core.info("Build reuse disabled: policy is not yet on the default branch");
      return;
    }
    const digest = createHash("sha256");
    local.forEach((value, index) => {
      digest.update(policyFiles[index]).update("\0").update(value).update("\0");
    });
    const name = cacheName(prefix, branch, sha, digest.digest("hex"));
    core.setOutput("cache-name", name);
    const artifacts = await github.paginate(github.rest.actions.listArtifactsForRepo, {
      ...context.repo,
      name,
      per_page: 100,
    });
    for (const artifact of artifacts
      .filter((a) => !a.expired && a.name === name)
      .sort((a, b) => b.id - a.id)) {
      const { data: run } = await github.rest.actions.getWorkflowRun({
        ...context.repo,
        run_id: artifact.workflow_run.id,
      });
      if (
        run.status !== "completed" ||
        run.conclusion !== "success" ||
        run.event !== "pull_request" ||
        run.path !== workflow ||
        run.head_repository?.id !== repository.id ||
        artifact.workflow_run.head_repository_id !== repository.id
      )
        continue;
      const producer = await Promise.all(
        policyFiles.map((file) => readRemote(github, context.repo, run.head_sha, file)),
      );
      if (!producer.every((value, index) => value.equals(trusted[index]))) continue;
      if (!/^sha256:[a-f0-9]{64}$/.test(artifact.digest ?? "")) continue;
      core.setOutput("cache-hit", "true");
      core.setOutput("artifact-id", String(artifact.id));
      core.setOutput("run-id", String(run.id));
      core.info(`Reusing exact-base build artifact ${artifact.id} from run ${run.id}`);
      return;
    }
  } catch (error) {
    // Availability optimization only: a missing/forbidden/expired cache must never skip capture.
    core.warning(`Build cache unavailable; building exact base: ${error.message}`);
  }
}

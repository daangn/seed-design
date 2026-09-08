import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  BASE_BRANCHES,
  CAPTURE_WORKFLOW,
  DAY,
  POLICY_FILES,
  RETENTION_DAYS,
  cacheName,
} from "./kapture-policy.mjs";

async function readRemote(github, repo, ref, path) {
  const { data } = await github.rest.repos.getContent({ ...repo, ref, path });
  if (!data.content || data.encoding !== "base64") throw new Error(`Missing policy file: ${path}`);
  return Buffer.from(data.content, "base64");
}

export async function resolveBuildCache({ github, context, core, policyRoot, branch, sha }) {
  core.setOutput("cache-hit", "false");
  core.setOutput("cache-name", "");
  if (!BASE_BRANCHES.includes(branch)) return;
  try {
    const { data: repository } = await github.rest.repos.get(context.repo);
    const { data: defaultRef } = await github.rest.repos.getBranch({
      ...context.repo,
      branch: repository.default_branch,
    });
    const trustedSha = defaultRef.commit.sha;
    const local = await Promise.all(
      POLICY_FILES.map((file) => readFile(resolve(policyRoot, file))),
    );
    const trusted = await Promise.all(
      POLICY_FILES.map((file) => readRemote(github, context.repo, trustedSha, file)),
    );
    if (!local.every((value, index) => value.equals(trusted[index]))) {
      core.info("Build reuse disabled: policy is not yet on the default branch");
      return;
    }
    const digest = createHash("sha256");
    local.forEach((value, index) => {
      digest.update(POLICY_FILES[index]).update("\0").update(value).update("\0");
    });
    const name = cacheName(branch, sha, digest.digest("hex"));
    core.setOutput("cache-name", name);
    const artifacts = await github.paginate(github.rest.actions.listArtifactsForRepo, {
      ...context.repo,
      name,
      per_page: 100,
    });
    for (const artifact of artifacts
      .filter(
        (a) =>
          !a.expired &&
          a.name === name &&
          Date.now() - Date.parse(a.created_at) < RETENTION_DAYS * DAY,
      )
      .sort((a, b) => b.id - a.id)) {
      const { data: run } = await github.rest.actions.getWorkflowRun({
        ...context.repo,
        run_id: artifact.workflow_run.id,
      });
      if (
        run.status !== "completed" ||
        run.conclusion !== "success" ||
        run.event !== "pull_request" ||
        run.path !== CAPTURE_WORKFLOW ||
        run.head_repository?.id !== repository.id ||
        artifact.workflow_run.head_repository_id !== repository.id
      )
        continue;
      const producer = await Promise.all(
        POLICY_FILES.map((file) => readRemote(github, context.repo, run.head_sha, file)),
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

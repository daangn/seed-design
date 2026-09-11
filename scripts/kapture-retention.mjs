import { deploymentOwner, selectBuildsToDelete, shouldDeletePreview } from "./kapture-policy.mjs";

const PROJECT = "seed-design-storybook";

export function cloudflareClient({ accountId, token, fetchImpl = fetch }) {
  if (!/^[a-f0-9]{32}$/.test(accountId ?? "") || !token)
    throw new Error("Cloudflare credentials are required");
  const root = `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${PROJECT}`;
  return async (path, method = "GET") => {
    const response = await fetchImpl(`${root}${path}`, {
      method,
      headers: { Authorization: `Bearer ${token}` },
      redirect: "error",
    });
    const body = await response.json();
    if (!response.ok || !body.success) {
      // Do not print responses that could include credentials or upload details.
      throw new Error(`Cloudflare ${method} failed (${response.status})`);
    }
    return body;
  };
}

async function listDeployments(cf) {
  const results = [];
  for (let page = 1; page <= 100; page++) {
    const data = await cf(`/deployments?env=preview&per_page=100&page=${page}`);
    if (!Array.isArray(data.result)) throw new Error("Invalid deployment list");
    results.push(...data.result);
    const pages = data.result_info?.total_pages;
    if (Number.isInteger(pages)) {
      if (page >= pages) return results;
      if (!data.result.length) throw new Error("Incomplete deployment pagination");
    } else if (data.result.length < (data.result_info?.per_page ?? 100)) return results;
  }
  throw new Error("Deployment pagination exceeded safety limit; no cleanup performed");
}

export async function cleanupBuilds({ github, context, core, dryRun = true }) {
  const artifacts = await github.paginate(github.rest.actions.listArtifactsForRepo, {
    ...context.repo,
    per_page: 100,
  });
  const targets = selectBuildsToDelete(artifacts);
  for (const artifact of targets) {
    core.info(
      `${dryRun ? "Would delete" : "Delete"} build artifact ${artifact.id}: ${artifact.name}`,
    );
    if (!dryRun) {
      // Never delete from a producer still running; repeat cleanup reconciles racing uploads.
      const { data: run } = await github.rest.actions.getWorkflowRun({
        ...context.repo,
        run_id: artifact.workflow_run.id,
      });
      if (run.status !== "completed") continue;
      await github.rest.actions.deleteArtifact({ ...context.repo, artifact_id: artifact.id });
    }
  }
  return targets.length;
}

export async function cleanupPreviews({ github, context, core, cf, dryRun = true }) {
  const deployments = (await listDeployments(cf)).filter((d) => deploymentOwner(d));
  const groups = Map.groupBy(deployments, (d) => deploymentOwner(d).pr);
  let deleted = 0;
  const failures = [];
  for (const [number, group] of groups) {
    try {
      let prDeleted = 0;
      const { data: pr } = await github.rest.pulls.get({ ...context.repo, pull_number: number });
      const protectedIds = new Set();
      if (pr.state === "open") {
        const successful = group
          .filter((d) => d.latest_stage?.status === "success")
          .sort((a, b) => Date.parse(b.created_on) - Date.parse(a.created_on));
        if (successful[0]) protectedIds.add(successful[0].id);
        // Preserve review evidence without interpreting Kapture's private comment encoding.
        // Historical success statuses conservatively protect approved/clean reports.
        for (const sha of new Set(group.map((d) => deploymentOwner(d).sha))) {
          const statuses = await github.paginate(github.rest.repos.listCommitStatusesForRef, {
            ...context.repo,
            ref: sha,
            per_page: 100,
          });
          const urls = new Set(
            statuses
              .filter((s) => s.context === "Kapture Visual Review" && s.state === "success")
              .map((s) => s.target_url?.replace(/\/$/, "")),
          );
          for (const d of group) if (urls.has(d.url?.replace(/\/$/, ""))) protectedIds.add(d.id);
        }
        const comments = await github.paginate(github.rest.issues.listComments, {
          ...context.repo,
          issue_number: number,
          per_page: 100,
        });
        // Also protect the current published review even if its status is still pending.
        for (const d of group)
          if (comments.some((c) => c.user?.type === "Bot" && c.body?.includes(d.url)))
            protectedIds.add(d.id);
      }
      for (const deployment of group) {
        if (!shouldDeletePreview(deployment, pr, protectedIds)) continue;
        const id = deployment.id;
        if (!/^[a-f0-9-]{36}$/.test(id)) throw new Error("Invalid deployment ID");
        core.info(`${dryRun ? "Would delete" : "Delete"} PR #${number} preview ${id}`);
        if (dryRun) continue;
        // Report/approval/cleanup share a queue. Still re-read the PR to catch reopen races.
        const { data: current } = await github.rest.pulls.get({
          ...context.repo,
          pull_number: number,
        });
        if (
          current.state !== pr.state ||
          current.updated_at !== pr.updated_at ||
          !shouldDeletePreview(deployment, current, protectedIds)
        )
          break;
        const { result: fresh } = await cf(`/deployments/${id}`);
        if (deploymentOwner(fresh)?.pr !== number || fresh.environment !== "preview")
          throw new Error("Deployment identity changed");
        await cf(`/deployments/${id}?force=true`, "DELETE");
        deleted++;
        prDeleted++;
      }
      if (!dryRun && pr.state === "closed" && group.length && prDeleted === group.length) {
        const comments = await github.paginate(github.rest.issues.listComments, {
          ...context.repo,
          issue_number: number,
          per_page: 100,
        });
        const marker = "<!-- seed-kapture-preview-expired -->";
        if (!comments.some((c) => c.user?.type === "Bot" && c.body?.includes(marker))) {
          await github.rest.issues.createComment({
            ...context.repo,
            issue_number: number,
            body: `${marker}\nKapture Preview 보관 기간(PR 종료 후 7일)이 지나 이미지·대시보드를 정리했습니다. 기존 링크와 MCP 이미지 조회는 만료됩니다. PR을 다시 열면 새 비교가 필요합니다.`,
          });
        }
      }
    } catch (error) {
      failures.push(`PR #${number}: ${error.message}`);
    }
  }
  core.info(`Deleted ${deleted} preview deployments`);
  if (failures.length) throw new Error(failures.join("\n"));
  return deleted;
}

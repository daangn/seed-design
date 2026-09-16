// SEED-owned storage policy. Capture/report/approval semantics remain in Kapture.
export const BASE_BRANCHES = ["dev", "minor", "major"];
export const RETENTION_DAYS = 7;
export const MAX_BUILD_BYTES = 1024 ** 3;
export const MAX_BUILDS_PER_BRANCH = 3;
export const DAY = 86400000;
export const CACHE_PREFIX = "seed-kapture-build-";
export const CAPTURE_WORKFLOW = ".github/workflows/kapture-capture.yml";
export const POLICY_FILES = [
  CAPTURE_WORKFLOW,
  "scripts/kapture-policy.mjs",
  "scripts/kapture-build-cache.mjs",
];

export function cacheName(branch, sha, policyDigest) {
  if (
    !BASE_BRANCHES.includes(branch) ||
    !/^[a-f0-9]{40}$/.test(sha) ||
    !/^[a-f0-9]{64}$/.test(policyDigest)
  ) {
    throw new Error("Invalid build identity");
  }
  return `${CACHE_PREFIX}${branch}-${sha}-${policyDigest}`;
}

export function parseCacheName(name) {
  const match = /^seed-kapture-build-(dev|minor|major)-([a-f0-9]{40})-([a-f0-9]{64})$/.exec(name);
  return match ? { branch: match[1], sha: match[2], policyDigest: match[3] } : null;
}

export function selectBuildsToDelete(artifacts, now = Date.now()) {
  const counts = new Map();
  const identities = new Set();
  let bytes = 0;
  return artifacts
    .filter((a) => !a.expired && parseCacheName(a.name))
    .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at) || b.id - a.id)
    .filter((a) => {
      const { branch } = parseCacheName(a.name);
      const count = counts.get(branch) ?? 0;
      if (
        !Number.isFinite(Date.parse(a.created_at)) ||
        !Number.isSafeInteger(a.size_in_bytes) ||
        a.size_in_bytes < 0
      ) {
        throw new Error("Invalid cache metadata; refusing cleanup");
      }
      if (
        now - Date.parse(a.created_at) >= RETENTION_DAYS * DAY ||
        identities.has(a.name) ||
        count >= MAX_BUILDS_PER_BRANCH ||
        bytes + a.size_in_bytes > MAX_BUILD_BYTES
      )
        return true;
      identities.add(a.name);
      counts.set(branch, count + 1);
      bytes += a.size_in_bytes;
      return false;
    });
}

// Both fields are written by our trusted publisher, not inferred from user branch names.
export function deploymentOwner(deployment) {
  if (deployment.environment !== "preview") return null;
  const metadata = deployment.deployment_trigger?.metadata;
  const branch = /^kapture-pr-([1-9][0-9]*)$/.exec(metadata?.branch ?? "");
  const marker = /^kapture-pr-([1-9][0-9]*)-run-([1-9][0-9]*)$/.exec(
    metadata?.commit_message ?? "",
  );
  if (!branch || !marker || branch[1] !== marker[1]) return null;
  if (!/^[a-f0-9]{40}$/.test(metadata.commit_hash)) return null;
  return { pr: Number(branch[1]), run: Number(marker[2]), sha: metadata.commit_hash };
}

export function shouldDeletePreview(deployment, pr, protectedIds, now = Date.now()) {
  const owner = deploymentOwner(deployment);
  if (!owner || owner.pr !== pr.number) return false;
  const created = Date.parse(deployment.created_on);
  if (!Number.isFinite(created) || now - created < RETENTION_DAYS * DAY) return false;
  if (pr.state === "closed") {
    const closed = Date.parse(pr.closed_at);
    return Number.isFinite(closed) && now - closed >= RETENTION_DAYS * DAY;
  }
  return pr.state === "open" && !protectedIds.has(deployment.id);
}

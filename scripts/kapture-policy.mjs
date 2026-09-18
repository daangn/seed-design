/** SEED의 base 빌드 캐시 식별 규칙입니다. 조회 시 사용하며 만료는 GitHub에 맡깁니다. API 호출이나 삭제는 수행하지 않습니다. */
export const BASE_BRANCHES = ["dev", "minor", "major"];
export const RETENTION_DAYS = 7;
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

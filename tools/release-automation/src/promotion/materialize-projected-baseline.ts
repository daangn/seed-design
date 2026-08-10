const shaPattern = /^[0-9a-f]{40}$/;
const allowedGenerated = new Set([
  "bun.lock",
  "packages/rootage/__generated__/index.json",
  "packages/rootage/__generated__/index.d.ts",
]);

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} 환경 변수가 필요합니다.`);
  return value;
}

function isAllowed(path: string): boolean {
  return (
    allowedGenerated.has(path) ||
    path === "package.json" ||
    path.endsWith("/package.json") ||
    path.endsWith("/CHANGELOG.md")
  );
}

async function git(args: string[], stdin?: string): Promise<string> {
  const child = Bun.spawn(["git", ...args], {
    env: {
      ...process.env,
      GH_TOKEN: undefined,
      GITHUB_TOKEN: undefined,
      NODE_AUTH_TOKEN: undefined,
      NPM_TOKEN: undefined,
      GIT_AUTHOR_NAME: "github-actions[bot]",
      GIT_AUTHOR_EMAIL: "41898282+github-actions[bot]@users.noreply.github.com",
      GIT_COMMITTER_NAME: "github-actions[bot]",
      GIT_COMMITTER_EMAIL: "41898282+github-actions[bot]@users.noreply.github.com",
    },
    ...(stdin === undefined ? {} : { stdin: "pipe" }),
    stdout: "pipe",
    stderr: "pipe",
  });
  if (stdin !== undefined && child.stdin && typeof child.stdin !== "number") {
    child.stdin.write(stdin);
    child.stdin.end();
  }
  const [stdout, stderr, code] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]);
  if (code !== 0) throw new Error(`projected baseline git ${args[0]} 실패: ${stderr.trim()}`);
  return stdout.trim();
}

export async function materializeProjectedBaseline(): Promise<void> {
  const codeHeadSha = required("PROMOTION_CODE_HEAD_SHA");
  const expectedCodeTreeSha = required("PROMOTION_EXPECTED_CODE_TREE_SHA");
  const stableBaseSha = required("PROMOTION_STABLE_BASE_SHA");
  const stableHeadSha = required("PROMOTION_STABLE_HEAD_SHA");
  const expectedBaselineTreeSha = required("PROMOTION_EXPECTED_BASELINE_TREE_SHA");
  for (const [label, sha] of [
    ["code head", codeHeadSha],
    ["code tree", expectedCodeTreeSha],
    ["Stable base", stableBaseSha],
    ["Stable head", stableHeadSha],
    ["baseline tree", expectedBaselineTreeSha],
  ]) {
    if (!shaPattern.test(sha)) throw new Error(`${label} SHA가 올바르지 않습니다.`);
  }
  await git(["fetch", "--no-tags", "origin", stableBaseSha, stableHeadSha]);
  const [currentHead, codeTree, stableLine] = await Promise.all([
    git(["rev-parse", "HEAD"]),
    git(["rev-parse", "HEAD^{tree}"]),
    git(["rev-list", "--parents", "-n", "1", stableHeadSha]),
  ]);
  const [, ...stableParents] = stableLine.split(/\s+/);
  if (
    currentHead !== codeHeadSha ||
    codeTree !== expectedCodeTreeSha ||
    stableParents.length !== 1 ||
    stableParents[0] !== stableBaseSha
  ) {
    throw new Error("projected baseline 입력 head/base/code tree가 trusted marker와 다릅니다.");
  }
  const changed = (await git(["diff", "--name-only", stableBaseSha, stableHeadSha, "--"]))
    .split("\n")
    .filter(Boolean);
  const files = changed.filter(isAllowed).sort();
  if (
    files.length === 0 ||
    files.length !== changed.length ||
    !files.some((path) => path === "package.json" || path.endsWith("/package.json"))
  ) {
    throw new Error("Stable Version patch가 허용된 baseline 산출물만 포함하지 않습니다.");
  }
  const patch = await git([
    "diff",
    "--binary",
    "--full-index",
    stableBaseSha,
    stableHeadSha,
    "--",
    ...files,
  ]);
  await git(["apply", "--3way", "--index", "-"], `${patch}\n`);
  const actualTree = await git(["write-tree"]);
  if (actualTree !== expectedBaselineTreeSha) {
    throw new Error("materialized baseline tree가 게시 전 projected tree와 다릅니다.");
  }
  const commit = await git([
    "commit-tree",
    actualTree,
    "-p",
    codeHeadSha,
    "-m",
    "test projected stable baseline",
  ]);
  await git(["reset", "--hard", commit]);
  if (await git(["status", "--porcelain", "--untracked-files=all"])) {
    throw new Error("materialized projected baseline checkout이 clean하지 않습니다.");
  }
}

if (import.meta.main) await materializeProjectedBaseline();

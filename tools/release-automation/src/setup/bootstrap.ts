import { appendFile } from "node:fs/promises";
import { loadLaneConfig, loadReleaseControl } from "../core/config";
import { GitHubClient } from "../core/github";

interface GitReference {
  ref: string;
  object: { sha: string };
}

const token = process.env.GH_TOKEN;
const repository = process.env.GITHUB_REPOSITORY;
const expectedDevSha = process.env.BOOTSTRAP_DEV_SHA;
if (!token || !repository || !expectedDevSha || !/^[0-9a-f]{40}$/.test(expectedDevSha)) {
  throw new Error("릴리즈 bootstrap token, 저장소, 검증된 exact dev SHA가 필요합니다.");
}

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

const [control, config, checkoutSha] = await Promise.all([
  loadReleaseControl(),
  loadLaneConfig(),
  git(["rev-parse", "HEAD"]),
]);
if (
  control.mode !== "dry-run" ||
  !control.rootageContractReady ||
  config.sync.activation !== null
) {
  throw new Error("DES-2201 계약이 준비된 dry-run·sync 비활성 상태에서만 bootstrap할 수 있습니다.");
}
if (checkoutSha !== expectedDevSha) {
  throw new Error("bootstrap checkout이 preflight에서 검증한 exact dev SHA와 다릅니다.");
}

const client = new GitHubClient(repository, token);
const dev = await client.request<GitReference>(`/repos/${repository}/git/ref/heads/dev`);
if (dev.object.sha !== expectedDevSha) {
  throw new Error("preflight 뒤 dev가 변경됐습니다. 최신 dev에서 bootstrap을 다시 실행하세요.");
}
for (const lane of ["minor", "major"] as const) {
  try {
    const existing = await client.request<GitReference>(
      `/repos/${repository}/git/ref/heads/${lane}`,
    );
    if (existing.object.sha !== expectedDevSha) {
      throw new Error(
        `${lane}가 exact dev baseline이 아닙니다: expected ${expectedDevSha}, actual ${existing.object.sha}`,
      );
    }
  } catch (error) {
    if (!(error instanceof Error) || !error.message.includes("404")) throw error;
    await client.request(`/repos/${repository}/git/refs`, {
      method: "POST",
      body: JSON.stringify({ ref: `refs/heads/${lane}`, sha: dev.object.sha }),
    });
  }
}
const output = process.env.GITHUB_OUTPUT;
if (output) await appendFile(output, `dev_sha=${expectedDevSha}\n`);
console.log(`minor와 major가 exact dev@${expectedDevSha} baseline을 사용합니다.`);

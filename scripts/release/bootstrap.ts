import { GitHubClient } from "./github";
import { loadReleaseControl } from "./config";

interface GitReference {
  ref: string;
  object: { sha: string };
}

const token = process.env.GH_TOKEN;
const repository = process.env.GITHUB_REPOSITORY;
if (!token || !repository)
  throw new Error("Daangn Bud installation token과 GitHub 저장소 정보가 필요합니다.");

const control = await loadReleaseControl();
if (control.mode !== "dry-run" || !control.rootageContractReady || control.freeze) {
  throw new Error("DES-2201 계약이 준비된 dry-run·비승격 상태에서만 bootstrap할 수 있습니다.");
}

const client = new GitHubClient(repository, token);
const dev = await client.request<GitReference>(`/repos/${repository}/git/ref/heads/dev`);
for (const lane of ["minor", "major"] as const) {
  try {
    await client.request<GitReference>(`/repos/${repository}/git/ref/heads/${lane}`);
  } catch (error) {
    if (!(error instanceof Error) || !error.message.includes("404")) throw error;
    await client.request(`/repos/${repository}/git/refs`, {
      method: "POST",
      body: JSON.stringify({ ref: `refs/heads/${lane}`, sha: dev.object.sha }),
    });
  }
}
console.log(`minor와 major를 dev@${dev.object.sha}에서 생성했습니다.`);

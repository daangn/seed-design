import { GitHubClient, type GitHubPullRequest } from "./github";
import { validateGeneratedPr } from "./marker";

interface WorkflowRunEvent {
  workflow_run: {
    conclusion: string;
    pull_requests: Array<{ number: number }>;
  };
}

interface PullCommit {
  author: { login: string } | null;
  commit: { author: { email: string | null } };
}

const token = process.env.GH_TOKEN;
const repository = process.env.GITHUB_REPOSITORY;
const eventPath = process.env.GITHUB_EVENT_PATH;
if (!token || !repository || !eventPath) throw new Error("GitHub workflow 환경이 필요합니다.");

const event = (await Bun.file(eventPath).json()) as WorkflowRunEvent;
if (event.workflow_run.conclusion !== "success") {
  console.log("검증 workflow가 성공하지 않아 자동 merge하지 않습니다.");
  process.exit(0);
}
const pullNumber = event.workflow_run.pull_requests[0]?.number;
if (!pullNumber) {
  console.log("연결된 PR이 없어 종료합니다.");
  process.exit(0);
}

const client = new GitHubClient(repository, token);
const pull = await client.request<GitHubPullRequest>(`/repos/${repository}/pulls/${pullNumber}`);
const marker = validateGeneratedPr({
  author: pull.user.login,
  body: pull.body ?? "",
  baseRef: pull.base.ref,
  headRef: pull.head.ref,
  baseRepository: pull.base.repo.full_name,
  headRepository: pull.head.repo?.full_name ?? "",
});
if (!marker || marker.type !== "sync" || pull.draft) {
  console.log("신뢰된 ready sync PR이 아니므로 자동 merge하지 않습니다.");
  process.exit(0);
}
if (!marker.expectedHeadSha || marker.expectedHeadSha !== pull.head.sha) {
  console.log("자동 생성 이후 head가 변경되어 수동 리뷰로 전환합니다.");
  process.exit(0);
}

const commits = await client.paginate<PullCommit>(
  `/repos/${repository}/pulls/${pullNumber}/commits`,
);
const hasHumanCommit = commits.some(
  (commit) =>
    commit.author?.login !== "github-actions[bot]" &&
    commit.commit.author.email !== "41898282+github-actions[bot]@users.noreply.github.com",
);
if (hasHumanCommit) {
  console.log("사람 commit이 있어 자동 merge하지 않습니다.");
  process.exit(0);
}

await client.request(`/repos/${repository}/pulls/${pullNumber}/merge`, {
  method: "PUT",
  body: JSON.stringify({
    sha: pull.head.sha,
    merge_method: "squash",
    commit_title: `chore(release): sync #${marker.sourcePr} to ${marker.targetLane}`,
  }),
});
console.log(`sync PR #${pullNumber}을 merge했습니다.`);

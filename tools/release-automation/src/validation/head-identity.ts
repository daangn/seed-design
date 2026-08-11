import type { GitHubPullRequest } from "../core/github";

interface AssociatedPull extends GitHubPullRequest {
  state: "open" | "closed";
}

interface Client {
  paginate<T>(path: string): Promise<T[]>;
}

export async function assertUniqueOpenReleasePullForHead(options: {
  client: Client;
  repository: string;
  pullNumber: number;
  headSha: string;
}): Promise<void> {
  const associated = await options.client.paginate<AssociatedPull>(
    `/repos/${options.repository}/commits/${options.headSha}/pulls`,
  );
  const openReleasePulls = associated.filter(
    (pull) =>
      pull.state === "open" &&
      pull.head.sha === options.headSha &&
      pull.base.repo.full_name === options.repository &&
      (pull.base.ref === "dev" || pull.base.ref === "minor" || pull.base.ref === "major"),
  );
  if (openReleasePulls.length !== 1 || openReleasePulls[0]?.number !== options.pullNumber) {
    throw new Error(
      "같은 head SHA를 공유하는 open release PR이 있어 SHA 단위 validation status를 안전하게 기록할 수 없습니다.",
    );
  }
}

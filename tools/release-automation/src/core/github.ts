export interface GitHubPullRequest {
  number: number;
  node_id?: string;
  body: string | null;
  draft: boolean;
  merged_at: string | null;
  merge_commit_sha: string | null;
  created_at: string;
  user: { login: string };
  merged_by?: { login: string } | null;
  base: { ref: string; sha: string; repo: { full_name: string } };
  head: { ref: string; sha: string; repo: { full_name: string } | null };
}

export class GitHubClient {
  readonly repository: string;
  readonly token: string;

  constructor(repository: string, token: string) {
    this.repository = repository;
    this.token = token;
  }

  async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const response = await fetch(`https://api.github.com${path}`, {
      ...init,
      headers: {
        accept: "application/vnd.github+json",
        authorization: `Bearer ${this.token}`,
        "x-github-api-version": "2022-11-28",
        ...init.headers,
      },
    });
    if (!response.ok) {
      throw new Error(
        `GitHub API ${init.method ?? "GET"} ${path} 실패: ${response.status} ${await response.text()}`,
      );
    }
    if (response.status === 204) return undefined as T;
    return (await response.json()) as T;
  }

  async paginate<T>(path: string): Promise<T[]> {
    const results: T[] = [];
    for (let page = 1; ; page += 1) {
      const separator = path.includes("?") ? "&" : "?";
      const current = await this.request<T[]>(`${path}${separator}per_page=100&page=${page}`);
      results.push(...current);
      if (current.length < 100) return results;
    }
  }

  async comment(issue: number, body: string): Promise<void> {
    await this.request(`/repos/${this.repository}/issues/${issue}/comments`, {
      method: "POST",
      body: JSON.stringify({ body }),
    });
  }

  async ensureLabel(name: string, color: string, description: string): Promise<void> {
    const encoded = encodeURIComponent(name);
    const response = await fetch(
      `https://api.github.com/repos/${this.repository}/labels/${encoded}`,
      {
        headers: {
          accept: "application/vnd.github+json",
          authorization: `Bearer ${this.token}`,
          "x-github-api-version": "2022-11-28",
        },
      },
    );
    if (response.ok) return;
    if (response.status !== 404) throw new Error(`label 조회 실패: ${response.status}`);
    await this.request(`/repos/${this.repository}/labels`, {
      method: "POST",
      body: JSON.stringify({ name, color, description }),
    });
  }
}

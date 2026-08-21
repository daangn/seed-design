// @ts-check

const COMMAND = "/ff-merge";
const TARGET_BRANCH = "dev";
const SOURCE_BRANCHES = new Set(["minor", "major"]);
const ALLOWED_ASSOCIATIONS = new Set(["OWNER", "MEMBER", "COLLABORATOR"]);
const SHA_PATTERN = /^[0-9a-f]{40}$/;

class FFMergeError extends Error {
  constructor(message) {
    super(message);
    this.name = "FFMergeError";
  }
}

/**
 * @param {unknown} value
 */
function escapeMarkdown(value) {
  return String(value).replaceAll("\\", "\\\\").replaceAll("|", "\\|").replaceAll("\n", " ");
}

/**
 * @param {string} sha
 */
function shortSha(sha) {
  return SHA_PATTERN.test(sha) ? `\`${sha.slice(0, 12)}\`` : "-";
}

/**
 * @param {unknown} error
 */
function errorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}

/**
 * @param {{
 *   repository: string;
 *   runUrl: string;
 *   actor: string;
 *   pullNumber: number;
 *   pullUrl?: string;
 *   sourceBranch?: string;
 *   baseSha?: string;
 *   headSha?: string;
 *   status: string;
 *   detail: string;
 *   failure?: boolean;
 * }} report
 */
function renderSummary(report) {
  const pull = report.pullUrl
    ? `[#${report.pullNumber}](${report.pullUrl})`
    : `#${report.pullNumber}`;
  const direction = report.sourceBranch
    ? `\`${escapeMarkdown(report.sourceBranch)}\` → \`${TARGET_BRANCH}\``
    : "확인 실패";
  const lines = [
    "# `/ff-merge` 실행 결과",
    "",
    `- 실행자: @${escapeMarkdown(report.actor)}`,
    `- Pull Request: ${pull}`,
    `- 실행 결과: [GitHub Actions](${report.runUrl})`,
    "",
    "| 병합 방향 | 이전 `dev` | 이후 `dev` | 결과 | 상세 |",
    "| --- | --- | --- | --- | --- |",
    `| ${direction} | ${shortSha(report.baseSha ?? "")} | ${shortSha(report.headSha ?? "")} | ${escapeMarkdown(report.status)} | ${escapeMarkdown(report.detail)} |`,
  ];

  if (report.failure) {
    lines.push(
      "",
      "<details>",
      "<summary>실패 확인 방법</summary>",
      "",
      "1. 위 상세 사유와 Actions 로그를 확인합니다.",
      `2. PR이 열린 상태인지, 브랜치 방향이 \`minor|major → ${TARGET_BRANCH}\`인지 확인합니다.`,
      "3. `dev`와 source 브랜치가 갈라졌다면 source 브랜치를 `dev` 위로 리베이스합니다.",
      `4. 원격 브랜치가 갱신된 뒤 PR에서 \`${COMMAND}\`를 다시 실행합니다.`,
      "",
      "</details>",
    );
  }

  return `${lines.join("\n")}\n`;
}

/**
 * @param {object} pull
 * @param {string} repository
 */
function validatePullRequest(pull, repository) {
  if (pull.state !== "open") {
    throw new FFMergeError("열린 PR에서만 실행할 수 있습니다.");
  }
  if (pull.draft === true) {
    throw new FFMergeError("초안 PR에서는 실행할 수 없습니다.");
  }
  if (pull.head?.repo?.full_name !== repository || pull.base?.repo?.full_name !== repository) {
    throw new FFMergeError("같은 저장소의 브랜치로 만든 PR에서만 실행할 수 있습니다.");
  }
  if (!SOURCE_BRANCHES.has(pull.head?.ref) || pull.base?.ref !== TARGET_BRANCH) {
    throw new FFMergeError("`minor → dev` 또는 `major → dev` PR에서만 실행할 수 있습니다.");
  }
  if (!SHA_PATTERN.test(pull.head?.sha ?? "") || !SHA_PATTERN.test(pull.base?.sha ?? "")) {
    throw new FFMergeError("PR base/head SHA 형식이 올바르지 않습니다.");
  }

  return {
    baseSha: pull.base.sha,
    headSha: pull.head.sha,
    pullUrl: pull.html_url,
    sourceBranch: pull.head.ref,
  };
}

/**
 * @param {object} permission
 */
function hasWritePermission(permission) {
  return permission.user?.permissions?.push === true;
}

/**
 * @param {object} comparison
 */
function validateComparison(comparison) {
  switch (comparison.status) {
    case "ahead":
      if (!(comparison.ahead_by > 0)) {
        throw new FFMergeError("추가할 커밋을 확인하지 못했습니다.");
      }
      return;
    case "identical":
      throw new FFMergeError("`dev`가 이미 PR head와 같습니다.");
    case "behind":
      throw new FFMergeError("`dev`가 source 브랜치보다 앞서 있어 fast-forward할 수 없습니다.");
    case "diverged":
      throw new FFMergeError("`dev`와 source 브랜치가 갈라져 있어 fast-forward할 수 없습니다.");
    default:
      throw new FFMergeError(
        `지원하지 않는 GitHub 비교 상태입니다: ${comparison.status ?? "unknown"}`,
      );
  }
}

/**
 * @param {{
 *   github: any;
 *   context: any;
 *   expectedBaseSha?: string;
 *   expectedHeadSha?: string;
 * }} input
 */
async function inspectRequest({ github, context, expectedBaseSha, expectedHeadSha }) {
  const { owner, repo } = context.repo;
  const repository = `${owner}/${repo}`;
  const actor = context.payload.comment?.user?.login ?? context.actor;
  const association = context.payload.comment?.author_association;

  if (context.payload.comment?.body !== COMMAND) {
    throw new FFMergeError(`댓글 내용이 정확히 \`${COMMAND}\`여야 합니다.`);
  }
  if (!ALLOWED_ASSOCIATIONS.has(association)) {
    throw new FFMergeError("저장소 협업자만 실행할 수 있습니다.");
  }

  const { data: permission } = await github.rest.repos.getCollaboratorPermissionLevel({
    owner,
    repo,
    username: actor,
  });
  if (!hasWritePermission(permission)) {
    throw new FFMergeError("저장소 쓰기 권한이 있는 사용자만 실행할 수 있습니다.");
  }

  const { data: pull } = await github.rest.pulls.get({
    owner,
    repo,
    pull_number: context.issue.number,
  });
  const pullInfo = validatePullRequest(pull, repository);

  if (expectedBaseSha && pullInfo.baseSha !== expectedBaseSha) {
    throw new FFMergeError(
      "사전 검증 이후 `dev`가 변경되었습니다. 최신 상태에서 다시 실행해 주세요.",
    );
  }
  if (expectedHeadSha && pullInfo.headSha !== expectedHeadSha) {
    throw new FFMergeError(
      "사전 검증 이후 source 브랜치가 변경되었습니다. 최신 상태에서 다시 실행해 주세요.",
    );
  }

  const { data: comparison } = await github.rest.repos.compareCommitsWithBasehead({
    owner,
    repo,
    basehead: `${pullInfo.baseSha}...${pullInfo.headSha}`,
  });
  validateComparison(comparison);

  return {
    ...pullInfo,
    actor,
    pullNumber: context.issue.number,
  };
}

/**
 * @param {{
 *   readGithub: any;
 *   writeGithub: any;
 *   context: any;
 *   expectedBaseSha: string;
 *   expectedHeadSha: string;
 * }} input
 */
async function performFastForward({
  readGithub,
  writeGithub,
  context,
  expectedBaseSha,
  expectedHeadSha,
}) {
  const inspected = await inspectRequest({
    github: readGithub,
    context,
    expectedBaseSha,
    expectedHeadSha,
  });
  const { owner, repo } = context.repo;

  await writeGithub.rest.git.updateRef({
    owner,
    repo,
    ref: `heads/${TARGET_BRANCH}`,
    sha: inspected.headSha,
    force: false,
  });

  const { data: updatedRef } = await writeGithub.rest.git.getRef({
    owner,
    repo,
    ref: `heads/${TARGET_BRANCH}`,
  });
  if (updatedRef.object?.sha !== inspected.headSha) {
    throw new FFMergeError("갱신 뒤 `dev`가 예상한 PR head를 가리키지 않습니다.");
  }

  return inspected;
}

/**
 * @param {{ github: any; context: any; core: any; content: string }} input
 */
async function addReaction({ github, context, core, content }) {
  try {
    await github.rest.reactions.createForIssueComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      comment_id: context.payload.comment.id,
      content,
    });
  } catch (error) {
    core.warning(`댓글 반응을 추가하지 못했습니다: ${errorMessage(error)}`);
  }
}

/**
 * @param {{ github: any; context: any; core: any; message: string }} input
 */
async function reportFailure({ github, context, core, message }) {
  await addReaction({ github, context, core, content: "-1" });
  const runUrl = `${process.env.GITHUB_SERVER_URL ?? "https://github.com"}/${context.repo.owner}/${context.repo.repo}/actions/runs/${process.env.GITHUB_RUN_ID ?? ""}`;
  const body = [
    `\`${COMMAND}\`를 실행하지 못했습니다.`,
    "",
    `> ${message}`,
    "",
    `[GitHub Actions 실행 결과](${runUrl})에서 자세한 내용을 확인할 수 있습니다.`,
  ].join("\n");

  try {
    await github.rest.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: context.issue.number,
      body,
    });
  } catch (error) {
    core.warning(`실패 댓글을 남기지 못했습니다: ${errorMessage(error)}`);
  }
}

/**
 * @param {{ core: any; context: any; report: Partial<Parameters<typeof renderSummary>[0]> }} input
 */
async function writeSummary({ core, context, report }) {
  const repository = `${context.repo.owner}/${context.repo.repo}`;
  const runUrl = `${process.env.GITHUB_SERVER_URL ?? "https://github.com"}/${repository}/actions/runs/${process.env.GITHUB_RUN_ID ?? ""}`;
  await core.summary
    .addRaw(
      renderSummary({
        repository,
        runUrl,
        actor: context.payload.comment?.user?.login ?? context.actor,
        pullNumber: context.issue.number,
        status: "실패",
        detail: "알 수 없는 오류가 발생했습니다.",
        ...report,
      }),
    )
    .write();
}

/**
 * @param {{ github: any; context: any; core: any }} input
 */
async function preflight({ github, context, core }) {
  await addReaction({ github, context, core, content: "eyes" });

  try {
    const inspected = await inspectRequest({ github, context });
    core.setOutput("base-sha", inspected.baseSha);
    core.setOutput("head-sha", inspected.headSha);
    core.setOutput("source-branch", inspected.sourceBranch);
    core.setOutput("pull-url", inspected.pullUrl);
    await writeSummary({
      core,
      context,
      report: {
        ...inspected,
        status: "사전 검증 완료",
        detail: "fast-forward 병합 조건을 확인했습니다.",
      },
    });
  } catch (error) {
    const message = errorMessage(error);
    await writeSummary({
      core,
      context,
      report: { status: "실패", detail: message, failure: true },
    });
    await reportFailure({ github, context, core, message });
    core.setFailed(message);
  }
}

/**
 * @param {{ github: any; context: any; core: any; getOctokit: any; appToken: string }} input
 */
async function merge({ github, context, core, getOctokit, appToken }) {
  try {
    if (!appToken) {
      throw new FFMergeError("GitHub App 토큰을 발급하지 못했습니다.");
    }
    const inspected = await performFastForward({
      readGithub: github,
      writeGithub: getOctokit(appToken),
      context,
      expectedBaseSha: process.env.FF_MERGE_BASE_SHA ?? "",
      expectedHeadSha: process.env.FF_MERGE_HEAD_SHA ?? "",
    });
    await addReaction({ github, context, core, content: "rocket" });
    await writeSummary({
      core,
      context,
      report: {
        ...inspected,
        status: "성공",
        detail: "원래 커밋 SHA를 유지한 채 `dev`를 fast-forward했습니다.",
      },
    });
  } catch (error) {
    const message = errorMessage(error);
    await writeSummary({
      core,
      context,
      report: {
        sourceBranch: process.env.FF_MERGE_SOURCE_BRANCH,
        baseSha: process.env.FF_MERGE_BASE_SHA,
        headSha: process.env.FF_MERGE_HEAD_SHA,
        pullUrl: process.env.FF_MERGE_PULL_URL,
        status: "실패",
        detail: message,
        failure: true,
      },
    });
    await reportFailure({ github, context, core, message });
    core.setFailed(message);
  }
}

module.exports = {
  FFMergeError,
  escapeMarkdown,
  hasWritePermission,
  inspectRequest,
  merge,
  performFastForward,
  preflight,
  renderSummary,
  validateComparison,
  validatePullRequest,
};

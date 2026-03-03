// @ts-check
const { execSync } = require("node:child_process");
const fs = require("node:fs");

const repo = process.env.GITHUB_REPOSITORY;

// 24시간 전 ISO 시각 (KST 기준 어제 10:00 = UTC 01:00)
const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

/**
 * @typedef {{ title: string, html_url: string, login: string, merged_at: string, number: number }} PR
 */

/**
 * 지난 24시간 동안 dev 브랜치에 머지된 PR 목록을 가져옴
 * @returns {PR[]}
 */
function fetchMergedPRs() {
  const query = `repo:${repo} is:pr is:merged base:dev merged:>${since}`;
  const result = execSync(
    `gh api "search/issues?q=${encodeURIComponent(query)}&per_page=50&sort=created&order=desc" --jq '.items'`,
    { encoding: "utf8" },
  );

  /** @type {{ title: string, html_url: string, user: { login: string }, pull_request: { merged_at: string }, number: number }[]} */
  const items = JSON.parse(result);

  return items.map((item) => ({
    title: item.title,
    html_url: item.html_url,
    login: item.user.login,
    merged_at: item.pull_request.merged_at,
    number: item.number,
  }));
}

/**
 * KST 기준 날짜 포맷 (예: 12/13 10:00)
 * @param {string} isoString
 */
function formatKST(isoString) {
  return new Date(isoString).toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function main() {
  const prs = fetchMergedPRs();

  const githubOutput = process.env.GITHUB_OUTPUT;
  if (!githubOutput) throw new Error("GITHUB_OUTPUT 환경변수가 설정되지 않았어요.");

  if (prs.length === 0) {
    console.log("지난 24시간 동안 머지된 PR이 없어요.");
    fs.appendFileSync(githubOutput, "has_prs=false\n");
    return;
  }

  const sinceKST = formatKST(since);
  const nowKST = formatKST(new Date().toISOString());

  // Block Kit 구성
  const blocks = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "📋 SEED Design 일간 PR 현황",
      },
    },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: `${sinceKST} ~ ${nowKST} · 총 *${prs.length}개* 머지`,
        },
      ],
    },
    { type: "divider" },
  ];

  // PR 목록 (최대 20개)
  const prText = prs
    .slice(0, 20)
    .map((pr) => `• <${pr.html_url}|#${pr.number} ${pr.title}> _by @${pr.login}_`)
    .join("\n");

  blocks.push({
    type: "section",
    text: { type: "mrkdwn", text: prText },
  });

  if (prs.length > 20) {
    blocks.push({
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: `외 ${prs.length - 20}개`,
        },
      ],
    });
  }

  const output = JSON.stringify(blocks);
  fs.appendFileSync(githubOutput, `has_prs=true\nblocks<<EOF\n${output}\nEOF\n`);

  console.log(`${prs.length}개 PR 파싱 완료!`);
}

main();

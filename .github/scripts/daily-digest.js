// @ts-check
const { execSync } = require("node:child_process");
const fs = require("node:fs");

const repo = process.env.GITHUB_REPOSITORY;

// 24시간 전 ISO 시각 (KST 기준 어제 10:00 = UTC 01:00)
const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

/**
 * @typedef {{ title: string, html_url: string, login: string, number: number }} PR
 */

/**
 * GitHub Search API로 PR 목록 조회
 * @param {string} query
 * @returns {PR[]}
 */
function fetchPRs(query) {
  const result = execSync(
    `gh api "search/issues?q=${encodeURIComponent(query)}&per_page=50&sort=created&order=desc" --jq '.items'`,
    { encoding: "utf8" },
  );

  /** @type {{ title: string, html_url: string, user: { login: string }, number: number }[]} */
  const items = JSON.parse(result);

  return items.map((item) => ({
    title: item.title,
    html_url: item.html_url,
    login: item.user.login,
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

/**
 * PR 목록을 Slack mrkdwn 텍스트로 변환
 * @param {PR[]} prs
 */
function formatPRList(prs) {
  return prs
    .slice(0, 20)
    .map((pr) => `• <${pr.html_url}|#${pr.number} ${pr.title}> _by @${pr.login}_`)
    .join("\n");
}

function main() {
  const mergedPRs = fetchPRs(`repo:${repo} is:pr is:merged base:dev merged:>${since}`);
  const openedPRs = fetchPRs(`repo:${repo} is:pr is:open created:>${since}`);

  const githubOutput = process.env.GITHUB_OUTPUT;
  if (!githubOutput) throw new Error("GITHUB_OUTPUT 환경변수가 설정되지 않았어요.");

  if (mergedPRs.length === 0 && openedPRs.length === 0) {
    console.log("지난 24시간 동안 활동이 없어요.");
    fs.appendFileSync(githubOutput, "has_prs=false\n");
    return;
  }

  const sinceKST = formatKST(since);
  const nowKST = formatKST(new Date().toISOString());

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
          text: `${sinceKST} ~ ${nowKST}`,
        },
      ],
    },
    { type: "divider" },
  ];

  if (mergedPRs.length > 0) {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `✅ *머지된 PR* (${mergedPRs.length}개)\n${formatPRList(mergedPRs)}`,
      },
    });

    if (mergedPRs.length > 20) {
      blocks.push({
        type: "context",
        elements: [{ type: "mrkdwn", text: `외 ${mergedPRs.length - 20}개` }],
      });
    }
  }

  if (openedPRs.length > 0) {
    if (mergedPRs.length > 0) blocks.push({ type: "divider" });

    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `🔄 *새로 열린 PR* (${openedPRs.length}개)\n${formatPRList(openedPRs)}`,
      },
    });

    if (openedPRs.length > 20) {
      blocks.push({
        type: "context",
        elements: [{ type: "mrkdwn", text: `외 ${openedPRs.length - 20}개` }],
      });
    }
  }

  const output = JSON.stringify(blocks);
  fs.appendFileSync(githubOutput, `has_prs=true\nblocks<<EOF\n${output}\nEOF\n`);

  console.log(`머지 ${mergedPRs.length}개, 새 PR ${openedPRs.length}개 파싱 완료!`);
}

main();

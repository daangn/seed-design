// @ts-check
const fs = require("node:fs");
const path = require("node:path");

const changelogFiles = process.env.CHANGELOG_FILES?.split("\n").filter(Boolean) ?? [];
const prUrl = process.env.PR_URL;

/** changeset이 자동 생성하는 노이즈 라인 접두사 목록 */
const IGNORED_LINE_PREFIXES = ["- Updated dependencies"];

/** 순서 번호 이모지 */
const NUMBER_EMOJIS = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];
const REPO = "daangn/seed-design";

/**
 * CHANGELOG 항목의 커밋 표기를 Slack 링크 표기로 변환
 * - [`abcdef1`](https://github.com/.../commit/abcdef1) -> <https://...|`abcdef1`>
 * - `abcdef1`: ... -> <https://github.com/daangn/seed-design/commit/abcdef1|`abcdef1`>: ...
 * @param {string} item
 */
function toSlackCommitLink(item) {
  const withMarkdownLink = item.replace(
    /\[`?([a-f0-9]{7,40})`?\]\((https:\/\/github\.com\/[^)]+\/commit\/[a-f0-9]{7,40})\)/gi,
    (_, shortHash, url) => `<${url}|\`${shortHash}\`>`,
  );

  return withMarkdownLink.replace(
    /^- [`']?([a-f0-9]{7,40})[`']?:\s*/i,
    (_, hash) => `- <https://github.com/${REPO}/commit/${hash}|\`${hash.slice(0, 7)}\`>: `,
  );
}

/**
 * CHANGELOG.md에서 가장 최신 버전 섹션을 추출
 * @param {string} content
 * @returns {{ version: string, sections: Record<string, string[]> } | null}
 */
function extractLatestVersion(content) {
  const versionMatch = content.match(/## (\d+\.\d+\.\d+)([\s\S]*?)(?=\n## \d|\n# |$)/);
  if (!versionMatch) return null;

  const version = versionMatch[1];
  const body = versionMatch[2].trim();

  /** @type {Record<string, string[]>} */
  const sections = {};
  const sectionRegex = /### (.+?)\n([\s\S]*?)(?=\n### |\n## |$)/g;
  let match;

  for (match = sectionRegex.exec(body); match !== null; match = sectionRegex.exec(body)) {
    const sectionName = match[1].trim();
    const items = match[2]
      .split("\n")
      .filter(
        (line) =>
          line.startsWith("- ") &&
          IGNORED_LINE_PREFIXES.every((prefix) => !line.startsWith(prefix)),
      )
      .map(toSlackCommitLink);

    if (items.length > 0) sections[sectionName] = items;
  }

  return { version, sections };
}

/**
 * @param {string} changelogPath
 */
function getPackageName(changelogPath) {
  const dir = path.dirname(changelogPath);
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(dir, "package.json"), "utf8"));
    return pkg.name;
  } catch {
    return dir;
  }
}

function main() {
  if (changelogFiles.length === 0) {
    console.log("변경된 CHANGELOG.md 파일이 없어요.");
    process.exit(0);
  }

  const releases = [];

  for (const file of changelogFiles) {
    if (!fs.existsSync(file)) continue;

    const content = fs.readFileSync(file, "utf8");
    const latest = extractLatestVersion(content);
    if (!latest) continue;

    const packageName = getPackageName(file);
    releases.push({ packageName, ...latest });
  }

  if (releases.length === 0) {
    console.log("파싱할 릴리즈가 없어요.");
    process.exit(0);
  }

  // Block Kit 구성
  const blocks = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "🌱 SEED Design 새 버전이 릴리즈됐어요!",
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "안녕하세요 프론트엔드 챕터 여러분~ SEED 새로운 버전이 릴리즈되었어요 :알잘딱:",
      },
    },
    { type: "divider" },
  ];

  for (const [i, release] of releases.entries()) {
    const emoji = NUMBER_EMOJIS[i] ?? `${i + 1}.`;
    const allItems = Object.values(release.sections).flat();

    const text = [
      `${emoji} *${release.packageName}@${release.version}*`,
      "",
      ...allItems.slice(0, 10).map((item) => `• ${item.replace(/^- /, "")}`),
    ].join("\n");

    blocks.push({
      type: "section",
      text: { type: "mrkdwn", text: text.trim() },
    });
  }

  blocks.push({
    type: "actions",
    elements: [
      {
        type: "button",
        style: "primary",
        text: { type: "plain_text", text: "PR 보기" },
        url: prUrl ?? "",
      },
    ],
  });

  blocks.push({
    type: "section",
    text: {
      type: "mrkdwn",
      text: "질문이 있으시다면 #_design-system 채널에 남겨주세요 :wave: (테스트 중이라 멘션은 잠시 제외했어요.)",
    },
  });

  // GITHUB_OUTPUT에 blocks 출력
  const output = JSON.stringify(blocks);
  const githubOutput = process.env.GITHUB_OUTPUT;
  if (!githubOutput) throw new Error("GITHUB_OUTPUT 환경변수가 설정되지 않았어요.");
  fs.appendFileSync(githubOutput, `blocks<<EOF\n${output}\nEOF\n`);

  console.log("Slack payload 생성 완료!");
}

main();

// @ts-check
const fs = require("node:fs");
const path = require("node:path");

const changelogFiles = process.env.CHANGELOG_FILES?.split("\n").filter(Boolean) ?? [];
const prUrl = process.env.PR_URL;

/** changeset이 자동 생성하는 노이즈 라인 접두사 목록 */
const IGNORED_LINE_PREFIXES = ["- Updated dependencies"];

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
      // changeset 해시 제거: `- \`a1b2c3\`: 메시지` → `- 메시지`
      .map((line) => line.replace(/^- [`']?[a-f0-9]{7,}[`']?:\s*/, "- "));

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

/**
 * @param {string} name
 */
function formatSectionName(name) {
  if (name.includes("Major")) return "💥 Major Changes";
  if (name.includes("Minor")) return "✨ Minor Changes";
  if (name.includes("Patch")) return "🐛 Patch Changes";
  return name;
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
    { type: "divider" },
  ];

  for (const release of releases) {
    let text = `*${release.packageName}* v${release.version}\n`;

    for (const [sectionName, items] of Object.entries(release.sections)) {
      text += `${formatSectionName(sectionName)}\n`;
      text += `${items.slice(0, 5).join("\n")}\n`;
    }

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

  // GITHUB_OUTPUT에 blocks 출력
  const output = JSON.stringify(blocks);
  const githubOutput = process.env.GITHUB_OUTPUT;
  if (!githubOutput) throw new Error("GITHUB_OUTPUT 환경변수가 설정되지 않았어요.");
  fs.appendFileSync(githubOutput, `blocks<<EOF\n${output}\nEOF\n`);

  console.log("Slack payload 생성 완료!");
}

main();

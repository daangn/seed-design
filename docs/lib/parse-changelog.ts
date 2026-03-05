import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

export interface ChangelogPackage {
  name: string;
  version: string;
  url: string;
}

export interface ChangelogEntry {
  date: string;
  label?: string;
  contentHtml: string;
  packages: ChangelogPackage[];
}

const processor = remark().use(remarkGfm).use(remarkRehype).use(rehypeStringify);

async function mdToHtml(md: string): Promise<string> {
  // 1. remark (= unified + remark-parse) → MD 문자열 → MDAST
  // 2. remarkGfm → MDAST에 GFM 문법(표, 체크박스 등) 추가 파싱
  // 3. remarkRehype → MDAST → HAST
  // 4. rehypeStringify → HAST → HTML 문자열
  const result = await processor.process(md);
  return String(result);
}

const PACKAGE_REGEX = /- 📦 \[(@seed-design\/[^@\]]+)@([^\]]+)\]\(([^)]+)\)/g;

const AFFECTED_SECTION = "\n영향받는 패키지";

function extractPackages(block: string): ChangelogPackage[] {
  const packages: ChangelogPackage[] = [];
  let match: RegExpExecArray | null;
  PACKAGE_REGEX.lastIndex = 0;
  // biome-ignore lint/suspicious/noAssignInExpressions: 패키지 추출 로직에서 사용
  while ((match = PACKAGE_REGEX.exec(block)) !== null) {
    packages.push({ name: match[1], version: match[2], url: match[3] });
  }
  return packages;
}

function extractContent(block: string): string {
  const idx = block.indexOf(AFFECTED_SECTION);
  return (idx > -1 ? block.slice(0, idx) : block).trim();
}

/**
 * @description changelog.mdx 파일을 파싱하여 changelog entry 목록을 반환합니다.
 * @example
 * ```
 * [
 *   {
 *     date: "2026.03.05",
 *     label: "1.0.0",
 *     contentHtml: "<p>...</p>",
 *     packages: [{ name: "@seed-design/react", version: "1.0.0", url: "https://github.com/seed-design/seed-design/releases/tag/v1.0.0" }]
 *   }
 * ]
 * ```
 */
export async function parseChangelog(raw: string): Promise<ChangelogEntry[]> {
  // Strip frontmatter
  const withoutFrontmatter = raw.replace(/^---[\s\S]*?---\n/, "");

  // Split by date headings (## YYYY.MM.DD)
  const dateSections = withoutFrontmatter.split(/(?=^## \d{4}\.\d{2}\.\d{2})/m);

  const entries: ChangelogEntry[] = [];

  for (const section of dateSections) {
    if (!section.trim()) continue;

    const headingMatch = section.match(/^## (\d{4}\.\d{2}\.\d{2})(?:\s+(#\d+))?/);
    if (!headingMatch) continue;

    const date = headingMatch[1];
    const label = headingMatch[2];

    // Remove the heading line and get the body
    const body = section.slice(section.indexOf("\n") + 1);

    // Split into individual entries by ---
    const blocks = body.split(/\n---\n/);

    for (const block of blocks) {
      if (!block.trim()) continue;

      const packages = extractPackages(block);
      const contentMd = extractContent(block);
      if (!contentMd && packages.length === 0) continue;

      const contentHtml = contentMd ? await mdToHtml(contentMd) : "";

      entries.push({ date, label, contentHtml, packages });
    }
  }

  return entries;
}

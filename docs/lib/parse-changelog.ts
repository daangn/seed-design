import { existsSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { rehypeCode } from "fumadocs-core/mdx-plugins";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import type { ShikiTransformer } from "shiki";

const CHANGELOG_FILENAME = "CHANGELOG.md";

export interface ChangelogPackage {
  name: string;
  version: string;
  url: string;
}

export type ChangelogContentBlock =
  | {
      type: "markdown";
      html: string;
      plainText: string;
    }
  | {
      type: "code";
      code: string;
      lang: string;
    };

export interface ChangelogEntry {
  order: number;
  section?: string;
  commitRefs: string[];
  contentBlocks: ChangelogContentBlock[];
  isDependencyOnly: boolean;
  package: ChangelogPackage;
  relatedPackages: ChangelogPackage[];
}

export interface ChangelogSource {
  packageName: string;
  raw: string;
}

const removeBackground: ShikiTransformer = {
  name: "remove-background",
  pre(node) {
    if (node.properties?.style) {
      node.properties.style = (node.properties.style as string)
        .replace(/background-color:[^;]+;?\s*/g, "")
        .trim();
    }
  },
};

const processor = remark()
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeCode, {
    lazy: true,
    themes: { light: "github-light", dark: "github-dark" },
    transformers: [removeBackground],
  })
  .use(rehypeStringify);

const RELATED_PACKAGE_REGEX = /^\s*-\s+(@seed-design\/[^\s@]+)@([^\s]+)\s*$/gm;
const ENTRY_COMMIT_REGEX = /^-\s+([a-f0-9]{7}):/m;
const DEPENDENCY_COMMIT_REGEX = /Updated dependencies \[([a-f0-9]{7})\]/g;
const GITHUB_COMMIT_BASE_URL = "https://github.com/daangn/seed-design/commit";

// ── I/O ──────────────────────────────────────────────────────────────────────

/** @description `packages/` 디렉토리가 있는 워크스페이스 루트를 찾아 반환합니다. */
function resolveWorkspaceRoot(startDir: string) {
  const candidates = [startDir, resolve(startDir, "..")];

  for (const candidate of candidates) {
    if (existsSync(join(candidate, "packages"))) {
      return candidate;
    }
  }

  throw new Error(`packages 디렉토리를 찾을 수 없습니다: ${startDir}`);
}

/** @description `packages/` 디렉토리를 재귀 탐색해 CHANGELOG.md 경로 목록을 반환합니다. */
async function collectPackageChangelogPaths(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const paths = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = join(dir, entry.name);

      if (entry.isDirectory()) {
        return collectPackageChangelogPaths(entryPath);
      }

      if (entry.isFile() && entry.name === CHANGELOG_FILENAME) {
        return [entryPath];
      }

      return [];
    }),
  );

  return paths.flat();
}

/** @description 각 패키지의 CHANGELOG.md와 package.json을 읽어 `{ packageName, raw }[]` 형태로 반환합니다. */
export async function loadChangelogSources(rootDir: string): Promise<ChangelogSource[]> {
  const workspaceRoot = resolveWorkspaceRoot(rootDir);
  const changelogPaths = (
    await collectPackageChangelogPaths(join(workspaceRoot, "packages"))
  ).sort();

  const sources = await Promise.all(
    changelogPaths.map(async (changelogPath) => {
      const packageJsonPath = join(dirname(changelogPath), "package.json");

      if (!existsSync(packageJsonPath)) {
        return null;
      }

      const [raw, packageJsonRaw] = await Promise.all([
        readFile(changelogPath, "utf-8"),
        readFile(packageJsonPath, "utf-8"),
      ]);

      const packageJson = JSON.parse(packageJsonRaw) as { name?: string };
      if (!packageJson.name?.startsWith("@seed-design/")) {
        return null;
      }

      return {
        packageName: packageJson.name,
        raw,
      };
    }),
  );

  return sources.filter((source): source is ChangelogSource => source !== null);
}

// ── Parsing ───────────────────────────────────────────────────────────────────

/** @description CHANGELOG.md raw 텍스트를 `## 1.2.3` 단위의 버전 섹션 배열로 분리합니다. */
export function splitVersionSections(raw: string): Array<{ version: string; body: string }> {
  const sections = raw
    .replace(/^# .+\n+/, "")
    .split(/(?=^## )/m)
    .map((section) => section.trim())
    .filter(Boolean);

  return sections.flatMap((section) => {
    const match = section.match(/^## ([^\n]+)\n*/);
    if (!match) return [];

    return [
      {
        version: match[1].trim(),
        body: section.slice(match[0].length).trim(),
      },
    ];
  });
}

/** @description 버전 섹션 본문을 `### Minor Changes` 등의 변경 유형 섹션 배열로 분리합니다. `###`이 없으면 섹션 없이 본문만 반환합니다. */
function splitChangeSections(body: string): Array<{ section?: string; body: string }> {
  const parts = body
    .split(/(?=^### )/m)
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length === 0) return [];

  return parts.flatMap((part) => {
    const match = part.match(/^### ([^\n]+)\n*/);
    if (!match) {
      return [{ body: part }];
    }

    return [
      {
        section: match[1].trim(),
        body: part.slice(match[0].length).trim(),
      },
    ];
  });
}

/** @description 변경 섹션 본문을 `- abc123: ...` 단위의 개별 항목 블록으로 분리합니다. */
function splitEntryBlocks(body: string): string[] {
  const trimmed = body.trim();
  if (!trimmed) return [];

  if (!trimmed.startsWith("- ")) {
    return [trimmed];
  }

  return trimmed
    .split(/\n(?=- )/)
    .map((block) => block.trim())
    .filter(Boolean);
}

// ── Per-entry processing ──────────────────────────────────────────────────────

/** @description 항목 블록에서 커밋 해시 ref 목록을 추출합니다. 항목 자체의 커밋과 의존성 업데이트 커밋을 모두 포함합니다. */
function extractCommitRefs(block: string): string[] {
  const refs = new Set<string>();

  const entryMatch = block.match(ENTRY_COMMIT_REGEX);
  if (entryMatch) {
    refs.add(entryMatch[1]);
  }

  let dependencyMatch: RegExpExecArray | null;
  DEPENDENCY_COMMIT_REGEX.lastIndex = 0;

  // biome-ignore lint/suspicious/noAssignInExpressions: 커밋 ref 추출에 사용
  while ((dependencyMatch = DEPENDENCY_COMMIT_REGEX.exec(block)) !== null) {
    refs.add(dependencyMatch[1]);
  }

  return [...refs];
}

/** @description 항목 블록이 의존성 업데이트만 포함하는지 판별합니다. */
function isDependencyOnlyBlock(block: string): boolean {
  return /^-\s+Updated dependencies(?:\s+\[[a-f0-9]{7}\])?/m.test(block.trim());
}

/** @description GitHub 커밋 URL을 반환합니다. */
function getCommitUrl(commitRef: string) {
  return `${GITHUB_COMMIT_BASE_URL}/${commitRef}`;
}

/** @description 항목 블록의 커밋 해시를 GitHub 링크로 변환하고, `abc123:` 접두사를 제거해 표시용 텍스트로 가공합니다. */
function formatDisplayBlock(
  block: string,
  commitRefs: string[],
  isDependencyOnly: boolean,
): string {
  if (isDependencyOnly || commitRefs.length === 0) {
    return block;
  }

  const [primaryCommitRef] = commitRefs;
  const commitLink = `[\`${primaryCommitRef}\`](${getCommitUrl(primaryCommitRef)})`;

  if (ENTRY_COMMIT_REGEX.test(block)) {
    const normalizedBlock = block.replace(/^(-\s+)([a-f0-9]{7}):\s*/, `$1`);
    const idx = normalizedBlock.indexOf("\n");
    return idx === -1
      ? `${normalizedBlock} ${commitLink}`
      : `${normalizedBlock.slice(0, idx)} ${commitLink}\n${normalizedBlock.slice(idx + 1)}`;
  }

  const idx = block.indexOf("\n");
  return idx === -1
    ? `${block} ${commitLink}`
    : `${block.slice(0, idx)} ${commitLink}\n${block.slice(idx + 1)}`;
}

/** @description 마크다운 문자열을 HTML로 변환합니다. */
async function mdToHtml(md: string): Promise<string> {
  const result = await processor.process(md);
  return String(result);
}

function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

/** @description 단일 `<li>` 항목만 있는 `<ul>` 태그를 벗겨냅니다. 단일 항목 변경사항의 불필요한 리스트 래핑을 제거합니다. */
function unwrapSingleListItem(html: string): string {
  if (!html.startsWith("<ul>")) return html.trim();

  return html
    .replace(/^<ul>\s*<li>/, "")
    .replace(/<\/li>\s*<\/ul>\s*$/, "")
    .trim();
}

function escapeRegex(source: string): string {
  return source.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** @description 마크다운 항목을 prose/code block 토큰으로 분리합니다. fenced code는 구조화된 블록으로 보존합니다. */
async function parseContentBlocks(markdown: string): Promise<ChangelogContentBlock[]> {
  const lines = markdown.split("\n");
  const blocks: ChangelogContentBlock[] = [];
  const markdownBuffer: string[] = [];

  const flushMarkdown = async () => {
    const chunk = markdownBuffer.join("\n").trim();
    markdownBuffer.length = 0;

    if (!chunk) return;

    const html = unwrapSingleListItem(await mdToHtml(chunk));
    if (!html) return;

    blocks.push({
      type: "markdown",
      html,
      plainText: stripHtmlTags(html),
    });
  };

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const fenceMatch = line.match(/^(\s*)```([^`\s]*)\s*$/);

    if (!fenceMatch) {
      markdownBuffer.push(line);
      continue;
    }

    await flushMarkdown();

    const indent = fenceMatch[1];
    const closingFencePattern = new RegExp(`^${escapeRegex(indent)}\\s*\\\`\\\`\\\`\\s*$`);
    const codeLines: string[] = [];

    for (index += 1; index < lines.length; index += 1) {
      const codeLine = lines[index];
      if (closingFencePattern.test(codeLine)) {
        break;
      }

      codeLines.push(codeLine.startsWith(indent) ? codeLine.slice(indent.length) : codeLine);
    }

    blocks.push({
      type: "code",
      code: codeLines.join("\n"),
      lang: fenceMatch[2] || "text",
    });
  }

  await flushMarkdown();

  return blocks;
}

/** @description npm 패키지 버전 URL을 반환합니다. */
function getPackageVersionUrl(name: string, version: string) {
  return `https://npmjs.com/package/${name}/v/${version}`;
}

/** @description 항목 블록에서 `Updated dependencies` 하위의 관련 패키지 목록을 추출합니다. */
function extractRelatedPackages(block: string): ChangelogPackage[] {
  const packages: ChangelogPackage[] = [];
  let match: RegExpExecArray | null;

  RELATED_PACKAGE_REGEX.lastIndex = 0;

  // biome-ignore lint/suspicious/noAssignInExpressions: 패키지 의존성 추출에 사용
  while ((match = RELATED_PACKAGE_REGEX.exec(block)) !== null) {
    packages.push({
      name: match[1],
      version: match[2],
      url: getPackageVersionUrl(match[1], match[2]),
    });
  }

  return Array.from(
    new Map(packages.map((pkg) => [`${pkg.name}@${pkg.version}`, pkg] as const)).values(),
  );
}

// ── Entry points ──────────────────────────────────────────────────────────────

/** @description `ChangelogSource[]`를 파싱해 `ChangelogEntry[]`로 변환합니다. */
export async function parseChangelogSources(sources: ChangelogSource[]): Promise<ChangelogEntry[]> {
  const parsedEntries: ChangelogEntry[] = [];
  let order = 0;

  for (const source of sources) {
    const versionSections = splitVersionSections(source.raw);

    for (const versionSection of versionSections) {
      const changeSections = splitChangeSections(versionSection.body);
      const basePackage: ChangelogPackage = {
        name: source.packageName,
        version: versionSection.version,
        url: getPackageVersionUrl(source.packageName, versionSection.version),
      };

      for (const changeSection of changeSections) {
        const entryBlocks = splitEntryBlocks(changeSection.body);

        for (const block of entryBlocks) {
          const commitRefs = extractCommitRefs(block);
          const isDependencyOnly = isDependencyOnlyBlock(block);
          const displayBlock = formatDisplayBlock(block, commitRefs, isDependencyOnly);
          const contentBlocks = await parseContentBlocks(displayBlock);
          if (contentBlocks.length === 0) continue;

          parsedEntries.push({
            order: order++,
            section: changeSection.section,
            commitRefs,
            contentBlocks,
            isDependencyOnly,
            package: basePackage,
            relatedPackages: extractRelatedPackages(block),
          });
        }
      }
    }
  }

  return parsedEntries;
}

/** @description 모든 packages 디렉토리의 CHANGELOG.md 파일을 읽어 changelog entry 목록을 반환합니다. */
export async function parseChangelog(rootDir: string): Promise<ChangelogEntry[]> {
  const sources = await loadChangelogSources(rootDir);
  return parseChangelogSources(sources);
}

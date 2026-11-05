import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const sections = ["ai-integration", "breeze", "docs", "lynx", "react"] as const;

interface FullTextEntry {
  pagePath: string;
  text: string;
}

export function convertLLMTextToFullText(input: string, contentDir: string): FullTextEntry {
  const header = input.match(/^# ([^\n]+)\nURL: [^\n]+\nSource: ([^\n]+)\n\n/);
  if (!header) throw new Error("페이지별 LLM 문서 헤더를 찾을 수 없습니다.");

  const [, title, sourceUrl] = header;
  const contentPathMarker = `/docs/content/${contentDir}/`;
  const markerIndex = sourceUrl.indexOf(contentPathMarker);
  if (markerIndex < 0) {
    throw new Error(`LLM 문서의 소스 경로가 예상과 다릅니다: ${sourceUrl}`);
  }

  const pagePath = decodeURIComponent(sourceUrl.slice(markerIndex + contentPathMarker.length));
  return {
    pagePath,
    text: `file: ${pagePath}\n\n# ${title}\n\n${input.slice(header[0].length)}`,
  };
}

export function combineLLMTexts(inputs: string[], contentDir: string): string {
  if (inputs.length === 0) {
    throw new Error(`합칠 페이지별 LLM 문서가 없습니다: ${contentDir}`);
  }

  return inputs
    .map((input) => convertLLMTextToFullText(input, contentDir))
    .sort((a, b) => a.pagePath.localeCompare(b.pagePath))
    .map((entry) => entry.text)
    .join("\n\n---\n\n");
}

async function generateSection(section: (typeof sections)[number]): Promise<{
  section: string;
  fileCount: number;
  byteLength: number;
}> {
  const inputDirectory = path.join(process.cwd(), "out", "llms", section);
  const glob = new Bun.Glob("**/*.txt");
  const filePaths = Array.from(glob.scanSync({ cwd: inputDirectory, onlyFiles: true }));
  const inputs = await Promise.all(
    filePaths.map((filePath) => readFile(path.join(inputDirectory, filePath), "utf8")),
  );
  const output = combineLLMTexts(inputs, section);
  const outputPath = path.join(process.cwd(), "out", section, "llms-full.txt");

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, output);

  return { section, fileCount: inputs.length, byteLength: Buffer.byteLength(output) };
}

if (import.meta.main) {
  const startedAt = performance.now();
  const results = await Promise.all(sections.map(generateSection));
  const summary = results
    .map(({ section, fileCount, byteLength }) => `${section} ${fileCount}개/${byteLength}바이트`)
    .join(", ");

  console.log(
    `llms-full.txt 생성 완료 (${Math.round(performance.now() - startedAt)}ms): ${summary}`,
  );
}

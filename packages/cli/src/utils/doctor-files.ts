import path from "path";
import fs from "fs-extra";
import { glob } from "tinyglobby";

// doctor-core의 ScannedFile과 구조적으로 동일하지만, cli 테스트가 doctor 패키지
// 빌드 없이 돌 수 있도록 이 파일은 doctor-core를 import하지 않는다.
export interface DiscoveredFile {
  /** 스캔 루트(cwd) 기준 posix 상대 경로 */
  path: string;
  content: string;
}

const SOURCE_EXTENSIONS_PATTERN = "**/*.{ts,tsx,js,jsx}";

const DEFAULT_EXCLUDES = [
  "**/node_modules/**",
  "**/dist/**",
  "**/build/**",
  "**/out/**",
  "**/.next/**",
  "**/coverage/**",
  "**/.git/**",
  "**/.storybook/**",
  "**/storybook-static/**",
];

function toPosix(value: string): string {
  return value.split(path.sep).join("/");
}

/** 입력 경로(파일·디렉토리)를 glob 패턴으로 바꾼다. 디렉토리는 소스 확장자 패턴으로 확장한다. */
async function toPattern(cwd: string, input: string): Promise<string> {
  const resolved = path.resolve(cwd, input);
  const relative = toPosix(path.relative(cwd, resolved));

  try {
    const stat = await fs.stat(resolved);
    if (stat.isDirectory()) {
      return relative === ""
        ? SOURCE_EXTENSIONS_PATTERN
        : `${relative}/${SOURCE_EXTENSIONS_PATTERN}`;
    }
  } catch {
    // 존재하지 않는 경로는 패턴 그대로 glob에 넘긴다 (매치 0개로 자연 처리)
  }

  return relative;
}

/**
 * 진단 대상 소스 파일을 찾아 내용을 읽는다.
 * 결과는 경로 오름차순으로 정렬한다 — 같은 프로젝트는 항상 같은 순서(결정론).
 */
export async function discoverSourceFiles({
  cwd,
  paths = [],
  ignore = [],
}: {
  cwd: string;
  /** 스캔 범위를 좁힐 파일·디렉토리 목록. 비어 있으면 cwd 전체 */
  paths?: string[];
  /** 설정에서 온 추가 제외 glob */
  ignore?: string[];
}): Promise<DiscoveredFile[]> {
  const patterns = paths.length
    ? await Promise.all(paths.map((input) => toPattern(cwd, input)))
    : [SOURCE_EXTENSIONS_PATTERN];

  const matches = await glob(patterns, {
    cwd,
    ignore: [...DEFAULT_EXCLUDES, ...ignore],
    onlyFiles: true,
    dot: false,
  });

  const sortedPaths = matches.map(toPosix).sort();

  return Promise.all(
    sortedPaths.map(async (relativePath) => ({
      path: relativePath,
      content: await fs.readFile(path.resolve(cwd, relativePath), "utf8"),
    })),
  );
}

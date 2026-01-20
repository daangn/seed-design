import { readFileSync } from "fs";

// ===== 타입 정의 =====
interface ToolUseInput {
  session_id: string;
  cwd: string;
  tool_name: string;
  tool_input: {
    filePath?: string;
    path?: string;
    file_path?: string;
    [key: string]: unknown;
  };
}

// ===== 생성 파일 패턴 =====
const GENERATED_FILE_PATTERNS: Array<{
  pattern: RegExp;
  source: string;
  regenerateCommand: string;
}> = [
  {
    pattern: /packages\/css\/.*\.(ts|css)$/,
    source: "packages/rootage/",
    regenerateCommand: "bun generate",
  },
  {
    pattern: /.*\/vars\.ts$/,
    source: "packages/rootage/",
    regenerateCommand: "bun generate",
  },
  {
    pattern: /docs\/registry\/.*\.json$/,
    source: "docs/registry/*.ts",
    regenerateCommand: "bun generate:registry",
  },
  {
    pattern: /.*\/dist\/.*/,
    source: "해당 패키지 소스",
    regenerateCommand: "bun build",
  },
  {
    pattern: /.*\/__generated__\/.*/,
    source: "생성 스크립트",
    regenerateCommand: "해당 generate 스크립트",
  },
];

// ===== 메인 로직 =====
try {
  // 1. stdin에서 입력 읽기
  const input: ToolUseInput = JSON.parse(readFileSync(0, "utf-8"));

  // 2. Write 또는 Edit 도구인지 확인
  const isWriteTool = ["Write", "Edit", "MultiEdit"].includes(input.tool_name);
  if (!isWriteTool) {
    process.exit(0);
  }

  // 3. 파일 경로 추출
  const filePath = input.tool_input.filePath || input.tool_input.path || input.tool_input.file_path;
  if (!filePath || typeof filePath !== "string") {
    process.exit(0);
  }

  // 4. 생성 파일 패턴 매칭
  for (const { pattern, source, regenerateCommand } of GENERATED_FILE_PATTERNS) {
    if (pattern.test(filePath)) {
      const message = `
╔════════════════════════════════════════════════════════════╗
║  ⛔ 생성 파일 수정 감지                                    ║
╚════════════════════════════════════════════════════════════╝

수정하려는 파일:
  ${filePath}

이 파일은 자동 생성됩니다.
직접 수정하지 말고 소스를 수정하세요:
  → ${source}

재생성 명령어:
  $ ${regenerateCommand}

💡 @generated-files-guard 스킬을 참고하세요.
`;

      console.log(
        JSON.stringify({
          decision: "block",
          reason: message,
        }),
      );
      process.exit(0);
    }
  }

  // 5. 생성 파일이 아니면 허용
  // (출력 없이 종료하면 허용)
} catch {
  // 에러가 나도 hook이 실행을 방해하지 않도록 조용히 처리
  // console.error('Generated files guard error:', error)
}

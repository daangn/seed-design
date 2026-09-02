import { execFileSync } from "child_process";
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

/**
 * 어떤 파일이 생성물인지는 .gitattributes의 linguist-generated가 단일 소스다.
 * 여기에 경로 패턴을 다시 적지 않는다. check-attr는 순수 패턴 매칭이라
 * 아직 만들어지지 않은 파일에도 답한다.
 */
function isGenerated(cwd: string, filePath: string): boolean {
  const output = execFileSync("git", ["check-attr", "linguist-generated", "--", filePath], {
    cwd,
    encoding: "utf-8",
    stdio: ["ignore", "pipe", "ignore"],
  });
  return output.trimEnd().endsWith(": set");
}

// .gitattributes가 답하지 못하는 것만 남긴다: 무엇으로 되돌리는가.
function regenerateCommand(filePath: string): string {
  if (/(^|\/)(lib|dist)\//.test(filePath)) return "bun packages:build";
  if (/(^|\/)docs\//.test(filePath)) return "bun --filter @seed-design/docs generate:all";
  return "bun generate:all";
}

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
  if (typeof filePath !== "string" || filePath.length === 0) {
    process.exit(0);
  } else if (isGenerated(input.cwd, filePath)) {
    const message = `
╔════════════════════════════════════════════════════════════╗
║  ⛔ 생성 파일 수정 감지                                    ║
╚════════════════════════════════════════════════════════════╝

수정하려는 파일:
  ${filePath}

.gitattributes가 이 경로를 linguist-generated로 표시했습니다.
직접 수정하지 말고 원천 파일을 수정하세요.
원천과 생성 명령은 TECH.md의 「생성 파이프라인」 표를 보세요.

재생성 명령어:
  $ ${regenerateCommand(filePath)}

이 파일이 생성물이 아니라면 .gitattributes를 고치세요.
`;

    console.error(message);
    process.exit(2);
  }
} catch {
  // 에러 시 조용히 처리하여 hook이 실행을 방해하지 않도록
}

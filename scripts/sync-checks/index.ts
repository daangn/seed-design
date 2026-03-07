import { Glob } from "bun";
import { allChecks } from "./checks";
import { runAllChecks } from "./run-checks";
import { getChangedFiles, getNewDirectories } from "./utils/git";
import { formatMarkdownReport, postPrComment } from "./utils/report";

async function main() {
  const prNumber = process.env.PR_NUMBER;
  const baseRef = process.env.BASE_REF ?? "main";
  const repo = process.env.GITHUB_REPOSITORY ?? "";

  // 변경된 파일 목록
  const changedFiles = await getChangedFiles(baseRef);
  if (changedFiles.length === 0) {
    console.log("변경된 파일이 없습니다.");
    return;
  }

  // 새 디렉토리 목록
  const newDirs = await getNewDirectories(baseRef);

  // fileExists: glob 패턴 지원
  const fileExists = (pattern: string): boolean => {
    if (pattern.includes("*")) {
      const glob = new Glob(pattern);
      const matches = glob.scanSync(".");
      for (const _match of matches) {
        return true;
      }
      return false;
    }
    return Bun.file(pattern).size > 0;
  };

  const isNewDirectory = (path: string): boolean => newDirs.has(path);

  // 체크 실행
  const results = await runAllChecks(allChecks, changedFiles, {
    fileExists,
    isNewDirectory,
  });

  // 리포트 생성
  const report = formatMarkdownReport(results);
  console.log(report);

  // PR 코멘트 게시
  if (prNumber && repo) {
    await postPrComment(report, prNumber, repo);
    console.log(`\nPR #${prNumber}에 코멘트를 게시했습니다.`);
  }

  // 결과 요약
  const warnings = results.filter((r) => r.severity === "warning");
  if (warnings.length > 0) {
    console.log(`\n⚠️ ${warnings.length}개 동기화 경고`);
  }
}

main().catch((err) => {
  console.error("Cross-package sync check 실패:", err);
  process.exit(1);
});

import type { CheckResult, CustomCheck, PairSyncCheck, SyncCheck } from "./types";

interface CheckOptions {
  fileExists: (pattern: string) => boolean;
  isNewDirectory: (path: string) => boolean;
}

export function runPairCheck(
  check: PairSyncCheck,
  changedFiles: string[],
  opts: CheckOptions,
): CheckResult[] {
  // 1. source.pattern으로 changedFiles에서 컴포넌트 이름 추출
  const componentNames = new Set<string>();
  const sourceFileMap = new Map<string, string>();

  for (const file of changedFiles) {
    const match = file.match(check.source.pattern);
    if (!match?.[1]) continue;

    const name = match[1];

    // exclude 필터링
    if (check.source.exclude?.includes(name)) continue;

    // detectNewOnly면 새 디렉토리만 필터
    if (check.detectNewOnly) {
      const sourceDir = file.substring(0, file.lastIndexOf("/"));
      if (!opts.isNewDirectory(sourceDir)) continue;
    }

    componentNames.add(name);
    if (!sourceFileMap.has(name)) {
      sourceFileMap.set(name, file);
    }
  }

  // 2. 각 컴포넌트 × 각 타겟에 대해 체크
  const results: CheckResult[] = [];

  for (const name of componentNames) {
    for (const target of check.targets) {
      const expectedPath = target.path(name);

      // onlyWhenTargetExists면 타겟이 이미 있을 때만 체크
      if (check.onlyWhenTargetExists && !opts.fileExists(expectedPath)) {
        continue;
      }

      // 타겟 경로가 changedFiles에 포함되어 있으면 통과
      const targetInChanged = changedFiles.some((f) =>
        expectedPath.includes("*")
          ? matchGlobSimple(f, expectedPath)
          : f === expectedPath || f.startsWith(expectedPath),
      );

      if (targetInChanged) continue;

      // 타겟 파일이 이미 존재하면 통과
      if (opts.fileExists(expectedPath)) continue;

      results.push({
        checkId: check.id,
        targetId: target.id,
        targetName: target.name,
        severity: target.severity,
        component: name,
        sourceFile: sourceFileMap.get(name) ?? "",
        expectedTarget: expectedPath,
        message: target.message,
      });
    }
  }

  return results;
}

export async function runAllChecks(
  checks: SyncCheck[],
  changedFiles: string[],
  opts: CheckOptions,
): Promise<CheckResult[]> {
  const results: CheckResult[] = [];

  for (const check of checks) {
    // 관련 파일이 변경되었는지 먼저 확인
    const isRelevant = isCheckRelevant(check, changedFiles);
    if (!isRelevant) continue;

    if (check.kind === "pair") {
      results.push(...runPairCheck(check, changedFiles, opts));
    } else {
      results.push(...(await (check as CustomCheck).run(changedFiles)));
    }
  }

  return results;
}

function isCheckRelevant(check: SyncCheck, changedFiles: string[]): boolean {
  if (check.kind === "pair") {
    return changedFiles.some((f) => check.source.pattern.test(f));
  }
  return changedFiles.some((f) => check.relevantPaths.some((p) => p.test(f)));
}

/** 간단한 glob 매칭 (`**` 지원) */
function matchGlobSimple(filePath: string, pattern: string): boolean {
  const regex = pattern
    .replace(/\*\*/g, "{{GLOBSTAR}}")
    .replace(/\*/g, "[^/]*")
    .replace(/{{GLOBSTAR}}/g, ".*");
  return new RegExp(`^${regex}$`).test(filePath);
}

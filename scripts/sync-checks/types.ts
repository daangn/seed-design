export interface SyncTarget {
  id: string;
  name: string;
  /** glob 패턴 가능 (e.g. `docs/content/docs/components/**\/name.mdx`) */
  path: (componentName: string) => string;
  severity: "warning" | "info";
  message: string;
}

/** 다중 타겟 페어링 체크: "A가 바뀌면 B도 바뀌어야" */
export interface PairSyncCheck {
  kind: "pair";
  id: string;
  name: string;
  source: {
    pattern: RegExp;
    exclude?: string[];
  };
  targets: SyncTarget[];
  /** true면 새 디렉토리 추가만 감지, 기존 수정은 무시 */
  detectNewOnly?: boolean;
  /** true면 타겟 파일이 이미 있을 때만 체크 */
  onlyWhenTargetExists?: boolean;
}

/** 커스텀 로직 체크 */
export interface CustomCheck {
  kind: "custom";
  id: string;
  name: string;
  severity: "warning" | "info";
  relevantPaths: RegExp[];
  run(changedFiles: string[]): Promise<CheckResult[]>;
}

export type SyncCheck = PairSyncCheck | CustomCheck;

export interface CheckResult {
  checkId: string;
  targetId: string;
  targetName: string;
  severity: "warning" | "info";
  component: string;
  sourceFile: string;
  expectedTarget: string;
  message: string;
}

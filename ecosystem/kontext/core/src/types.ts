/** kontext.yaml 스키마 타입 */
export interface KontextConfig {
  apiVersion: "kontext/v1";
  /** 이 패키지 전체에서 무시할 glob 패턴 (barrel, deprecated 등) */
  ignore?: string[];
  relations: Relation[];
}

export interface Relation {
  /** 이 패키지 내 감시할 파일의 glob 패턴 */
  when: string;
  /** when 매칭에서 제외할 glob 패턴 */
  exclude?: string[];
  /** 영향받는 파일 목록 */
  affects: AffectedEntry[];
  /** 특정 파일에 대해 기본 affects를 덮어쓰는 규칙 */
  overrides?: Override[];
}

export interface Override {
  /** 이 패턴에 매칭되는 파일에 대해 기본 affects 대신 이 affects를 적용 */
  match: string;
  /** 덮어쓸 affects 목록 */
  affects: AffectedEntry[];
}

export interface AffectedEntry {
  /** 영향받는 파일 경로 (레포 루트 기준). {id}=kebab, {Id}=Pascal 템플릿 지원 */
  path: string;
  /** 왜 영향받는지 설명 */
  reason?: string;
  /** 자동 생성 파일인지 */
  generated?: boolean;
  /** generated=true일 때 실행할 생성 명령 */
  command?: string;
  /** 없어도 check에서 경고하지 않음 */
  optional?: boolean;
}

/** 빌드된 그래프 노드 */
export interface GraphNode {
  /** 고유 ID (e.g., "packages/rootage/components/button.yaml") */
  id: string;
  /** 이 노드가 속한 패키지 디렉토리 (e.g., "packages/rootage") */
  packageDir: string;
  /** 파일이 실제 존재하는지 */
  exists: boolean;
}

/** 빌드된 그래프 엣지 */
export interface GraphEdge {
  /** 소스 파일 (변경 원인) */
  source: string;
  /** 타겟 파일 (영향받는 쪽) */
  target: string;
  /** 왜 연결됐는지 */
  reason?: string;
  /** 자동 생성 파일인지 */
  generated: boolean;
  /** generated일 때 실행할 명령 */
  command?: string;
  /** 없어도 check에서 경고하지 않음 */
  optional: boolean;
  /** 이 엣지를 정의한 kontext.yaml 경로 */
  definedBy: string;
}

/** 빌드된 전체 그래프 */
export interface KontextGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  /** 발견된 패키지 목록 (kontext.yaml이 있는 디렉토리) */
  packages: string[];
  /** 그래프 빌드 시각 */
  builtAt: string;
}

/** kontext deps 명령의 결과 항목 */
export interface DepResult {
  path: string;
  reason?: string;
  generated: boolean;
  command?: string;
  exists: boolean;
}

/** kontext check 명령의 결과 항목 */
export interface CheckResult {
  /** watch 패턴에 매칭된 소스 파일 */
  source: string;
  /** 이 결과를 정의한 kontext.yaml 경로 */
  definedBy: string;
  /** 전체 affects 수 */
  total: number;
  /** 존재하는 파일 수 */
  existing: number;
  /** 누락된 파일 목록 */
  missing: string[];
}

/** kontext lint — 발견된 미선언 관계 */
export interface LintSuggestion {
  source: string;
  target: string;
  layer: "naming" | "import" | "co-change";
  confidence: number;
  detail: string;
}

/** kontext lint — stale 관계 경고 */
export interface LintStaleWarning {
  source: string;
  target: string;
  reason: string;
}

/** kontext lint — 전체 결과 */
export interface LintResult {
  suggestions: LintSuggestion[];
  staleWarnings: LintStaleWarning[];
}

/** kontext lint — 옵션 */
export interface LintOptions {
  rootDir: string;
  /** git log에서 분석할 커밋 수 (기본 200) */
  commitCount?: number;
  /** co-change Jaccard 임계값 (기본 0.7) */
  jaccardThreshold?: number;
  /** 최소 co-occurrence 횟수 (기본 3) */
  minCoOccurrences?: number;
  /** 무시할 파일 패턴 */
  ignorePatterns?: string[];
}

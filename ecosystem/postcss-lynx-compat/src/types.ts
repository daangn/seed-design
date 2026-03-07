export interface LynxCompatConfig {
  /** 단순 제거할 프로퍼티 → { 프로퍼티명: 제거 이유 } */
  remove?: Record<string, string>;

  /** 셀렉터 치환 규칙 → { from: to } */
  transformSelectors?: Record<string, string>;

  /** 제거할 @media 규칙 패턴 (params 에 포함된 문자열 매칭) */
  removeAtRules?: string[];

  /** 포함된 룰을 전체 제거할 셀렉터 패턴 */
  removeSelectors?: string[];

  /** 콤마 그룹에서 해당 pseudo-class 포함 셀렉터만 제거 (data-* 대안 유지) */
  filterPseudoClasses?: string[];

  /** 빌드 에러 + 대안 제시할 프로퍼티 → { 프로퍼티명: 대안 메시지 } */
  suggestions?: Record<string, string>;

  /** Lynx가 지원하는 프로퍼티 화이트리스트 */
  supportedProperties?: string[];

  /** clamp() 처리 전략 */
  clampStrategy?: "min" | "preferred" | "max";

  /** true이면 미등록 프로퍼티를 경고로 처리 (기본: false → 에러) */
  warnOnly?: boolean;

  /** shorthand → longhand 확장 규칙 → { shorthand: (value) => Declaration[] } */
  expandShorthands?: Record<string, (value: string) => Array<{ prop: string; value: string }>>;

  /** 텍스트 슬롯 분리 설정 — 단일 recipe CSS를 view/text로 분리 */
  textSlot?: {
    /** text 슬롯 클래스 접미사 (예: "__text") */
    suffix: string;
    /** text 전용 프로퍼티 */
    textProperties: string[];
    /** view/text 양쪽에 포함할 프로퍼티 */
    sharedProperties: string[];
  };
}

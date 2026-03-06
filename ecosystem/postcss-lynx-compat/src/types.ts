export interface LynxCompatConfig {
  /** 단순 제거할 프로퍼티 → { 프로퍼티명: 제거 이유 } */
  remove?: Record<string, string>;

  /** 셀렉터 치환 규칙 → { from: to } */
  transformSelectors?: Record<string, string>;

  /** 제거할 @media 규칙 패턴 (params 에 포함된 문자열 매칭) */
  removeAtRules?: string[];

  /** 포함된 룰을 전체 제거할 셀렉터 패턴 */
  removeSelectors?: string[];

  /** 빌드 에러 + 대안 제시할 프로퍼티 → { 프로퍼티명: 대안 메시지 } */
  suggestions?: Record<string, string>;

  /** Lynx가 지원하는 프로퍼티 화이트리스트 */
  supportedProperties?: string[];

  /** clamp() 처리 전략 */
  clampStrategy?: "min" | "preferred" | "max";

  /** true이면 미등록 프로퍼티를 경고로 처리 (기본: false → 에러) */
  warnOnly?: boolean;
}

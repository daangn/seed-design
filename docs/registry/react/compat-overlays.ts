/**
 * Compat manifest의 Layer 2 — 사람이 큐레이션하는 호환성 보정 데이터.
 *
 * Layer 1(generate-compat-manifest.ts가 npm·registry에서 자동 수집하는 선언 데이터)만으로는
 * 선언이 누락됐거나 부정확했던 구간을 설명할 수 없어서, 이 파일의 항목들이 그 위에 덮입니다.
 * 머지 규칙: 소비자(CLI compat, doctor 스킬, docs 표)는 declared ⊕ overlays로 계산하며
 * 오버레이가 선언보다 우선합니다.
 *
 * 항목 추가 시점:
 * - 과거 구간 일괄 큐레이션(재구성 스크립트 초안 + 사람 검수)은 후속 PR에서 진행
 * - 이후로는 사고(known-bad)나 보정(correction) 발생 시 수기로 추가
 */
export type CompatOverlay =
  /** peer 선언이 누락된 구간을 소급 기입 */
  | {
      kind: "backfill";
      package: string;
      versionRange: string;
      peers: Record<string, string>;
      reason: string;
    }
  /** 선언이 존재하지만 실제 정책과 다른 구간을 교정 */
  | {
      kind: "correction";
      package: string;
      versionRange: string;
      peers: Record<string, string>;
      reason: string;
    }
  /** 선언상 호환이지만 실제로 깨지는 것이 확인된 조합 */
  | {
      kind: "known-bad";
      packages: Record<string, string>;
      reason: string;
    }
  /** 호환이 단절되는 경계 버전 (예: snippet 재설치가 필요한 minor) */
  | {
      kind: "breaking-boundary";
      package: string;
      version: string;
      notes: string;
    };

export const compatOverlays: CompatOverlay[] = [
  // 예시 (후속 큐레이션 PR에서 실제 데이터로 채워질 예정):
  // {
  //   kind: "backfill",
  //   package: "@seed-design/react",
  //   versionRange: ">=1.1.0 <1.1.10",
  //   peers: { "@seed-design/css": "~1.1.0" },
  //   reason:
  //     "css peer 선언 누락 구간. react·css가 같은 날 같은 번호로 lockstep 릴리즈되던 시기로, npm 배포 타임스탬프와 git 릴리즈 커밋으로 재구성함",
  // },
];

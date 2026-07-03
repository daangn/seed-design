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
  // ── backfill: 선언 누락 구간 소급 ──
  // 근거: 이 구간의 react·css는 같은 날 같은 번호로 lockstep 릴리즈됨 (npm 배포 타임스탬프로 재구성).
  // same-version 핀이 가장 엄격하지만, 당시 실질 정책이 same-minor 페어링이었으므로 ~1.1.0으로 둔다.
  {
    kind: "backfill",
    package: "@seed-design/react",
    versionRange: ">=1.1.0 <1.1.10",
    peers: { "@seed-design/css": "~1.1.0" },
    reason: "css peer 선언 누락 구간. css와 같은 날 같은 번호로 lockstep 릴리즈되던 시기",
  },

  // ── correction: 과대 선언 교정 ──
  // react 1.2.x의 선언(>=1.1.17, 상한 없음)은 css 1.1.x 조합도 통과시키지만,
  // 실제 정책은 same-minor 페어링이라 마크업↔스타일 드리프트가 생길 수 있다.
  // 참고: react 1.1.10~1.1.28 구간(>=1.1.x 하한만 선언)도 상한이 없긴 하나,
  // 버전마다 하한이 달라 단일 항목으로 교정하면 하한 정보가 약해지므로 v1 큐레이션에서 보류.
  {
    kind: "correction",
    package: "@seed-design/react",
    versionRange: ">=1.2.0 <1.3.0",
    peers: { "@seed-design/css": "~1.2.0" },
    reason: "선언(>=1.1.17)이 과대 — same-minor 페어링 정책 기준으로 교정",
  },

  // ── breaking-boundary: 호환 단절 경계 ──
  // 1.0.0·1.1.0은 CHANGELOG의 "BREAKING CHANGE" 마커에서 기계 추출,
  // 1.2.0은 마커 없이 서술된 변경("1.1 → 1.2 업그레이드 시 snippet 업데이트 필요")을 검수에서 보완.
  {
    kind: "breaking-boundary",
    package: "@seed-design/react",
    version: "1.0.0",
    notes: "Snackbar·SwitchMark·ListHeader 등 다수 snippet 재설치 필요",
  },
  {
    kind: "breaking-boundary",
    package: "@seed-design/css",
    version: "1.0.0",
    notes: "react 1.0.0과 동일 (lockstep 릴리즈)",
  },
  {
    kind: "breaking-boundary",
    package: "@seed-design/react",
    version: "1.1.0",
    notes: "Error State·BottomSheet·TextField·PageBanner snippet 재설치 필요",
  },
  {
    kind: "breaking-boundary",
    package: "@seed-design/css",
    version: "1.1.0",
    notes: "react 1.1.0과 동일 (lockstep 릴리즈)",
  },
  {
    kind: "breaking-boundary",
    package: "@seed-design/react",
    version: "1.2.0",
    notes: "HelpBubble snippet 재설치 필요(내부 구조 변경), SelectBox suffix 마이그레이션",
  },
  {
    kind: "breaking-boundary",
    package: "@seed-design/css",
    version: "1.2.0",
    notes: "react 1.2.0과 동일",
  },

  // 2.0.0은 SemVer 준수의 시작점 — 이후로는 메이저 버전 자체가 경계 역할을 하므로
  // 여기서의 큐레이션은 1.x에서 넘어오는 구간까지만 한다.
  // 근거: docs/content/react/updates/upgrade/v2.mdx, 각 패키지 CHANGELOG 2.0.0 항목
  {
    kind: "breaking-boundary",
    package: "@seed-design/react",
    version: "2.0.0",
    notes:
      "SemVer 준수 시작. BoxProps 등 레이아웃 prop 타입 discriminated union 전환, Bottom Sheet 옵션 정리, Chip Tabs brandSolid 제거 — chip-tabs·snackbar snippet 재설치 권장",
  },
  {
    kind: "breaking-boundary",
    package: "@seed-design/css",
    version: "2.0.0",
    notes:
      "react 2.0.0과 동시 릴리즈. $gradient.fade-layer-* 제거, selectBoxCheckmark recipe 경로 select-box-checkmark로 개명. $color.bg.layer-fill은 2.0.0에서 제거됐다 2.1.0에서 복원 — 업그레이드 가이드 권장 최소는 2.1.0",
  },
  {
    kind: "breaking-boundary",
    package: "@seed-design/stackflow",
    version: "2.0.0",
    notes: "css peer 메이저 상승(^2.0.0). AppScreen 포커스/키보드 동작 변경",
  },

  // known-bad: 기록된 사고 조합 아직 없음 — 실제 깨진 조합이 확인되면 여기에 추가
];

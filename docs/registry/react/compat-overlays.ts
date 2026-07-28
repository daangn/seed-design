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
  {
    kind: "correction",
    package: "@seed-design/react",
    versionRange: ">=1.2.0 <1.3.0",
    peers: { "@seed-design/css": "~1.2.0" },
    reason: "선언(>=1.1.17)이 과대 — same-minor 페어링 정책 기준으로 교정",
  },

  // react 1.0.x는 css를 같은 번호로 정확히 핀했다(react 1.0.5 → css "1.0.5").
  // 릴리즈 툴링이 형제 패키지를 핀한 산물이지 호환 판단이 아니라서, 같은 1.0 라인 안의
  // 패치 드리프트(react 1.0.5 + css 1.0.7)까지 비호환으로 잡히는 과잉 판정이 된다.
  // 바로 위 1.1.0~1.1.9 lockstep 구간을 ~1.1.0으로 둔 것과 같은 기준으로 맞춘다.
  {
    kind: "correction",
    package: "@seed-design/react",
    versionRange: ">=1.0.0 <1.1.0",
    peers: { "@seed-design/css": "~1.0.0" },
    reason: "same-version 핀은 lockstep 릴리즈 툴링의 산물 — same-minor 페어링 정책 기준으로 완화",
  },

  // react 1.1.x는 하한만 선언하고 상한이 없어서 css 1.2.x·2.x까지 통과시킨다.
  // css 1.2.0은 HelpBubble·RadioGroup의 내부 구조를 바꾼 breaking 경계라(아래 breaking-boundary 참고)
  // react 1.1.x + css 1.2.x는 실제로 마크업↔스타일이 어긋난다.
  // 1.2.0 릴리즈 이후에도 1.1 라인은 백포트로 계속 나갔고(css 1.1.23~1.1.27),
  // 그 수정들은 1.2 라인에 별도 버전으로 포워드포트됐다(각각 1.2.5·1.2.4·1.2.11·1.2.14·1.2.15).
  // 즉 하한만 있는 선언은 "백포트 수정이 아직 없는 1.2.x 초반"까지 통과시키는 구멍이기도 한데,
  // css를 1.1 라인으로 묶는 상한을 씌우면 이 구멍도 함께 닫힌다.
  // 하한은 선언마다 다르므로 선언 구간별로 하나씩 둔다(단일 항목으로 묶으면 하한 정보가 사라짐).
  ...(
    [
      [">=1.1.10 <1.1.12", ">=1.1.10"],
      [">=1.1.12 <1.1.13", ">=1.1.12"],
      [">=1.1.13 <1.1.16", ">=1.1.13"],
      [">=1.1.16 <1.1.17", ">=1.1.16"],
      [">=1.1.17 <1.1.23", ">=1.1.17"],
      [">=1.1.23 <1.1.24", ">=1.1.23"],
      [">=1.1.24 <1.2.0", ">=1.1.24"],
    ] as const
  ).map(
    ([versionRange, floor]): CompatOverlay => ({
      kind: "correction",
      package: "@seed-design/react",
      versionRange,
      peers: { "@seed-design/css": `${floor} <1.2.0` },
      reason: "선언에 상한이 없어 css 1.2.x·2.x까지 통과 — 1.1 라인 페어링으로 상한 보정",
    }),
  ),

  // stackflow 1.0.x도 하한만 선언한다. 1.0 유지보수 백포트(1.0.9)는 css 1.2.0이 나온 뒤인
  // 2026-02-12에 배포됐는데 선언은 >=1.0.7이라 css 1.1.x·1.2.x까지 통과시킨다.
  // stackflow 1.1.x와 달리 1.0.x는 1.0 라인 전용이므로 상한을 1.1.0으로 묶는다.
  // (1.1.x는 css 1.1/1.2 두 라인을 함께 지원하므로 상한 대신 아래 known-bad로 다룬다)
  ...(
    [
      [">=1.0.0 <1.0.5", ">=1.0.0"],
      [">=1.0.5 <1.0.9", ">=1.0.5"],
      [">=1.0.9 <1.1.0", ">=1.0.7"],
    ] as const
  ).map(
    ([versionRange, floor]): CompatOverlay => ({
      kind: "correction",
      package: "@seed-design/stackflow",
      versionRange,
      peers: { "@seed-design/css": `${floor} <1.1.0` },
      reason: "선언에 상한이 없어 css 1.1.x 이상까지 통과 — 1.0 라인 페어링으로 상한 보정",
    }),
  ),

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

  // ── known-bad: 실제로 깨지는 것이 확인된 조합 ──
  // css 1.1.25 CHANGELOG(d71e6db)에 명시된 조합. WAAPI 기반 AppScreen 전환(PR #1444)이
  // css 1.1.25 / 1.2.11에 들어가면서, 그 이전 stackflow와 섞으면 전환 애니메이션과
  // AppBar 배경이 깨진다. stackflow 1.1.22+ 는 반대 방향을 선언(>=1.1.25 <1.2.0 || >=1.2.11)으로
  // 막고 있지만, css 쪽은 leaf라 peer 선언이 없어 이 방향은 overlay로만 표현할 수 있다.
  //
  // CHANGELOG는 범위를 "v1.1.16 ~ v1.1.21"로 적었지만, 짝이 되는 JS가 들어간 건 1.1.22라
  // 그 미만은 전부 같은 이유로 깨진다. 1.1.15와 1.1.16이 한 칸 차이로 갈리지 않도록 1.1.0까지 넓힌다.
  // 1.0 라인은 대상이 아니다 — css 1.0.7(2025-10-27)에서 멈춰 WAAPI(2026-05)가 백포트된 적이 없고,
  // stackflow 1.0.x는 위 correction의 <1.1.0 상한 때문에 애초에 css 1.1.25에 닿지 않는다.
  {
    kind: "known-bad",
    packages: {
      "@seed-design/stackflow": ">=1.1.0 <1.1.22",
      "@seed-design/css": ">=1.1.25 <1.2.0 || >=1.2.11",
    },
    reason:
      "css의 WAAPI AppScreen 전환 대응(1.1.25 / 1.2.11)과 그 이전 stackflow 조합 — 화면 전환 애니메이션·AppBar 배경이 깨져요. stackflow를 1.1.22 이상으로 함께 올려주세요",
  },
  // stackflow 1.x는 하한만 선언해 css 2.x까지 통과시킨다. 2.0.0은 메이저 경계라 실제로 깨진다.
  // (react 1.1.x·1.2.x는 위 correction의 상한으로 이미 막힘)
  {
    kind: "known-bad",
    packages: {
      "@seed-design/stackflow": ">=1.0.0 <2.0.0",
      "@seed-design/css": ">=2.0.0",
    },
    reason:
      "stackflow 1.x는 css peer에 상한이 없어 css 2.x도 선언상 통과하지만, 2.0.0은 메이저 경계예요. stackflow도 2.x로 함께 올려주세요",
  },
];

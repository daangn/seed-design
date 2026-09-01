---
name: seed-token-analysis
description: SEED Design 저장소의 한 색상 토큰을 현재 체크아웃 기준으로 읽기 전용 분석한다. Rootage 정의와 mode별 alias, 직접 의존 토큰, 컴포넌트 사용처, 생성 표면을 찾거나 WCAG 2.x 대비를 확인할 때 사용한다.
---

# SEED 토큰 분석

현재 체크아웃의 `packages/rootage/color.yaml`을 기준으로 색상 토큰의 정의, 연결 관계, 생성 결과와 대비를 확인한다. 스크립트는 파일과 Git 상태를 바꾸지 않는다.

## 토큰 지도

색상 토큰 하나를 지정한다.

```bash
bun skills/seed-token-analysis/scripts/token-map.ts '$color.fg.neutral'
```

결과 JSON은 다음 순서로 읽는다.

1. `token`에서 입력을 정규화한 `canonical`과 `state`를 확인한다. `state`는 `matched`, `ambiguous`, `not-found` 중 하나다. `ambiguous`면 `candidates`의 정확한 토큰으로 다시 실행하고, `not-found`면 비슷한 이름을 임의로 선택하지 않는다.
2. `definition`에서 Rootage 원천 경로, 설명과 mode별 원시 값을 확인한다.
3. `resolvedValues`에서 각 mode의 원시 값, alias 연결과 최종 색상 값을 확인한다. 한 mode의 값이 없거나 alias를 끝까지 해석하지 못했다면 다른 mode 값으로 대신하지 않는다.
4. `dependentTokens`에서 대상 토큰을 직접 참조하는 토큰을 확인한다. 이 목록은 전이 의존 관계나 여러 변경의 결합 영향을 계산하지 않는다.
5. `componentUsages`에서 컴포넌트의 변형, 상태, 슬롯, 속성과 근거 경로가 구조화되어 있는지 확인한다.
6. `generatedSurfaces`에서 플랫폼과 패키지별 `status`, 실제 `paths`, 예상 `expectedPaths`를 비교한다. `missing`은 생성 결과를 찾지 못했다는 뜻이며 Rootage 원천을 직접 수정하라는 뜻이 아니다.
7. `warnings`를 확인하고 `readOnly`가 `true`인지 확인한다.

`token.publicNames`가 있으면 CSS 변수와 공개 이름을 확인할 수 있다. 생성 파일은 실제 배포 표면을 확인하는 근거로만 사용하고 직접 수정하지 않는다.

## 대비 검사

전경 토큰 하나와 하나 이상의 배경 토큰을 지정한다. `--background`와 `--theme`은 반복할 수 있고, 반투명 배경 아래의 실제 색상이 필요하면 `--backdrop`을 추가한다. `--theme`을 생략하면 light와 dark를 모두 검사한다. 중복 테마는 제거하고 결과는 light, dark 순서로 반환한다.

```bash
bun skills/seed-token-analysis/scripts/token-contrast.ts \
  --foreground '$color.fg.warning-contrast' \
  --background '$color.bg.warning-solid' \
  --background '$color.bg.warning-solid-pressed' \
  --theme light \
  --theme dark
```

```bash
bun skills/seed-token-analysis/scripts/token-contrast.ts \
  --foreground '$color.fg.neutral' \
  --background '$color.bg.overlay' \
  --theme light \
  --backdrop '$color.bg.layer-default'
```

`source`와 `request`에서 분석한 Rootage 원천과 입력이 맞는지 먼저 확인한다. 결과의 `checks`는 배경과 테마 조합별로 다음 상태를 반환한다.

- `resolved`: alias와 색상 합성을 마치고 WCAG 2.x 대비율과 기준별 통과 여부를 계산했다.
- `unresolved`: 해당 mode 값이나 alias를 해석하지 못했다. 다른 테마의 값을 대신 사용하지 않는다.
- `needs-backdrop`: 반투명 배경 아래의 색상을 확정할 수 없다. 실제 불투명 backdrop 토큰을 지정해 다시 검사한다.

`#RRGGBBAA`의 마지막 두 자리는 alpha로 해석한다. 반투명 전경은 배경 위에 합성한 뒤 대비를 계산한다. 반투명 배경은 backdrop 위에 먼저 합성하며, backdrop도 반투명이면 계산을 완료하지 않는다.

최상위 `status`가 `partial`이면 모든 조합을 확인한 것으로 보지 않는다. `minimumRatio`는 `resolved` 조합 가운데 가장 낮은 값일 뿐이며, `unresolved`와 `needs-backdrop` 조합은 포함하지 않는다. `wcag`의 각 boolean은 일반·큰 텍스트의 AA·AAA와 비텍스트 3:1 기준을 각각 나타낸다. 마지막으로 `warnings`를 확인하고 `readOnly`가 `true`인지 확인한다.

## 작업 연결과 경계

- 이 스킬은 색상 토큰만 다룬다. dimension, typography, shadow 같은 다른 토큰 종류는 분석하지 않는다.
- 토큰 지도는 한 번에 토큰 하나만 조회한다. 대비 검사는 전경 하나를 여러 배경과 비교할 수 있지만 여러 변경의 결합 영향은 계산하지 않는다.
- 토큰을 바꾸기 전후에 같은 명령을 실행하면 원천과 생성 표면의 차이를 확인할 수 있다. 변경이 필요하면 Rootage 원천을 수정하고 저장소의 생성 절차를 따른다.
- 여러 토큰이나 실제 diff가 패키지, 플랫폼, 검증 순서에 미치는 영향은 [`seed-change-plan`](../seed-change-plan/SKILL.md)으로 확인한다.
- 공개 패키지의 release bump와 changeset은 [`seed-changeset`](../seed-changeset/SKILL.md)에서 확정한다. 이 스킬의 사용처나 생성 표면만으로 bump를 결정하지 않는다.

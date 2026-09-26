# 색상 토큰 지도와 대비

현재 체크아웃의 `packages/rootage/color.yaml`을 기준으로 색상 토큰의 정의, 연결, 생성 결과, WCAG 2.x 대비를 확인한다. 컴포넌트 없이도 쓴다. 두 스크립트 모두 파일과 Git 상태를 바꾸지 않는다.

## 범위

- 색상 토큰만 다룬다. dimension, font-size, shadow 같은 다른 토큰은 분석하지 않는다.
- 토큰 지도는 한 번에 토큰 하나다. 대비 검사는 전경 하나를 여러 배경과 비교하지만 여러 변경의 결합 영향은 계산하지 않는다.
- 토큰 변경 전후에 같은 명령을 실행하면 원천과 생성 표면의 차이를 볼 수 있다. 값을 바꿔야 하면 `packages/rootage/color.yaml`을 고치고 루트 `AGENTS.md`「생성」을 따른다. `color.yaml`은 `bun figma:sync`가 다시 쓰는 파일이다(`ARCHITECTURE.md`「생성 파이프라인」).
- 여러 토큰이나 실제 diff가 패키지·플랫폼·검증 순서에 주는 영향, 공개 패키지 release bump → [`seed-change`](../../seed-change/SKILL.md)에서 정한다. 사용처나 생성 표면만으로 bump를 정하지 않는다.

## 토큰 지도

1. 토큰 하나로 실행한다.

   ```bash
   bun skills/seed-component/scripts/token-map.ts '$color.fg.neutral'
   ```

2. `token`의 `canonical`과 `state`(`matched`, `ambiguous`, `not-found`)를 확인한다.
   - `ambiguous` → `candidates`의 정확한 토큰으로 다시 실행한다.
   - `not-found` → 비슷한 이름을 임의로 고르지 않고 사용자에게 토큰 이름을 확인한다.
3. `definition`에서 Rootage 원천 경로, 설명, mode별 원시 값을 확인한다.
4. `resolvedValues`에서 mode별 원시 값, alias 연결(`chain`), 최종 색상을 확인한다. 한 mode 값이 없거나 `status: unresolved`면 다른 mode 값으로 대신하지 않는다.
5. `dependentTokens`는 대상 토큰을 직접 참조하는 토큰만 담는다. 전이 의존은 계산하지 않는다.
6. `componentUsages`에서 컴포넌트, variant, 상태, slot, 속성, 근거 경로를 확인한다.
7. `generatedSurfaces`에서 플랫폼·패키지별 `status`(`present`·`missing`), `paths`, `expectedPaths`를 비교한다. `missing`은 생성 결과를 못 찾았다는 뜻이다 → Rootage 원천을 고치기 전에 생성 단계를 먼저 확인한다.
8. `token.publicNames`로 CSS 변수와 공개 이름을 확인한다. 생성 파일은 배포 표면의 근거로만 읽고 고치지 않는다.
9. `warnings`를 확인한다.

## 대비 검사

1. 전경 토큰 하나와 배경 토큰 하나 이상으로 실행한다.
   - `--background`, `--theme`은 반복할 수 있다. `--foreground`, `--backdrop`은 한 번만 쓴다.
   - `--theme`을 생략하면 light와 dark를 모두 검사한다. 중복 테마는 제거되고 결과는 light, dark 순서다.
   - 반투명 배경 아래 실제 색이 필요하면 `--backdrop`을 추가한다.

   ```bash
   bun skills/seed-component/scripts/token-contrast.ts \
     --foreground '$color.fg.warning-contrast' \
     --background '$color.bg.warning-solid' \
     --background '$color.bg.warning-solid-pressed' \
     --theme light \
     --theme dark
   ```

   ```bash
   bun skills/seed-component/scripts/token-contrast.ts \
     --foreground '$color.fg.neutral' \
     --background '$color.bg.overlay' \
     --theme light \
     --backdrop '$color.bg.layer-default'
   ```

2. `source`와 `request`에서 분석한 원천과 입력이 맞는지 확인한다.
3. `checks[]`(배경×테마 조합)의 `status`로 분기한다.
   - `resolved` → alias와 색 합성을 마치고 대비율과 `wcag`를 계산했다.
   - `unresolved` → 해당 mode 값이나 alias를 해석하지 못했다. 다른 테마 값으로 대신하지 않는다.
   - `needs-backdrop` → 반투명 배경 아래 색을 확정할 수 없다. 불투명 backdrop 토큰을 `--backdrop`으로 지정해 다시 실행한다.
4. 최상위 `status`가 `partial`이면 모든 조합을 확인했다고 보고하지 않는다. `minimumRatio`는 `resolved` 조합의 최솟값일 뿐이며 `unresolved`·`needs-backdrop`을 포함하지 않는다.
5. `wcag`의 `aaNormalText`, `aaLargeText`, `aaaNormalText`, `aaaLargeText`, `nonText`(3:1)로 기준별 통과를 읽는다.
6. `warnings`를 확인한다.

색 합성: `#RRGGBBAA`의 마지막 두 자리는 alpha다. 반투명 전경은 배경 위에 합성한 뒤 대비를 계산한다. 반투명 배경은 backdrop 위에 먼저 합성하며, backdrop도 반투명이면 `needs-backdrop`으로 끝난다.

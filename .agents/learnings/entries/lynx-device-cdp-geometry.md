---
id: lynx-device-cdp-geometry
description: PlayLynx 기기에서 agent-lynx CDP로 Lynx 컴포넌트의 크기·간격(gap)·CSS 변수·transition·ref 측정값을 판정할 때 읽는다. `DOM.getBoxModel`의 `width`가 화면 크기보다 작게 나오거나, `var(...)` 값 inline style이 `style` attribute에서 빠지거나 computed `column-gap`이 `0px`인데 화면에는 간격이 보이거나, ref `boundingClientRect` 값이 DOM 크기와 조금 다르거나, 200ms 안팎의 transition 중간 프레임·첫 프레임을 기기에서 확인해야 할 때 적용한다. tap 대상 선택(loading overlay)이나 drag 입력에는 적용하지 않는다.
scope: ["packages/lynx-react/**", "packages/lynx-react-headless/**", "docs/examples/lynx/**", "examples/lynx-spa/**"]
status: active
related: ["lynx-loading-tap-device-check", "lynx-headless-tree-parity"]
verified_at: "2026-09-29"
---

# 기기 CDP 측정은 border quad·style attribute·최종 상태로 판정한다

## 교훈과 다음 행동

- `DOM.getBoxModel`의 `width`·`height`는 content box다. 렌더된 크기는 `border` quad의 좌우·상하 차이로 계산한다.
- inline CSS 변수(예: `--fab-label-width`)는 `DOM.getDocument` 결과 node의 `style` attribute에 그대로 보인다. 측정 대상 자식의 border 폭과 비교한다.
- 반대로 일반 속성의 값이 `var(...)`인 inline style(예: `height: var(--seed-line-height-t4)`)은 `style` attribute에서 빠진다. 빠졌다고 미적용으로 판정하지 않고 `agent-lynx get style <ref>`의 computed 값이나 ref `boundingClientRect`로 확인한다.
  - `row-gap`·`column-gap`은 computed 값도 믿지 않는다. `var(...)` 간격은 `CSS.getComputedStyleForNode`가 `0px`을 돌려줘도 실제로 적용될 수 있다 → 인접 자식 두 개의 `DOM.getBoxModel` `border` quad 차이로 간격을 잰다.
- transition 설정은 `CSS.getComputedStyleForNode`의 `transition` 값으로 확인한다. agent-lynx 호출 하나가 0.5–1초 걸리므로 200ms transition의 중간 프레임과 reload 직후 첫 프레임은 폴링으로 잡히지 않는다. 첫 렌더 gate처럼 짧은 구간은 단위 테스트의 class 전이로 확인한 뒤 기기 첫 프레임을 `미확인`으로 보고한다.
- 전환 중간 모습(fade·clip·줄바꿈 여부)을 기기에서 봐야 하면 임시 예제에서 대상 slot마다 inline `style={{ transitionDuration: "3000ms" }}`를 주고, 입력 직후 DOM 조회 없이 `take-screenshot`만 연달아 찍는다. DOM 조회(`DOM.getDocument`)는 한 번에 2초 이상 걸릴 수 있어 사이에 넣지 않는다. 조상 요소에 `--seed-duration-d4` 같은 duration 변수를 inline으로 덮어쓰는 방식은 전환을 늦추지 못했다.
- Scale Feedback이 붙은 요소의 tap handler에서 ref `boundingClientRect`를 호출하면 눌림 scale이 적용된 값을 돌려준다. ref 대상 확인은 border 크기와의 가로·세로 비율이 같은지로 판정한다.
- 검증용 임시 예제를 `docs/examples/lynx/<component>/`에 두면 `lynx-spa` build의 lazy bundle과 `example` query로 바로 열린다. 판정 뒤 삭제한다.

## 발생 근거와 적용 조건

- 상황(DES-2618): iOS PlayLynx(sdk 1.4.0)에서 FloatingActionButton preview의 root `getBoxModel.width`가 121, label 폭이 101이었다. 임시 예제의 root는 `width` 46.5였지만 `border` quad는 82.5×48이었다.
- 같은 root의 ref `boundingClientRect`를 tap handler에서 호출하자 81.26×47.28이 나왔다. 가로·세로 모두 border 크기의 0.985배여서 눌림 scale 중 측정한 root임을 확인했다.
- root `style`은 `--fab-label-width:101px`(preview), `73.5px`(extended)로 label 폭과 같았다. computed `transition`에는 `width .2s`가 있었지만 tap 뒤 첫 샘플(0.54초)은 이미 최종 폭이었다.
- 상황(DES-2618 label fade): 조상 view에 `--seed-duration-d4: 3000ms`를 inline으로 준 임시 예제는 tap 뒤 0.57초 screenshot에서 이미 축소가 끝나 있었다. Root·Label에 inline `transitionDuration: "3000ms"`를 주자 0.61초·1.62초 screenshot에서 label이 한 줄로 잘린 채 반투명한 중간 상태가 보였다. 변수 덮어쓰기가 실패한 원인은 확인하지 않았다.
- 상황(DES-2628): iOS PlayLynx(sdk 1.4.0)에서 `Skeleton height="lineHeight.t4" width="250px"`의 root `style` attribute는 `width:250px;`뿐이었다. 같은 node의 computed `height`는 19px(`--seed-line-height-t4: 19sp`), ref `boundingClientRect`는 250×19였다. `width="x8"`도 attribute에서 빠졌고 computed `width`는 32px였다.
- 상황(DES-2630): iOS 26.5 시뮬레이터 PlayLynx(sdk 1.4.0)에서 `HStack gap="x2" style={{ rowGap: "24px" }} wrap`의 `style` attribute는 `row-gap:24px;`만 있고 `column-gap: var(--seed-dimension-x2)`가 빠졌다. computed `column-gap`은 `0px`이었지만 인접 자식 border quad는 x 56→64로 8px 간격이었고 screenshot에도 간격이 보였다. 값을 `x6`으로 바꾸자 같은 측정이 24px로 따라 바뀌었다.
- 피할 패턴: content box `width`를 렌더 크기로 보고 실패로 판정하는 것. 폴링 샘플에 중간값이 없다는 이유로 transition이 없다고 판정하는 것.

## 변경 이력

- 2026-09-29: DES-2618 FloatingActionButton 기기 검증에서 기록했다. 검증 범위는 iOS PlayLynx의 preview·extended 문서 예제와 임시 disabled/ref 장면이다.
- 2026-09-29: DES-2618 label fade 검증에서 inline `transitionDuration`으로 전환을 늦춰 중간 프레임을 캡처하는 방법을 추가했다.
- 2026-10-01: DES-2628 Skeleton 기기 검증에서 `var(...)` 값 inline style이 attribute에서 빠지는 조건과 판정 방법을 추가했다.
- 2026-10-06: DES-2630 Stack 기기 검증에서 `var(...)` gap의 computed 값이 `0px`으로 나오는 사례와 border quad 측정 기준을 추가했다.

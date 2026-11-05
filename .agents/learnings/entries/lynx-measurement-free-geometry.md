---
id: lynx-measurement-free-geometry
description: Lynx Headless·styled 컴포넌트가 thumb·indicator처럼 비동기로 측정한 크기(px)를 inline CSS 변수로 넘겨 위치를 보정하고, 첫 렌더 뒤 측정이 끝나며 요소가 몇 px 움직이거나 미끄러질 때 읽는다. transition을 늦게 켜는 gate로는 점프가 남는 이유, 크기 token과 비율 변수를 CSS에서 곱해 첫 프레임부터 위치를 확정하는 방법, Lynx의 CSS 변수·calc 지원 범위, PlayLynx 창 녹화로 판정하는 절차를 다룬다. 측정값 자체가 사용자 입력이나 내용 크기에 따라 달라 token으로 대체할 수 없는 경우에는 적용하지 않는다.
scope: ["packages/lynx-qvism-preset/**", "packages/lynx-css/**", "packages/lynx-react/**", "packages/lynx-react-headless/**"]
status: active
related: ["lynx-initial-transition-gate", "lynx-device-cdp-geometry", "lynx-mask-layer-calc-vars"]
verified_at: "2026-10-01"
---

# 측정에 기대던 위치 보정은 크기 token × 비율 변수로 CSS에서 계산한다

## 교훈과 다음 행동

- Background thread의 측정(`getRectByRef`·`bindlayoutchange`)은 첫 프레임 뒤에 끝난다. 측정값을 `--x-offset: 6px`처럼 넘기면 첫 프레임은 `0px`로 그려지고 다음 프레임에 점프한다. `lynx-initial-transition-gate`처럼 transition을 늦게 켜면 미끄러짐은 사라지지만 점프는 남는다.
- 보정값이 `크기 × 위치 비율`처럼 선형이고 styled 층이 크기 token을 알면, Headless는 단위 없는 비율(예: `--slider-thumb-offset-ratio: 0.2`)만 넘기고 Recipe가 `calc(var(--left) + <크기 token> * var(--ratio, 0))`로 계산한다. 측정이 필요 없어 첫 프레임부터 위치가 확정되고, gate도 필요 없다.
- Lynx CSS 변수 지원 범위(iOS PlayLynx SDK 1.4.0에서 확인):
  - 사용처의 `calc()` 안에서 `var() * var()`, `var() * 숫자`, `%`와 `px` 혼합은 동작한다. inline style로 넘긴 변수와 조상 class의 변수를 함께 써도 된다.
  - 사용자 정의 속성 값 안의 `var()`(예: `--y: calc(var(--sz) * 0.2)`)는 inline·class 모두 해석되지 않아 그 속성을 쓰는 선언 전체가 무효가 된다. 중첩 변수 대신 사용처에서 곱한다.
  - 이 범위는 `left`에서 확인했다. `mask-size`에서는 `calc()` 안 변수 두 개가 층을 지웠다(`lynx-mask-layer-calc-vars`) → 다른 속성에 쓰기 전에 기기에서 다시 확인한다.
  - `var(--a, var(--b))`처럼 fallback 안에 다시 `var()`를 둔 선언도 무효였다(`color`가 `rgba(0,0,11,0)`로 계산됨). token을 직접 쓰거나 변수를 항상 정의한다.
  - 같은 무효는 `height`에도 나타난다. 사용자 정의 속성에 `calc(var(--a) + var(--b) * 2)`를 담고 다른 요소에서 `height: var(--ptr-size, 88px)`로 쓰면 fallback도 쓰이지 않고 높이가 내용 높이로 줄었다. 고정 높이 대신 token padding(`paddingTop`·`paddingBottom`)으로 자연 높이를 만들거나, 사용처에서 바로 계산한다.
- 첫 프레임 판정은 단위 테스트나 agent-lynx 폴링으로는 할 수 없다. macOS에서 PlayLynx 창이 보이면 창 ID를 찾아 `screencapture -x -V <초> -l<windowID> out.mov`로 녹화하는 동안 소유 session에 `Page.reload`를 보낸다. 프레임별 대상 픽셀 열 범위를 비교해 첫 표시 프레임과 마지막 프레임의 위치가 같은지 본다. `-R` 좌표 녹화는 다중 모니터에서 다른 화면을 찍을 수 있다.

## 발생 근거와 적용 조건

- DES-2629 Slider에서 thumb·tick·marker 보정을 측정한 thumb 폭(px)으로 넘겼다. 사용자 녹화(markers 예제)에서 30% thumb이 첫 표시 뒤 약 8px(2x) 오른쪽으로 이동했다. 측정 다음 업데이트에 transition을 켜는 gate를 넣은 뒤에도 같은 이동이 남았다.
- 임시 예제로 변수 지원을 확인했다. 기대 중심 x=110에 대해 `calc(30% + 4px)`, inline `--x: 4px` 사용, `calc(30% + var(--sz) * 0.2)`, `calc(30% + var(--sz) * var(--k))`는 110, `--y: calc(var(--sz) * 0.2)`를 inline·class에 둔 두 경우는 left가 무효가 되어 16(트랙 왼쪽 끝)이었다.
- Headless가 `--slider-*-offset-ratio`를 넘기고 Recipe가 `var(--seed-dimension-x5) * var(--slider-thumb-offset-ratio, 0)`로 계산하도록 바꾼 뒤, PlayLynx 창 녹화에서 markers·range 예제의 thumb 위치가 첫 표시 프레임(2.80s·2.50s)부터 녹화 끝까지 같았다.
- Android와 다른 SDK 버전은 확인하지 않았다.
- DES-2708 PullToRefresh(iOS 26.5 시뮬레이터 PlayLynx, 엔진 4.1): Recipe root의 `--ptr-size: calc(var(--seed-dimension-x6) + var(--seed-dimension-x8) * 2)`를 headless Indicator가 인라인 `height: var(--ptr-size, 88px)`로 쓰자, Indicator가 spinner 높이(24px)로 줄었고 MT가 측정한 크기도 24였다(transform −24px). 사용자는 spinner 위아래 여백이 없다고 보고했다. 인라인 높이를 지우고 Recipe에 `paddingTop`·`paddingBottom: $dimension.x8`을 두자 CDP border box가 Indicator 88px, spinner 24px, 위아래 각 32px가 됐다.

## 변경 이력

- 2026-10-01: DES-2629 Slider 첫 렌더 thumb 이동 수정에서 기록했다.
- 2026-10-01: 같은 작업의 marker 색상 조사에서 중첩 fallback `var()`가 무효인 근거를 추가했다.
- 2026-10-01: dev의 `lynx-mask-layer-calc-vars`와 적용 속성 차이를 연결했다.
- 2026-10-06: DES-2708 PullToRefresh에서 사용자 정의 속성 안 `var()`가 `height`도 무효로 만든 근거와 padding 대안을 추가했다.

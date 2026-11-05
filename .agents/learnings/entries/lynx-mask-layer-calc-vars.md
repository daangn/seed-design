---
id: lynx-mask-layer-calc-vars
description: Lynx Recipe·styled 컴포넌트에서 여러 `mask-image` 층의 `mask-size`·`mask-position`을 CSS 변수로 계산하거나, 한 view에 두 edge의 fade mask를 겹치지 않게 배치하려 할 때 읽는다. 기기에서 특정 mask 층만 통째로 사라져 그 영역이 투명해지는 증상의 원인인 `calc()` 안 변수 조합과, 동작이 확인된 값 형태·대안 구조를 다룬다. 웹 Recipe(qvism-preset)의 mask나 단일 층 mask에는 적용하지 않는다.
scope: ["packages/lynx-qvism-preset/**", "packages/lynx-css/**", "packages/lynx-react/**"]
status: active
related: ["lynx-transition-animatable-properties"]
verified_at: "2026-10-01"
---

# Lynx mask 층의 calc()에는 변수를 하나만 쓴다

## 교훈과 다음 행동

- `mask-size`의 `calc()`에는 `var()`를 하나만 넣는다. `calc(100% - var(--a) - var(--b))`나 `calc()` 값을 담은 변수를 다시 `calc(100% - var(--sum))`로 쓰면 그 층이 그려지지 않고 해당 영역이 투명해진다.
- 동작한 형태: `100% var(--a)`, `calc(100% - var(--a))`, 리터럴 `calc(100% - 80px)`, `mask-position`의 `0 var(--a)`.
- 두 edge의 fade를 한 view에 그리려면 가운데 불투명 층의 크기가 두 변수에 의존한다 → 위 제약 때문에 Recipe 변수만으로는 만들 수 없다. edge마다 mask view를 중첩하고 각 view에 `[gradient, 나머지 불투명]` 두 층을 두는 구조를 쓴다(`packages/lynx-qvism-preset/src/recipes/scroll-fog.ts`).
- 층이 서로 겹치지 않으면 기본 합성으로 합쳐진다. `mask-composite`는 `@lynx-js/css-defines@0.0.16`에 compat_data가 없어 지원 여부를 판단할 근거가 없다 → 겹치는 층의 intersect에 기대지 않는다.

## 발생 근거와 적용 조건

- DES-2631(ScrollFog)에서 iOS 26.5 시뮬레이터 PlayLynx(Lynx SDK 1.4.0), `examples/lynx-spa` dev server로 inline style 임시 예제를 비교했다. 세 층(위 gradient 20px, 가운데 불투명, 아래 gradient 60px)과 `mask-repeat: no-repeat`를 쓴 panel 여러 개다.
  - 리터럴 크기·위치 → 세 층 모두 표시됐다.
  - 가운데 층 `calc(100% - var(--t) - var(--b))` → 가운데만 사라졌다.
  - `--sum: calc(20px + 60px)`와 `calc(100% - var(--sum))` → 가운데만 사라졌다.
  - 크기 리터럴과 위치 `0 var(--t)` → 정상이었다.
- Android는 확인하지 않았다. 같은 구조를 Android에서 쓰기 전에는 기기에서 다시 확인한다.

## 변경 이력

- 2026-10-01: DES-2631 기기 비교 결과로 작성했다.

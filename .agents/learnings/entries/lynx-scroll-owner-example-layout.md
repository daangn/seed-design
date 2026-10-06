---
id: lynx-scroll-owner-example-layout
description: 자체 세로 `<scroll-view>`나 당김·스크롤 제스처를 소유하는 Lynx 컴포넌트(PullToRefresh, KeyboardAvoidingScrollView, LoopScroll 등)의 문서 예제를 추가하거나, `examples/lynx-spa` 문서 예제를 당길 때 제목·설명까지 화면 전체가 함께 출렁일 때 읽는다. `docs/playground/lynx/layout.ts`의 `getExampleLayout` 분류(`scroll`·`fill`), `DocsExamplePage`가 예제를 바깥 scroll-view로 감싸는 조건, 분류 기준을 다룬다. 예제 안 flex 정렬 문제는 `lynx-example-display-flex`, 컴포넌트 자체 scroll host의 bounce는 `lynx-gesture-intercept-bounce`를 본다.
scope: ["docs/playground/lynx/**", "docs/examples/lynx/**", "examples/lynx-spa/**"]
status: active
related: ["lynx-example-display-flex", "lynx-gesture-intercept-bounce"]
verified_at: "2026-10-06"
---

# 스크롤·당김을 소유하는 컴포넌트의 문서 예제는 fill 셸에 둔다

## 교훈과 다음 행동

- `examples/lynx-spa/src/pages/DocsExamplePage.tsx`는 `getExampleLayout(component)`가 `"scroll"`이면 예제를 바깥 세로 scroll-view 안에 그린다. 컴포넌트가 자기 scroll host나 세로 제스처를 소유하면 바깥 scroll-view도 같은 drag를 받아 함께 움직인다.
- 이런 컴포넌트를 추가하면 `docs/playground/lynx/layout.ts`의 `fill` 대상에 컴포넌트 이름을 넣고, 예제가 남은 높이를 채우도록 작성한다.
- 예제 wrapper에서 bounce를 끄거나 입력을 막아 증상을 숨기지 않는다 → 셸 분류를 고친다. 실제 앱에서도 같은 경합이 생기므로 컴포넌트 문서에 "다른 세로 스크롤 컨테이너 안에 두지 않는다"는 사용 제약을 적는다.

## 발생 근거와 적용 조건

- DES-2708 PullToRefresh: 분류가 기본 `"scroll"`일 때 iOS 26.5 시뮬레이터 PlayLynx(엔진 4.1)에서 최상단 짧은 당김 중 제목·설명·status·PTR 영역 전체가 약 37–38pt 함께 이동했다. `pull-to-refresh`를 `fill`에 추가한 뒤의 재관찰에서는 바깥 셸 이동이 아니라 Content 내부 bounce에 의한 초과 이동만 기록됐다(`lynx-gesture-intercept-bounce`).
- `keyboard-avoiding-scroll-view`와 `loop-scroll`은 같은 이유로 이미 `fill`이었다.
- Android에서 바깥 셸 경합은 따로 확인하지 않았다.

## 변경 이력

- 2026-10-06: DES-2708에서 기록했다.

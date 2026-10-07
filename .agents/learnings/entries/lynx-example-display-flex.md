---
id: lynx-example-display-flex
description: Lynx 문서 예제(`docs/examples/lynx/**`)를 inline style·preview.css·headless 컴포넌트로 작성하거나, `examples/lynx-spa` native 화면에서 요소가 세로로 쌓이거나 align-items·justify-content·flexDirection이 무시될 때 읽는다. native·Web preview의 기본 display(linear)와 예제에서 flex 속성을 쓰는 방법, 예제 배치를 호스트가 맡는 구조를 다룬다. SEED Recipe className이 display를 정하는 styled 컴포넌트 자체에는 적용하지 않는다.
scope: ["docs/examples/lynx/**", "examples/lynx-spa/**"]
status: active
related: ["iphone-lan-asset-prefix"]
verified_at: "2026-10-07"
---

# inline style 예제에서 flex 속성을 쓰면 `display: "flex"`를 함께 쓴다

## 교훈과 다음 행동

- `flexDirection`·`alignItems`·`justifyContent`·`gap`·`marginLeft: "auto"`를 쓰는 view에는 `display: "flex"`를 같은 style·class에 적는다. native Lynx의 기본 display는 linear여서, 없으면 자식이 세로로 쌓이고 정렬 속성이 무시된다.
- 문서 Web preview(`@lynx-js/web-core` 0.24.0)도 기본 display가 linear다. 다만 linear를 flex column으로 흉내 내므로 class에만 둔 `align-items: center`가 웹에서는 적용되고 native에서는 무시될 수 있다 → 웹 결과로 native 정렬을 판정하지 않고 `examples/lynx-spa` 기기 화면으로 확인한다.
- `display: "flex"`의 기본 방향은 row다. 높이가 있는 버튼의 label을 세로 가운데에 두려면 `justifyContent`가 아니라 `alignItems: "center"`를 쓴다.
- 예제의 배경·여백·가운데 정렬·높이는 호스트가 맡는다(`docs/examples/lynx/AGENTS.md` 레이아웃 규칙). 예제 root에 `height: 100%`·가운데 정렬을 두지 말고, 높이가 정해진 영역이 필요하면 `docs/playground/lynx/layout.ts`에 `fill`로 등록한다.

## 발생 근거와 적용 조건

- DES-2613의 `docs/examples/lynx/app-bar/headless.tsx`는 Root·Left·Right에 `flexDirection: "row"`만 지정했다. iOS PlayLynx에서 뒤로 버튼과 제목이 겹치고, 오른쪽 버튼 두 개가 세로로 쌓였다(`get style`로 Right 높이 88px 확인).
- DES-2614에서 해당 view에 `display: "flex"`를 넣고, IconButton에 `alignItems: "center"`를 더했다. 좌우 버튼이 한 줄에 놓이고 label이 제목과 같은 높이에 정렬됐다. 제목 padding은 넓은 쪽 폭 84px과 같았다.
- 재확인(2026-10-07): 문서 미리보기를 시스템 Chrome으로 열어 shadow DOM을 조회했다. `[lynx-default-display-linear]` 속성은 없고, class에 display가 없는 예제 root `x-view`의 `--lynx-display`가 `linear`, computed `display: flex`·`flex-direction: column`이었다. 이전 기록의 "Web preview는 `lynx-default-display-linear="false"`로 실행된다"는 web-core CSS에 선택자가 있다는 사실(`web-core-styles.test.ts`)을 실행 상태로 오해한 것이었다.
- 같은 날 SPA의 `scroll-view` 안 `min-h-full` stage에 `display: flex`와 가운데 정렬을 두자 iOS PlayLynx 시뮬레이터에서 ActionButton이 남은 화면 높이의 가운데에 놓였다.

## 변경 이력

- 2026-09-29: DES-2614 AppBar headless 예제 수정에서 처음 기록했다.
- 2026-09-29: #2308 리뷰에 따라 scroll-view 설명을 `getExampleLayout`의 `"scroll"` 예제로 좁혔다. 코드 경로만 확인했고 기기 재검증은 하지 않았다.
- 2026-10-07: Web preview 기본 display 설명을 실제 측정값(linear)으로 고치고, 예제 배치를 호스트가 맡는 구조로 다음 행동을 바꿨다.

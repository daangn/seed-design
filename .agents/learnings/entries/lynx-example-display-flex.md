---
id: lynx-example-display-flex
description: Lynx 문서 예제(`docs/examples/lynx/**`)를 inline style이나 headless 컴포넌트로 작성하거나, 문서 Web preview에서는 맞는데 `examples/lynx-spa` native 화면에서 요소가 세로로 쌓이거나 flexDirection·justifyContent가 무시될 때 읽는다. native와 Web preview의 기본 display 차이와 예제에서 flex 속성을 쓰는 방법을 다룬다. SEED Recipe className이 display를 정하는 styled 컴포넌트 예제에는 적용하지 않는다.
scope: ["docs/examples/lynx/**", "examples/lynx-spa/**"]
status: active
related: ["iphone-lan-asset-prefix"]
verified_at: "2026-09-29"
---

# inline style 예제에서 flex 속성을 쓰면 `display: "flex"`를 함께 쓴다

## 교훈과 다음 행동

- `flexDirection`·`alignItems`·`justifyContent`·`marginLeft: "auto"`를 쓰는 view에는 `display: "flex"`를 같은 style에 적는다. native Lynx의 기본 display는 flex가 아니어서, 없으면 자식이 세로로 쌓이고 정렬 속성이 무시된다.
- 문서 Web preview는 `lynx-default-display-linear="false"`로 실행된다(`docs/scripts/lynx-examples/web-core-styles.test.ts`). 문서 페이지에서 정상이어도 native를 보장하지 않는다 → `examples/lynx-spa` 기기 화면으로 확인한다.
- `display: "flex"`의 기본 방향은 row다. 높이가 있는 버튼의 label을 세로 가운데에 두려면 `justifyContent`가 아니라 `alignItems: "center"`를 쓴다.
- SPA 문서 예제의 컨테이너는 `docs/playground/lynx/layout.ts`의 `getExampleLayout`이 정한다. `"scroll"`(현재 `keyboard-avoiding-scroll-view` 외 전부)이면 `examples/lynx-spa/src/pages/DocsExamplePage.tsx`가 scroll-view 안에 그리므로 root의 `height: "100%"`가 화면 높이가 되지 않는다. 이때 세로 가운데 정렬이 안 되는 것은 `display` 누락과 다른 원인이다. `"fill"` 예제는 scroll-view 밖에서 남은 높이를 채운다.

## 발생 근거와 적용 조건

- DES-2613의 `docs/examples/lynx/app-bar/headless.tsx`는 Root·Left·Right에 `flexDirection: "row"`만 지정했다. iOS PlayLynx에서 뒤로 버튼과 제목이 겹치고, 오른쪽 버튼 두 개가 세로로 쌓였다(`get style`로 Right 높이 88px 확인).
- DES-2614에서 해당 view에 `display: "flex"`를 넣고, IconButton에 `alignItems: "center"`를 더했다. 좌우 버튼이 한 줄에 놓이고 label이 제목과 같은 높이에 정렬됐다. 제목 padding은 넓은 쪽 폭 84px과 같았다.

## 변경 이력

- 2026-09-29: DES-2614 AppBar headless 예제 수정에서 처음 기록했다.
- 2026-09-29: #2308 리뷰에 따라 scroll-view 설명을 `getExampleLayout`의 `"scroll"` 예제로 좁혔다. 코드 경로만 확인했고 기기 재검증은 하지 않았다.

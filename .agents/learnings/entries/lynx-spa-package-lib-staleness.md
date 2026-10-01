---
id: lynx-spa-package-lib-staleness
description: "`examples/lynx-spa` dev server를 띄운 채 `packages/lynx-react/src`나 headless 패키지 원천을 고친 뒤 기기에서 변경 결과를 확인할 때 읽는다. 예제 파일 변경은 반영되는데 컴포넌트 변경만 반영되지 않아, 이전 구현과 새 예제가 섞인 화면을 변경 결과로 오판하는 경우를 다룬다. 변경이 실제로 실린 bundle을 확인하는 방법과 lib를 다시 만드는 순서를 다룬다. 처음 서버를 띄울 때의 plugin 빌드 누락은 lynx-spa-dev-prerequisites를 본다."
scope: ["examples/lynx-spa/**", "docs/examples/lynx/**", "packages/lynx-react/**", "packages/lynx-react-headless/**"]
status: active
related: ["lynx-spa-dev-prerequisites", "playlynx-simulator-overlay-check", "isolated-regression-baselines"]
verified_at: "2026-10-01"
---

# lynx-spa는 서버 시작 때 만든 package lib를 쓴다

## 교훈과 다음 행동

- lynx-spa는 `@seed-design/lynx-react`를 `packages/lynx-react/lib`로 해석한다. `bun run dev`의 `prepare-workspace.ts`가 서버 시작 때만 lib를 만든다 → 서버 실행 중 `src`를 고치면 `docs/examples/lynx/**` 변경만 hot reload되고 컴포넌트는 이전 구현으로 남는다.
- 컴포넌트를 고친 뒤에는 자신이 띄운 서버를 멈추고 다시 시작해 lib를 만든다. 서버 로그의 `@seed-design/lynx-react` build `changes:`에 고친 파일이 있는지 확인한다. 포트가 바뀌면 소유한 Card를 새 URL의 `Page.reload`로 다시 연다.
- 서버를 띄운 채 별도로 lib를 빌드하지 않는다 → 중간 빌드 실패가 PlayLynx 종료로 이어질 수 있다(`playlynx-simulator-overlay-check`).
- 변경 결과를 판정하기 전에 `agent-lynx snapshot`으로 바뀐 구조(예: 제거한 요소의 개수)가 실제 tree에 반영됐는지 확인한다. 화면이 그럴듯하다는 것만으로 판정하지 않는다.

## 발생 근거와 적용 조건

- DES-2631에서 ScrollFog의 내부 `scroll-view`를 제거하고, 예제에는 소비자 `scroll-view`를 추가했다. 서버를 재시작하지 않고 찍은 화면은 정상처럼 보였다. 그러나 snapshot에는 `scroll-view`가 세 겹(이전 구현의 두 개와 예제의 한 개)이었고, 세로 drag도 스크롤되지 않았다.
- 서버를 재시작해 lib를 다시 만든 뒤에는 `scroll-view`가 한 개였고 drag 스크롤이 동작했다. iOS 26.5 시뮬레이터 PlayLynx(Lynx SDK 1.4.0), agent-lynx 0.14.2에서 확인했다.
- 피할 패턴: 예제 hot reload가 반영됐다는 이유로 같은 서버의 컴포넌트 변경도 반영됐다고 가정하는 것.

## 변경 이력

- 2026-10-01: DES-2631 기기 검증 중 확인한 결과로 작성했다.

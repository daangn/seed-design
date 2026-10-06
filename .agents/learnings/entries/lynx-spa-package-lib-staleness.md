---
id: lynx-spa-package-lib-staleness
description: "`examples/lynx-spa` dev server를 띄운 채 `packages/lynx-react/src`나 headless 패키지 원천을 고친 뒤 기기에서 변경 결과를 확인할 때 읽는다. 예제 파일 변경은 반영되는데 컴포넌트 변경만 반영되지 않아, 이전 구현과 새 예제가 섞인 화면을 변경 결과로 오판하는 경우를 다룬다. 변경이 실제로 실린 bundle을 확인하는 방법과 lib를 다시 만드는 순서를 다룬다. 처음 서버를 띄울 때의 plugin 빌드 누락은 lynx-spa-dev-prerequisites를 본다."
scope: ["examples/lynx-spa/**", "docs/examples/lynx/**", "packages/lynx-react/**", "packages/lynx-react-headless/**"]
status: active
related: ["lynx-spa-dev-prerequisites", "playlynx-simulator-overlay-check", "isolated-regression-baselines"]
verified_at: "2026-10-06"
---

# lynx-spa는 서버 시작 때 만든 package lib를 쓴다

## 교훈과 다음 행동

- lynx-spa는 `@seed-design/lynx-react`를 `packages/lynx-react/lib`로 해석한다. `bun run dev`의 `prepare-workspace.ts`가 서버 시작 때만 lib를 만든다 → 서버 실행 중 `src`를 고치면 `docs/examples/lynx/**` 변경만 hot reload되고 컴포넌트는 이전 구현으로 남는다.
- 컴포넌트를 고친 뒤에는 자신이 띄운 서버를 멈추고 다시 시작해 lib를 만든다. 서버 로그의 `@seed-design/lynx-react` build `changes:`에 고친 파일이 있는지 확인한다. 포트가 바뀌면 소유한 Card를 새 URL의 `Page.reload`로 다시 연다.
- headless 패키지(`packages/lynx-react-headless/*`)를 고쳤으면 서버를 멈춘 상태에서 그 패키지를 `bun --filter <패키지 이름> build`로 빌드한 뒤 다시 시작한다. `prepare-workspace.ts`는 `ultra --filter @seed-design/lynx-react`로 lynx-react만 빌드하고, 재시작만으로는 headless `lib`가 바뀌지 않는다. 고친 코드의 고유 식별자가 해당 패키지 `lib`와 서버가 주는 `main.lynx.bundle`에 들어 있는지 `grep`으로 확인한다.
- 서버를 띄운 채 별도로 lib를 빌드하지 않는다 → 중간 빌드 실패가 PlayLynx 종료로 이어질 수 있다(`playlynx-simulator-overlay-check`).
- 변경 결과를 판정하기 전에 `agent-lynx snapshot`으로 바뀐 구조(예: 제거한 요소의 개수)가 실제 tree에 반영됐는지 확인한다. 화면이 그럴듯하다는 것만으로 판정하지 않는다.

## 발생 근거와 적용 조건

- DES-2631에서 ScrollFog의 내부 `scroll-view`를 제거하고, 예제에는 소비자 `scroll-view`를 추가했다. 서버를 재시작하지 않고 찍은 화면은 정상처럼 보였다. 그러나 snapshot에는 `scroll-view`가 세 겹(이전 구현의 두 개와 예제의 한 개)이었고, 세로 drag도 스크롤되지 않았다.
- 서버를 재시작해 lib를 다시 만든 뒤에는 `scroll-view`가 한 개였고 drag 스크롤이 동작했다. iOS 26.5 시뮬레이터 PlayLynx(Lynx SDK 1.4.0), agent-lynx 0.14.2에서 확인했다.
- 상황(2026-10-06, KeyboardAvoidingScrollView Footer 추가): headless engine을 고친 뒤 서버를 재시작했지만 로그에는 `@seed-design/lynx-react` build만 있었다. `lib/engine.js`의 수정 시각이 이전 빌드 그대로였고 새 변수명 `hasContent`가 0건이었다. 서버를 멈추고 `bun --filter @seed-design/lynx-react-keyboard-avoiding-scroll-view build`를 실행한 뒤 다시 시작하자 lib에서 4건, 서버의 `main.lynx.bundle`에서 5건이 나왔고 Android Lynx Go 기기 결과도 새 동작으로 바뀌었다.
- 피할 패턴: 예제 hot reload가 반영됐다는 이유로 같은 서버의 컴포넌트 변경도 반영됐다고 가정하는 것.

## 변경 이력

- 2026-10-01: DES-2631 기기 검증 중 확인한 결과로 작성했다.
- 2026-10-06: headless 패키지 원천은 서버 재시작으로 다시 빌드되지 않는 조건과 확인 방법을 추가했다(KeyboardAvoidingScrollView 기기 검증에서 재현).

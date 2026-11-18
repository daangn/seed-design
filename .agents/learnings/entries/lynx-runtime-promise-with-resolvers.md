---
id: lynx-runtime-promise-with-resolvers
description: Lynx 컴포넌트·Headless·문서 예제·`examples/lynx-spa` 런타임 코드에서 `Promise.withResolvers()`를 쓰려 하거나, 기기에서 picker·비동기 callback이 아무 오류 표시 없이 동작하지 않고 Vitest에서는 통과할 때 읽는다. PlayLynx(Lynx SDK 1.4.0) 런타임에 이 API가 없다는 확인 결과, 오류가 삼켜지는 조건, 런타임 코드와 테스트 코드의 작성 기준을 다룬다. Node에서만 실행되는 Vitest 테스트 코드에는 제약이 없다.
scope: ["packages/lynx-react/**", "packages/lynx-react-headless/**", "docs/examples/lynx/**", "docs/registry/lynx/**", "examples/lynx-spa/**"]
status: active
related: ["lynx-multiline-text-overlay"]
verified_at: "2026-10-02"
---

# Lynx 런타임에는 `Promise.withResolvers`가 없다

## 교훈과 다음 행동

- Lynx에서 실행되는 코드(컴포넌트, Headless 패키지, Registry, 문서 예제, lynx-spa page)는 `Promise.withResolvers()`를 쓰지 않는다 → `new Promise((resolve, reject) => …)` executor 형태로 쓰고, 이유를 짧은 주석으로 남긴다.
- Vitest(Node)에서는 이 API가 있어 테스트가 통과한다. 테스트 코드 안에서는 써도 되지만, 테스트 통과를 기기 동작의 근거로 삼지 않는다.
- 호출부가 동기 throw를 잡아 사용자 callback으로 넘기는 구조(예: `onSelectFiles`의 동기 throw → `onSelectError`)에서는 `TypeError`가 화면에 드러나지 않는다. 기기에서 비동기 경로가 조용히 멈추면 먼저 `agent-lynx evaluate 'typeof Promise.withResolvers'`로 API 유무를 확인한다.

## 발생 근거와 적용 조건

- DES-2646에서 `@seed-design/lynx-react-file-upload` 검증용 lynx-spa page의 `onSelectFiles`가 `Promise.withResolvers<NativeFile[]>()`를 썼다. iOS 26.5 시뮬레이터 PlayLynx(Lynx SDK 1.4.0, lynx-spa dev bundle)에서 Trigger를 탭해도 목록이 바뀌지 않았고 console에도 오류가 없었다.
- 같은 session에서 `agent-lynx evaluate 'typeof Promise.withResolvers'`가 `"undefined"`를 반환했다. picker를 `new Promise((resolve) => setTimeout(…))`로 바꾸자 같은 Trigger 탭으로 파일이 추가되고 업로드 상태가 바뀌었다.
- 오류가 보이지 않은 이유: Headless 훅이 picker 호출의 동기 throw를 잡아 `onSelectError`로 넘기고, 해당 page는 `onSelectError`를 주지 않았다.
- 피할 패턴: Node 테스트나 타입 검사 통과만 보고 최신 ECMAScript 내장 API를 Lynx 런타임 코드에 쓰는 것.

## 변경 이력

- 2026-10-02: DES-2646 기기 검증 중 확인한 결과로 작성했다.

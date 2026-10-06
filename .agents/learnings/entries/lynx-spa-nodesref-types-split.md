---
id: lynx-spa-nodesref-types-split
description: "`examples/lynx-spa`·`docs/examples/lynx` consumer가 `useRef<NodesRef>`로 만든 native ref를 headless·`@seed-design/lynx-react` API(ref 객체를 받는 등록 타입, `forwardRef<NodesRef>` 컴포넌트의 `ref`)에 넘기다 `RefObject<NodesRef | null>` is not assignable, `node_modules/.bun/@lynx-js+types@4.x` ↔ `@3.9`가 함께 찍힌 TS2322가 날 때 읽는다. workspace에서 예제와 패키지가 서로 다른 `@lynx-js/types`를 해석하는 원인과, 공개 타입을 넓히지 않고 consumer 경계에서 연결하는 방법을 다룬다. intrinsic `<view>`가 SVG로 검사되는 TS2322는 lynx-intrinsic-jsx-typecheck를 본다."
scope: ["examples/lynx-spa/**", "docs/examples/lynx/**", "packages/lynx-react/**", "packages/lynx-react-headless/**"]
status: active
related: ["lynx-intrinsic-jsx-typecheck"]
verified_at: "2026-10-06"
---

# lynx-spa와 Lynx 패키지는 서로 다른 NodesRef 타입을 본다

## 교훈과 다음 행동

- 패키지(`packages/lynx-react`, `packages/lynx-react-headless/*`)는 devDependency `@lynx-js/types` `^3.7`·`^3.9`를 각자 node_modules에서 해석하고, `examples/lynx-spa`는 직접 의존 없이 hoist된 4.x를 쓴다. 두 `NodesRef`는 `invoke().selectAll().fields` 시그니처가 달라 어느 방향으로도 대입되지 않는다.
- 그래서 예제에서 `useRef<NodesRef>(null)`을 등록 타입(`{ current: NodesRef | null }`)이나 `Ref<NodesRef>` prop에 넘기면 TS2322가 난다. 4.x 인자를 받는 callback ref도 패키지의 `forwardRef<NodesRef>` ref prop에는 대입되지 않는다.
- 공개 타입을 넓히거나 패키지 devDependency를 바꾸지 않는다 → 배포 뒤에는 peer dependency 하나로 해석되어 생기지 않는 문제다. 예제에서는 패키지 타입에서 node 타입을 꺼내고(`NonNullable<Registration["nativeRef"]["current"]>`), intrinsic 요소에는 callback ref를 주어 `node as RegisteredNode | null`로 옮겨 담는다. 이 cast는 TS2352 없이 통과한다. 이유를 주석으로 남긴다.
- forwardRef 컴포넌트의 `ref`가 예제에 꼭 필요하지 않으면 넘기지 않는다.

## 발생 근거와 적용 조건

- DES-2638(KeyboardAvoidingScrollView headless 분리)에서 `KeyboardAvoidingScrollViewHeadlessPage`를 `bun --filter lynx-spa typecheck`로 검사했다. 오류 경로에 `node_modules/.bun/@lynx-js+types@4.1.0`과 `@3.9.0`의 `NodesRef`가 함께 나왔다.
- 임시 consumer로 대조했다. 패키지 타입에서 꺼낸 `useRef<RegisteredNode>`를 `<input ref>`에 넘기면 실패, 4.x `(node: NodesRef | null) => void`를 `Root ref`에 넘기면 실패, 4.x callback 안에서 `as RegisteredNode | null`로 담으면 통과했다.
- 피할 패턴: 이 오류를 headless 공개 타입 결함으로 보고 `{ current: unknown }`처럼 넓히는 것. lynx-spa에 `@lynx-js/types`를 추가해 버전을 맞추는 것(의존성 변경은 사용자 확인 대상).

## 변경 이력

- 2026-10-06: DES-2638 lynx-spa Headless 소비 페이지 typecheck에서 기록했다.

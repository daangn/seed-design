---
id: lynx-intrinsic-jsx-typecheck
description: Lynx headless 패키지나 `@seed-design/lynx-react`에서 임시 consumer·새 컴포넌트를 typecheck할 때 `<view bindtap={...}>`처럼 intrinsic 요소에 prop을 직접 적으면 `not assignable to type 'SVGProps<SVGViewElement>'`·`Property 'bindtap' does not exist` TS2322가 나는 경우에 읽는다. 오류가 Lynx 공개 API가 아니라 저장소 tsconfig의 전역 JSX 해석에서 온다는 판단과, 공개 API 검증을 오염시키지 않고 consumer를 작성하는 방법을 다룬다. 컴포넌트 자체의 prop 타입 오류나 Vitest 실행 실패에는 적용하지 않는다.
scope: ["packages/lynx-react/**", "packages/lynx-react-headless/**"]
status: active
related: ["lynx-headless-tree-parity"]
---

# Lynx intrinsic 요소의 직접 prop은 React DOM 타입으로 검사된다

## 교훈과 다음 행동

- `tsconfig.lynx.json`은 `"jsx": "preserve"`만 두고 `jsxImportSource`를 지정하지 않는다. `@lynx-js/react`의 타입이 `@types/react`를 import하므로 전역 `JSX.IntrinsicElements`는 React DOM 정의를 쓴다. `view`는 SVG `<view>`로, `text`·`input`도 DOM 요소로 해석된다.
- 그래서 `<view bindtap={fn} />`처럼 literal prop을 적으면 TS2322가 난다. 저장소 소스는 `{...nativeProps}`·`{...mergeProps(...)}` spread를 함께 쓰므로 excess property 검사를 피해 통과한다. 이 오류를 headless 공개 API 결함으로 보고하지 않는다.
- headless-only consumer typecheck는 공개 API의 타입만 검증하도록 쓴다. hook 반환값을 명시 타입 변수에 받고, consumer 안에 intrinsic 요소를 직접 렌더링하지 않는다. `IntrinsicElements["view"]`(`@lynx-js/types`) 타입 객체를 spread해도 그 타입의 `style`(string 허용)이 React `CSSProperties`와 맞지 않아 실패한다. native 요소 렌더링은 headless 파트와 Vitest 실행으로 확인한다.
- 임시 consumer는 의존성이 있는 패키지(예: `packages/lynx-react/src/__x-consumer.tsx`)에 두고 `npx tsc -p tsconfig.json --noEmit`으로 검사한 뒤 지운다. 컴포넌트를 `export`하면 TS2883(`inferred type ... cannot be named without a reference to 'Element' from @types/react`)이 나므로 export하지 않는다.

## 발생 근거와 적용 조건

- 상황(DES-2636): `@seed-design/lynx-react-field`만 import하는 임시 consumer를 `packages/lynx-react-headless/field`와 `packages/lynx-react`에서 typecheck했다. `<view accessibility-label=… bindtap=…/>`가 두 위치 모두 `SVGProps<SVGViewElement>` TS2322로 실패했고, `IntrinsicElements["view"]` 객체 spread도 `style` 타입 불일치로 실패했다. intrinsic 요소를 빼고 공개 API(`Field.Root`·파트·`useFieldContext({ strict })`)만 쓴 consumer는 오류 없이 통과했다.
- 근거: `tsc --explainFiles`에서 `@types/react@19.2.7`이 `@lynx-js/react@0.117.0`의 `types/react.docs.d.ts`·`runtime/lib/hooks/react.d.ts`에서 import된다. `packages/lynx-react/src/components`의 literal `bindtap=`은 테스트의 SEED 컴포넌트 prop이거나 spread가 있는 요소에만 있다.
- 피할 패턴: 임시 consumer의 TS2322를 headless 타입 결함으로 보고 공개 타입을 넓히거나 cast를 추가하는 것. tsconfig를 이번 작업에서 바꾸는 것(루트 규칙상 사용자 확인 대상).
- 위험: 존재하지 않는 API 결함을 고치느라 공개 타입을 오염시키고, 형제 headless 티켓마다 같은 조사를 반복한다.

## 변경 이력

- 2026-10-01: DES-2636 Field headless 분리의 독립 consumer 검증에서 기록했다.

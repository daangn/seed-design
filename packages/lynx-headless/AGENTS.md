# packages/lynx-headless

## 디렉토리 개요

Lynx 전용 headless primitive 패키지를 component 단위로 제공하는 폴더다. `packages/react-headless`와 같은 역할을 Lynx 런타임 제약에 맞춰 수행하며, `packages/lynx-react`는 이 패키지 위에 SEED recipe 스타일을 얹는다.

## 파일 작성 컨벤션

- 각 컴포넌트는 `packages/lynx-headless/<component>` 아래에 독립 패키지로 둔다.
- 공개 진입점은 `src/index.ts`에서 정리하고, namespace export가 필요한 컴포넌트는 `<Component>.namespace.ts`를 둔다.
- 테스트는 각 패키지의 `src/__tests__` 아래에 둔다.

## 코드 작성 컨벤션

- React DOM headless 로직, DOM primitive, hidden input, form/focus 모델을 공유하지 않는다.
- native `<view>` / `<text>`는 해당 headless 컴포넌트 파일 안에 literal JSX로 작성한다.
- 상태는 render props/context로 노출하고, 자동 상태 class는 주입하지 않는다.
- styled recipe, SEED token, className recipe 조합은 넣지 않는다. 그런 책임은 `packages/lynx-react`에 둔다.

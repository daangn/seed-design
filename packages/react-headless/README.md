# React Headless Libraries

SEED React의 토대가 되는 Headless UI 라이브러리입니다.

SEED 디자인 시스템의 컴포넌트 요구사항을 위한 최소한의 기능을 제공합니다. 일반적인 사용 사례에 적합하지 않을 수 있습니다.

## Requirements

- 스타일 관련 로직은 없이 순수 컴포넌트 데이터 로직만 제공합니다. (스타일 관련된 컴포넌트 로직 및 옵션은 `@seed-design/react` 패키지에서 제공합니다.)
- 중요 비즈니스 로직은  커스텀 훅 파일에 작성합니다. e.g. `use{Component}.ts`
- 컴포넌트 복잡도에 따라 커스텀 훅 파일을 여러 개 작성할 수 있습니다.
- 컴포넌트 파일은 단순히 커스텀 훅에서 내보내는 parts들의 props를 spread하여 조합된 Primitive 컴포넌트들을 내보냅니다. e.g. `{Component}.tsx`
- 제공하는 data attributes는 headless에서 스타일만을 위한 computed된 prop을 내려주는 것이 아니라, 컴포넌트의 상태를 나타내는 데이터들 위주로 작성되어야 합니다. e.g. `data-checked`, `data-disabled`, `data-invalid`, `data-required`
- parts가 여러 개인 경우 `{Component}.namespace.ts` barrel file을 정의하여 내보냅니다.

## Common Dependencies

- `@seed-design/react-primitive`
- `@seed-design/dom-utils`
- `@radix-ui/react-compose-refs`
- `@radix-ui/react-use-controllable-state`
- `@radix-ui/react-use-layout-effect`
- `@radix-ui/react-use-size`
- `@radix-ui/react-use-callback-ref`

## Prior Arts

- [Radix UI](https://radix-ui.com/primitives)
- [React Aria](https://react-spectrum.adobe.com/react-aria)
- [Zag.js](https://zagjs.com), [Ark UI](https://ark-ui.com)
- [Ariakit](https://ariakit.org)

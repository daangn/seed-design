# packages/lynx-react

`@seed-design/react`의 Lynx 대응 스타일드 컴포넌트 패키지(`@seed-design/lynx-react`)다. `@seed-design/lynx-css` Recipe와 `packages/lynx-react-headless/*` 로직을 조합하며 Lynx 런타임 제약을 따른다.

## 검증

루트 `bun test:lynx-react`가 기본이다. 이 패키지만 빠르게 돌릴 때:

- `bun --filter @seed-design/lynx-react test`: Vitest와 ReactLynx Testing Library
- `bun --filter @seed-design/lynx-react typecheck`: 소스와 테스트 tsconfig를 둘 다 검사

## 규칙

### 런타임 불변식

어기면 타입 검사는 통과하고 기기에서만 깨진다.

- intrinsic tag(`<view>`, `<text>`, `<image>`) → 컴포넌트 파일 안에서 리터럴 JSX로 렌더링한다. 변수 tag, `React.createElement("view", ...)`, 공통 유틸의 native tag factory, `withProvider`·`withContext`에 intrinsic string 전달을 쓰지 않는다. `React.createElement` 형태로 컴파일되어 Lynx 컴파일러의 리터럴 JSX 정적 분석을 우회하고 `BackgroundSnapshot not found` 런타임 오류를 낸다(`src/utils/create-slot-recipe-context.tsx`의 `assertNotIntrinsicComponent`가 막는다). slot factory가 필요하면 `components/SwipeableMenuSheet/SwipeableMenuSheet.tsx`의 `createViewSlot`처럼 파일 안에서 리터럴 JSX를 반환한다.
- `children` → `{...nativeProps}`에 섞지 않는다. `const { children, ...nativeProps } = restProps`로 분리해 JSX children으로 넘긴다.
- ref → `forwardRef`에서 null ref를 Lynx primitive에 넘기지 않는다. `{...(ref ? { ref } : {})}`로 있을 때만 전달한다.
- CSS `inherit` → Lynx가 지원하지 않는다. 필요한 값은 요소에 직접 적용한다.

### 파일과 공개 API

- 컴포넌트는 `src/components/<ComponentName>/`에 `<ComponentName>.tsx`, `index.ts`, 필요하면 `<ComponentName>.namespace.ts`를 둔다. 훅은 `src/hooks/<useName>.ts`, 유틸은 `src/utils/<util-name>.ts`에 둔다.
- 테스트는 대상 옆 `<file>.test.{ts,tsx}`에 둔다(`Menu/__tests__/`만 예외).
- 새 공개 모듈 → 컴포넌트 `index.ts`에서 이름으로 re-export하고 `src/index.ts`까지 연결해야 공개된다.

### 컴포넌트 구성

- 모든 컴포넌트는 `React.forwardRef`와 `displayName`을 쓴다.
- Recipe는 `@seed-design/lynx-css/recipes/<name>`에서 import하고, Recipe className과 사용자 `className`을 `clsx`로 병합한다. React 레이어에 `style`을 직접 쓰지 않는다 → Recipe로 옮긴다.
- variant props(`size`, `tone`, `variant` 등)를 손으로 destructuring하거나 타입 캐스트로 분리하지 않는다 → 단일 Recipe는 `recipe.splitVariantProps(props)`, 여러 Recipe는 `src/utils/split-multiple-variants-props.ts`의 `splitMultipleVariantsProps(props, recipes)`, compound Recipe는 `createSlotRecipeContext`가 주는 분리 도구를 쓴다.
- compound Recipe의 className·slot 연결 → `../../utils/create-slot-recipe-context`의 `createSlotRecipeContext`. 이 도구는 className·slot 연결만 맡는다.
- checked, disabled, 계산된 문자열, ref 같은 런타임 상태 → 컴포넌트 파일의 `React.createContext`로 전달한다. context가 없으면 throw해 잘못된 조합을 드러낸다.

### 애니메이션

- 프레임 기반 → `requestAnimationFrame`을 쓴다. `setInterval`을 쓰지 않는다.
- main thread 애니메이션 → `useMainThreadRef`, `main-thread:ref`, `"main thread"` directive 같은 기존 패턴을 따른다. thread 사이에 공유하는 함수는 각 실행 환경의 directive 규칙을 확인한다.
- 반복 애니메이션 → React state 대신 `setStyleProperty`·`setStyleProperties`로 스타일을 직접 갱신한다.

### 웹과의 차이 문서화

- Lynx가 지원하지 않는 prop → 타입에서 `Omit`하고 `@platform Lynx` JSDoc을 단다.
- Lynx 지원 범위를 바꿈 → `docs/content/lynx/components/<component>.mdx`도 확인한다.
- frontmatter `compatibility.lynx` → 확정된 Lynx Engine 최소 버전과 XElement가 있을 때만 쓴다.

# packages/lynx-react

## 디렉터리 개요

Lynx 플랫폼용 스타일드 React 컴포넌트 패키지다. `@seed-design/react`의 Lynx 대응 구현을 제공하며 Lynx 런타임 제약을 함께 반영한다.

## 런타임 불변식

- `{...nativeProps}`에 `children`을 포함하지 않는다. `children`을 분리해 JSX children으로 전달한다.
- `forwardRef`에서 null ref를 Lynx primitive에 전달하지 않는다.
- Lynx가 지원하지 않는 CSS `inherit` 패턴에 의존하지 않는다. 필요한 값은 요소에 직접 적용한다.
- `<view>`, `<text>`, `<image>` 같은 intrinsic tag는 컴포넌트 파일 안에서 리터럴 JSX로 렌더링한다. 런타임 변수 tag, `React.createElement("view", ...)`, 공통 유틸 파일의 native tag factory를 사용하지 않는다.

```tsx
const { children, ...nativeProps } = restProps;

return (
  <view {...(ref ? { ref } : {})} {...nativeProps}>
    {children}
  </view>
);
```

## 파일 작성 컨벤션

- 컴포넌트: `src/components/<ComponentName>/<ComponentName>.tsx`와 `index.ts`
- 훅: `src/hooks/<useName>.ts`
- 유틸리티: `src/utils/<util-name>.ts`
- 테스트: 각 영역의 `__tests__/<file>.test.{ts,tsx}`
- 최상위 `src/index.ts`와 각 폴더의 `index.ts`에서 공개 모듈을 명시적으로 re-export한다.

## 코드 작성 컨벤션

- 모든 컴포넌트는 `React.forwardRef`와 `displayName`을 사용한다.
- Recipe는 `@seed-design/lynx-css/recipes/<name>`에서 import한다.
- Recipe className과 사용자 `className`은 `clsx`로 병합한다.
- React 레이어에 직접 `style`을 작성하지 않고 Recipe에서 스타일을 관리한다.
- compound component의 Recipe slot은 `createSlotRecipeContext`로 연결한다. import 경로는 `../../utils/create-slot-recipe-context`다.
- native `<view>`/`<text>` slot은 `withContext`에 intrinsic string을 전달하지 않는다. 필요한 factory는 해당 컴포넌트 파일 안에서 리터럴 JSX를 렌더링하도록 작성한다.

### Variant props

- variant props(`size`, `tone`, `variant` 등)는 수동 destructuring하거나 타입 캐스트로 분리하지 않는다.
- 단일 Recipe는 `recipe.splitVariantProps(props)`를 사용한다.
- 여러 Recipe는 `splitMultipleVariantsProps(props, recipes)`를 사용한다.
- compound Recipe는 `createSlotRecipeContext`가 제공하는 분리·slot 연결 도구를 사용한다.

### Compound context

- `createSlotRecipeContext`는 Recipe className과 slot 연결을 담당한다.
- checked, disabled, 계산된 문자열, ref 같은 런타임 상태는 컴포넌트 파일의 `React.createContext`로 전달한다.
- context가 없을 때는 throw해 잘못된 조합을 숨기지 않는다.

### 애니메이션

- 프레임 기반 애니메이션은 `requestAnimationFrame`을 사용하고 `setInterval`을 사용하지 않는다.
- main-thread 애니메이션은 `useMainThreadRef`, `main-thread:ref`, `"main thread"` directive 등 기존 Lynx 패턴을 따른다.
- 반복 애니메이션은 React state보다 `setStyleProperty`/`setStyleProperties`를 우선해 직접 스타일을 갱신한다.
- main thread와 background thread 사이에서 공유할 함수는 각 실행 환경의 directive 규칙을 확인한다.

## 웹과의 차이 문서화

- Lynx에서 지원하지 않는 prop은 `Omit`과 `@platform Lynx` JSDoc으로 타입에 반영한다.
- 컴포넌트의 Lynx 지원 차이를 변경하면 해당 `docs/content/lynx/<component>.mdx`도 확인한다.
- 확정된 Lynx Engine 최소 버전과 XElement가 있을 때만 문서 frontmatter의 `compatibility.lynx`에 기록한다.

## 테스트

`vitest`와 ReactLynx Testing Library를 사용한다.

```bash
bun run test
bun test:lynx-react
```

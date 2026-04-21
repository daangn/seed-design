# AGENTS.md — packages/lynx-react

## 디렉토리 개요

Lynx 플랫폼용 스타일드 React 컴포넌트 패키지. `@seed-design/react`의 Lynx 대응 버전으로, Lynx 런타임 제약에 맞춘 구현을 제공한다.

## Lynx 런타임 주의사항

### children은 nativeProps와 분리

`{...nativeProps}`로 spread하면 `children`이 포함되어 Lynx의 `commitPatchUpdate`에서 circular reference 에러 발생. 항상 children을 별도로 추출해서 JSX children으로 전달한다.

```tsx
const { children, ...nativeProps } = restProps;
<view {...nativeProps}>{children}</view>
```

### ref null 가드

Lynx의 `applyRef`는 null ref에 `.current`를 설정하려고 에러를 던진다. `forwardRef` 사용 시 ref가 null이면 전달하지 않는다.

```tsx
const mergedProps = {
  ...(ref ? { ref } : {}),
  className,
  style,
};
```

### inherit 키워드 미지원

Lynx는 CSS `inherit` 키워드를 지원하지 않는다. CSS variable을 `inherit`로 초기화하는 패턴(웹의 `.seed-text`)은 Lynx에서 동작하지 않으므로, 스타일을 요소에 직접 적용해야 한다.

### Primitive.view 사용 시 BackgroundSnapshot 에러

`@seed-design/lynx-primitive`의 `Primitive.view`는 내부적으로 `forwardRef`로 한 번 더 감싸는데, 이 추가 컴포넌트 레이어가 Lynx 런타임의 `BackgroundSnapshot` diff 알고리즘과 충돌하여 `BackgroundSnapshot not found: view` 에러를 발생시킬 수 있다. 스타일드 컴포넌트에서는 네이티브 `<view>` 요소를 직접 사용하고, `asChild` 패턴이 필요하면 `Slot`을 직접 import해서 조건부 렌더링한다.

```tsx
// ❌ BackgroundSnapshot 에러 발생 가능
<Primitive.view ref={ref} className={className}>{children}</Primitive.view>

// ✅ 네이티브 <view> 직접 사용
<view {...(ref ? { ref } : {})} className={className}>{children}</view>
```

### 애니메이션 패턴

Lynx에서 프레임 기반 애니메이션을 구현할 때는 다음 패턴을 따른다. lynx-ui(Lynx 공식 UI 라이브러리)의 패턴과 일치한다.

1. **`requestAnimationFrame` 사용** (`setInterval` 사용 금지)
   - 디스플레이 refresh rate에 동기화됨
   - `setInterval`은 프레임 타이밍과 무관하게 실행되어 jank 유발

2. **Main thread 실행** (`'main thread'` directive)
   - 애니메이션 로직은 main thread에서 실행하여 크로스 스레드 오버헤드 제거
   - `useMainThreadRef`로 element 참조 획득, `main-thread:ref` 속성으로 바인딩

3. **직접 스타일 변경** (`setStyleProperty` / `setStyleProperties`)
   - React `setState` 대신 DOM 직접 조작으로 리렌더 제거
   - 다수 인스턴스가 동시에 애니메이션할 때 성능 차이가 극적

4. **인스턴스별 독립 루프** (현재 제약)
   - Lynx main thread에서 모듈 레벨 `Map`/`Set` 사용 불가로 공유 루프 구현 불가
   - 각 인스턴스가 독립 RAF 루프 실행. 다수 인스턴스 시 성능 저하 가능
   - `clip-path`가 Lynx에서 animatable이 아니라 JS로 매 프레임 SVG path 생성 필요

5. **스레드 간 함수 공유 불가**
   - `"main thread"` directive 함수는 background thread(render)에서 호출 불가 (worklet 변환됨)
   - 반대로 directive 없는 함수는 main thread 번들에 미포함
   - 양쪽에서 필요한 로직은 각 스레드용 복사본 유지 (예: `bgPieClipPath` + `pieClipPath`)

## 미지원 기능 문서화 컨벤션

Lynx 플랫폼 제약으로 웹 대비 미지원 기능이 있을 때, 다음 세 곳에 일관되게 반영한다:

### 1. 컴포넌트 타입 (`Omit` + JSDoc)

미지원 prop은 `Omit`으로 타입에서 제거하고, 인터페이스 위에 `@platform Lynx` JSDoc으로 미지원 목록/사유/지원 조건을 명시한다. 제거된 prop의 기본값은 recipe 호출 시 하드코딩한다.

```tsx
/**
 * @platform Lynx
 *
 * Lynx 미지원 기능 (Lynx 3.7 SVG 지원 후 추가 예정):
 * - featureName: 미지원 사유
 *
 * 웹 대비 미지원 기능:
 * - featureName: 미지원 사유
 */
export interface ComponentProps
  extends Omit<RecipeVariantProps, "unsupportedProp1" | "unsupportedProp2"> {
  // ...
}
```

### 2. docs/content/lynx/ 문서 (MDX)

해당 컴포넌트의 `docs/content/lynx/<component>.mdx`에 미지원 기능 섹션을 포함한다. 컴포넌트 코드 변경 시 문서 동기화를 항상 함께 수행한다.

### 3. 공통 미지원 사유

| 사유 | 영향 받는 기능 예시 |
|------|---------------------|
| Lynx 3.7 SVG 지원 대기 | loading spinner, iconOnly layout, PrefixIcon/SuffixIcon |
| CSS variable 동적 주입 제한 | color, fontWeight, bleedX/bleedY |

## 코드 작성 컨벤션

- 모든 컴포넌트는 `React.forwardRef` 사용 + ref null 가드
- 네이티브 `<view>` 요소 직접 사용 (`Primitive.view` 사용 금지 — BackgroundSnapshot 에러)
- `displayName` 필수
- `clsx`로 recipe className과 사용자 `className` 병합
- recipe import: `@seed-design/lynx-css/recipes/<name>` (웹의 `@seed-design/css`가 아니다)

## Variant Props 처리 패턴

variant props(`size`, `tone`, `variant` 등)는 반드시 아래 패턴 중 하나로 처리한다.

| 유형 | 도구 | 예시 |
|------|------|------|
| 단일 recipe | `recipe.splitVariantProps(props)` | ActionButton |
| 다중 recipe (한 컴포넌트가 두 개 이상 recipe 사용) | `splitMultipleVariantsProps(props, { a, b })` | Switch |

`splitMultipleVariantsProps`는 `../../utils/split-multiple-variants-props`에서 import 한다. 각 recipe의 variant bucket과 어느 recipe도 claim하지 않은 `restProps`로 분리해 준다. 공유 variant 키(예: 두 recipe 모두 `size`를 받는 경우)는 양쪽 bucket에 복제된다.

```tsx
const [{ switch: switchVariantProps, switchmark: switchmarkVariantProps }, restProps] =
  splitMultipleVariantsProps(props, { switch: switchStyle, switchmark });
```

### 절대 금지: variant props 수동 destructuring / 타입 캐스트

variant가 추가/변경될 때 누락 위험이 있고 타입 안전성이 깨진다.

```tsx
// ❌ 함수 인자에서 variant를 직접 꺼내지 않는다
const { size, tone, ...rest } = props;

// ❌ 특정 prop만 타입 캐스트로 뽑지 않는다
const { tone, ...rest } = props as { tone?: Tone } & Rest;
```

## Compound Component Context

Compound 컴포넌트(Root + 하위 슬롯 구조)는 React Context로 상태/variant를 공유한다. `createCompoundContext` 헬퍼(`../../utils/create-compound-context`)를 사용해 Context와 strict consumer hook을 한번에 생성한다.

```tsx
import { createCompoundContext } from "../../utils/create-compound-context";

const [SwitchContext, useSwitchContext] =
  createCompoundContext<SwitchContextValue>("SwitchRoot");
```

- Root에서 `Context.Provider`로 value 감싸고, value는 `useMemo`로 안정화
- 하위 컴포넌트는 `useSwitchContext("SwitchThumb")` 형태로 읽는다 (인자는 에러 메시지의 JSX 태그명)
- **Context 누락 시 정책은 `throw` 통일**. 의도 명확, 오용 즉시 발견, 웹 `createSlotRecipeContext`와 일관.

warn + fallback 패턴은 금지. fallback 값이 "정상 렌더링"으로 보여 버그를 감춘다.

### 변형 override를 지원할 때

중간 슬롯(예: `SwitchControl`)에서 variant props를 받아 Root의 기본값을 override 하고 싶으면, 그 슬롯이 자체적으로 `recipe()`를 호출해 계산한 className 번들을 두 번째 Context로 하위 슬롯(예: `SwitchThumb`)에 전달한다. Root Context에는 **기본값**만 실어 보내고, 실제 적용 className은 override 가능한 슬롯에서 계산한다.

## Variant Props 처리 패턴

variant props는 반드시 아래 패턴 중 하나로 처리한다. 세 패턴 모두 내부적으로 `splitVariantProps`를 사용하여 variant props와 네이티브 속성을 타입 안전하게 분리한다.

| 유형 | 도구 | Lynx 예시 |
|------|------|----------|
| 직접 splitVariantProps | `recipe.splitVariantProps(props)` | ActionButton, ProgressCircle |
| 복합 슬롯 | `createSlotRecipeContext` → `withContext` | BottomSheet |
| 다중 Recipe | `splitMultipleVariantsProps` | (추후 포팅 예정 — 별도 PR) |

### 절대 금지: variant props 수동 destructuring

`({ variant, size, ...rest })` 형태로 variant를 함수 인자에서 직접 꺼내거나, `recipe({ variant, size })` 형태로 직접 전달하면 안 된다. variant가 추가/변경될 때 누락 위험이 있고, 타입 안전성이 보장되지 않는다.

### SlotRecipe 사용 패턴

복합 컴포넌트(슬롯이 여러 개인 경우)는 `createSlotRecipeContext`를 사용한다.

- **import 경로**: `../../utils/create-slot-recipe-context`
- `createSlotRecipeContext(slotRecipe)` 호출 결과에서 `ClassNamesProvider`, `withContext`, `useClassNames` 등을 꺼내 사용한다.
- **외부 컴포넌트 슬롯** (lynx-ui 등): `withContext(Component, "slotName")` 한 줄로 연결한다.
- **네이티브 `<view>`/`<text>` 슬롯**: `withContext`의 첫 인자로 문자열(`"view"`, `"text"`)을 넘기지 말고, 반드시 `forwardRef` 본문에 **리터럴 `<view>`/`<text>` JSX**를 작성한 헬퍼(`createViewSlot`/`createTextSlot`)를 사용한다.
  - `withContext("view", ...)`는 `React.createElement(Component)`로 컴파일되어 Lynx 컴파일러의 `<view>` 정적 분석을 우회하고 **`BackgroundSnapshot not found: view` 런타임 에러**를 유발한다.
  - 이는 `Primitive.view` 사용 시 발생하는 것과 동일한 BackgroundSnapshot diff 충돌이다.
- Root에 상태(예: Trigger용 imperative ref) context를 추가해야 하면 `ClassNamesProvider`를 수동으로 중첩하고 Root 자체는 `forwardRef`로 직접 구현한다.

### 절대 금지: React 레이어에 style prop 직접 작성

스타일은 반드시 recipe를 통해 className으로 적용한다. `style` prop 직접 작성은 금지.

## 파일 작성 컨벤션

- 컴포넌트: `src/components/<ComponentName>/<ComponentName>.tsx` + `index.ts`
- 유틸리티: `src/utils/<util-name>.ts`
- 테스트: `src/<...>/__tests__/<file>.test.{ts,tsx}`
- 빌드: `tsc`로 `lib/`에 출력 (테스트 파일은 `tsconfig.json`의 `exclude`로 제외)

## 테스트

lynx-react는 vitest + ReactLynx Testing Library를 사용한다 (다른 패키지의 bun:test와 다름).

실행:

```bash
bun run test              # 패키지 내부
bun lynx-react:test       # 루트에서
```

훅 테스트는 `@lynx-js/react/testing-library`의 `renderHook` / `act`를 쓴다.

```ts
import { act, renderHook } from "@lynx-js/react/testing-library";
import { describe, expect, it } from "vitest";

it("updates value", () => {
  const { result } = renderHook(() => useSomeHook());
  act(() => result.current.setValue(42));
  expect(result.current.value).toBe(42);
});
```

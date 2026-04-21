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

### Primitive.view 사용 금지

`@seed-design/lynx-primitive`의 현재 `Primitive.view` 구현은 `<Comp>` 변수 태그로 렌더하기 때문에 파일 소스에 **리터럴 `<view>` JSX 가 존재하지 않는다**. 이는 Lynx 컴파일러의 intrinsic tag 정적 분석을 우회해 `BackgroundSnapshot not found: view` 런타임 에러를 유발한다. 스타일드 컴포넌트에서는 네이티브 `<view>` 요소를 직접 사용하고, `asChild` 패턴이 필요하면 `Slot`을 직접 import해서 조건부 렌더링한다.

```tsx
// ❌ 금지 — Primitive.view 내부가 <Comp> 변수 태그를 사용
<Primitive.view ref={ref} className={className}>{children}</Primitive.view>

// ✅ 네이티브 <view> 직접 사용
<view {...(ref ? { ref } : {})} className={className}>{children}</view>
```

자세한 허용/금지 패턴은 아래 "Native tag literal JSX constraint" 섹션 참조.

### Native tag literal JSX constraint

Lynx 컴파일러는 JSX 의 intrinsic 태그(`<view>`, `<text>`, `<image>` 등)를 **컴파일 타임에 리터럴 JSX** 로 만나야 native element 로 등록한다. 조건이 깨지면 runtime 에 `BackgroundSnapshot not found: view` 에러가 난다.

#### 조건을 깨는 패턴 (금지)

- **intrinsic tag 를 runtime 변수로 전달**: `React.createElement("view", ...)` 또는 `const Tag = "view"; <Tag />`. 대표 실패 케이스는 `withContext("view", "header")` 가 `React.createElement(Component, ...)` where `Component === "view"` 로 컴파일되어 **PR #1489 에서 실제 재현 + revert 된 사례**.
- **소스에 리터럴 intrinsic 태그가 없는 JSX**: `@seed-design/lynx-primitive` 의 현재 `Primitive.view` 구현이 `<Comp>` 변수 태그만 사용 — 사용 금지.

#### 조건을 만족하는 안전한 패턴

- **리터럴 `<view>` / `<text>` JSX 를 `forwardRef` 본문에 직접 작성** — lynx-ui 의 모든 slot 이 쓰는 방식. 이 `forwardRef` 를 생성하는 factory 를 같은 컴포넌트 파일 안에 두는 것도 OK (예: BottomSheet 의 `createViewSlot` / `createTextSlot`).
- **React 함수 컴포넌트를 `withContext` 에 넘기기**: `withContext(SheetBackdrop, "backdrop")` — Component 인자가 함수 컴포넌트이고 그 컴포넌트 본문에 리터럴 `<view>` / `<text>` 가 있는 경우. intrinsic string 을 인자로 넘기는 것만 금지.

#### 허용 / 금지 요약

| 패턴 | 리터럴 `<view>` 소스에? | 결과 |
|---|---|---|
| `forwardRef((p, ref) => <view ...>...</view>)` (컴포넌트 파일 안) | ✅ | 표준 |
| 같은 컴포넌트 파일 안의 factory (예: BottomSheet `createViewSlot`) | ✅ | 표준 |
| `withContext(SheetBackdrop, "backdrop")` | ✅ (SheetBackdrop 파일 안에 리터럴 `<view>`) | ship 실증 |
| `withContext("view", "header")` | ❌ createElement 에 string | PR #1489 실패 재현 |
| **공통 유틸 파일의 factory (예: createSlotRecipeContext 안의 `withViewContext`)** | ❌ 리터럴 `<view>` 가 **다른 파일**에 있음 | **PR #1503 spike 에서 실패 재현** |
| `Primitive.view` (현재 SEED 구현) | ❌ `<Comp>` 변수 태그 | 사용 금지 |
| `const Tag = "view"; <Tag />` | ❌ | 금지 |

#### ⚠️ 파일-경계 제약 (2026-04-22 PR #1503 spike 로 확인)

리터럴 `<view>` / `<text>` JSX 는 **그 native element 가 최종 렌더되는 컴포넌트 파일과 동일한 파일 안**에 있어야 한다. 공통 유틸 파일(`create-slot-recipe-context.tsx` 등) 에 factory 를 선언해 그 반환값을 컴포넌트에서 export 하는 패턴은 **Lynx 에서 동작하지 않는다** — factory 의 `forwardRef` 본문에 리터럴 `<view>` 가 있어도 Lynx 컴파일러의 정적 분석은 파일 단위로 작동해 해당 native tag 를 컴포넌트 파일의 렌더 트리에 등록하지 못한다.

실증 근거:
- `createViewSlot(slotName)` (BottomSheet.tsx **안**의 factory) → ✅ ship 되어 작동 중
- `withViewContext(slotName)` (create-slot-recipe-context.tsx **안**의 구조 동일 factory) → ❌ `BackgroundSnapshot not found: view` 런타임 에러 (PR #1503 spike)
- 두 factory 의 구조는 완전히 동일, 차이점은 선언 파일 위치뿐.

함의: 여러 컴포넌트가 유사한 native slot 패턴을 공유하려 해도 **공통 helper 로 뽑을 수 없다**. 각 컴포넌트 파일에서 리터럴 JSX 를 (필요하면 파일-내 factory 로) 직접 작성해야 한다. 이는 lynx-ui 가 13 개 compound 패키지에서 helper 없이 slot 을 각자 작성하는 이유와 일치한다.

#### 근본 원인 (엔진 레벨)

`lynx/core/renderer/dom/element_property.cc:33` 의 `ConvertStringTagToEnumTag()` 가 tag 를 enum 으로 변환하고 실패하면 `ELEMENT_EMPTY` 를 반환한다. 리터럴 JSX 는 컴파일 타임에 enum 으로 최적화되지만 runtime 변수 경로는 enum 매핑이 제때 해소되지 않아 native element 가 등록되지 않는다.

"BackgroundSnapshot" 용어는 공개 엔진 소스에 매치 0 건 — SEED 팀이 실제 관찰한 런타임 에러 메시지이며 공식 문서화는 없다. 본 제약은 **PR #1489 (intrinsic string) + PR #1503 (다른 파일의 helper) 의 실패 재현**과 현재 ship 된 안전 패턴으로만 검증된다.

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

Compound 컴포넌트(Root + 하위 슬롯 구조)가 **런타임 상태**(예: `checked`, `disabled`)를 하위에 전파할 때는 React 기본 `createContext`를 **inline으로** 사용한다. lynx-ui의 13개 compound 패키지(switch / checkbox / dialog / radio-group / sheet / popover 등)가 전부 이 패턴을 쓴다. 별도 helper(`createCompoundContext` 등)는 두지 않는다.

역할 구분:

- **`createSlotRecipeContext`**: recipe 호출 결과 **className 맵**을 자동 주입. "스타일" 전용.
- **inline `React.createContext<T | null>(null)`**: 임의의 **런타임 값/상태**(boolean, 계산된 문자열, ref 등)를 하위 slot에 전파. "스타일 아닌 것" 전용.

두 Context를 한 컴포넌트에서 같이 쓰는 경우가 흔하다(예: Switch).

### 표준 패턴

```tsx
import * as React from "react";

interface SwitchContextValue {
  checked: boolean;
  disabled: boolean;
  size: SwitchSize;
  tone: SwitchTone;
}

const SwitchContext = React.createContext<SwitchContextValue | null>(null);

function useSwitchContext(consumer: string): SwitchContextValue {
  const ctx = React.useContext(SwitchContext);
  if (!ctx) {
    throw new Error(`<${consumer}/> must be rendered inside <SwitchRoot/>.`);
  }
  return ctx;
}
```

- Root에서 `<SwitchContext.Provider value={useMemo(...)}>` 로 감싼다. value는 `useMemo`로 안정화해서 불필요한 리렌더를 막는다.
- 하위 slot은 `useSwitchContext("SwitchThumb")` 로 읽고, 인자는 에러 메시지에 사용될 JSX 태그명이다.
- **Context 누락 시 정책은 throw 통일**. warn + fallback은 금지 — fallback 값이 "정상 렌더링"처럼 보여 버그를 감춘다(웹 SEED의 `createSlotRecipeContext`와 일관).

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
- **네이티브 `<view>` / `<text>` 슬롯**: `withContext` 를 사용할 수 없다. 컴포넌트 파일 안에 `forwardRef` 본문에 **리터럴 `<view>` / `<text>` JSX** 를 직접 작성해야 한다. 같은 recipe 의 여러 slot 을 위해서는 **컴포넌트와 동일한 파일 안에** factory (예: `createViewSlot`) 를 두고 반복 호출한다. factory 를 `createSlotRecipeContext` 같은 공통 유틸 파일에 두면 Lynx 컴파일러의 파일-스코프 정적 분석을 통과하지 못해 `BackgroundSnapshot not found: view` 에러를 일으킨다 (PR #1503 spike 로 확인 — 자세한 내용: "Native tag literal JSX constraint" 섹션).
- Root에 상태(예: Trigger용 imperative ref) context를 추가해야 하면 `ClassNamesProvider`를 수동으로 중첩하고 Root 자체는 `forwardRef`로 직접 구현한다.

### 절대 금지: React 레이어에 style prop 직접 작성

스타일은 반드시 recipe를 통해 className으로 적용한다. `style` prop 직접 작성은 금지.

## 파일 작성 컨벤션

- 컴포넌트: `src/components/<ComponentName>/<ComponentName>.tsx` + `index.ts`
- 훅: `src/hooks/<use-name>.ts` (`useState` / `useEffect` / `useContext` 등 React API 를 직접 호출하는 파일)
- 유틸리티: `src/utils/<util-name>.ts` (순수 함수 / 팩토리. React 훅은 `src/hooks/` 로 분리)
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

# Accordion Headless 추출 + 타입 정리 + 테스트 Spec

**Date:** 2026-04-16
**Branch:** `junghyeonsu/accordion-component`
**Related:** PR #1405

## Context

현재 `packages/react/src/components/Accordion/`에 headless 로직(상태 관리, ARIA, 키보드 네비게이션)과 styled 로직(recipe, classNames, withContext)이 섞여 있다. 코드 리뷰에서 블로커 3가지가 발견되었다:

1. **useAccordion의 `as` 타입 단언** — `as UseAccordionSingleProps` / `as UseAccordionMultipleProps` 사용 중. 팀 전반의 코드 퀄리티 원칙상 `as`와 `any`는 최대한 지양해야 한다.
2. **`AccordionTriggerProps`가 `React.HTMLAttributes`를 상속** — 버튼 전용 속성(`type`, `form`, `autoFocus` 등)이 누락되어 `React.ButtonHTMLAttributes`를 써야 한다.
3. **useAccordion 테스트 없음** — `TextField`, `ImageFrame` 등 다른 컴포넌트는 `.test.tsx`를 두는데 Accordion은 없다.

이와 함께 구조적으로 **headless 로직을 별도 패키지(`@seed-design/react-accordion`)로 분리**할 필요가 있다. Radix, Base UI가 모두 accordion/collapsible을 분리한 패턴을 쓰고 있고, SEED 기존 컴포넌트(`radio-group` → `fieldset`)도 headless-to-headless dependency를 이미 사용한다.

`disabled` vs `aria-disabled` 이중 적용 이슈는 **known issue로 유지**한다 (다른 SEED 컴포넌트 Tabs, FieldButton 등과 동일 패턴).

## Goals

1. `@seed-design/react-accordion` headless 패키지 신규 생성
2. `packages/react/src/components/Accordion/`을 styled-only wrapper로 축소
3. Type guard predicate로 `as` 캐스트 완전 제거
4. `AccordionTriggerProps`를 `React.ButtonHTMLAttributes<HTMLButtonElement>`로 수정
5. `useAccordion`, `Accordion` 단위/통합 테스트 추가
6. 사용자 대상 public API는 **변경 없음** (AccordionHeader 추가는 snippet 레이어에서 자동 감쌈)

## Non-goals

- `disabled` vs `aria-disabled` 이중 적용 변경 (known issue)
- 기존 `variant`(inline/separated), `size`(medium/large) API 변경
- 스타일링 결과 변경 (recipe slot은 `header` 추가만, 기존은 유지)

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Headless 분리 | 신규 `@seed-design/react-accordion` 패키지 | Radix 패턴 + SEED radio-group 선례. 재사용성/유지보수성 |
| Collapsible 의존성 | `@seed-design/react-collapsible`에 직접 의존 | Radix와 동일. ResizeObserver/height/animation 로직 재사용 |
| Collapsible 위임 방식 | **컴포넌트 레벨 위임** (Radix A 패턴) | `<Collapsible.Root>`/`<Collapsible.Trigger>`/`<Collapsible.Content>`를 각각 감쌈. 수동 조립 최소화 |
| AccordionHeader | 신규 추가 (`<h3>`) | WAI-ARIA APG 권장. Radix도 포함. snippet에서 자동 감쌈 → 사용자 API 변경 없음 |
| type system | `type="single"\|"multiple"` discriminated union 유지 | 기존 API 유지. value 타입이 `string` vs `string[]`로 자동 추론되는 장점 |
| `as` 제거 전략 | Radix 분리 패턴 (`AccordionImplSingle`/`AccordionImplMultiple`) | SEED 내 선례 없음. 외부에서 유일하게 이 조합을 `as` 없이 처리하는 방식 |
| `AccordionTriggerProps` | `ButtonHTMLAttributes<HTMLButtonElement>` | Chip과 동일 |
| disabled vs aria-disabled | 현재 이중 적용 유지 | Tabs/FieldButton과 동일 패턴, known issue로 관리 |

## Architecture

### Package Layout

```
packages/react-headless/accordion/              (신규)
├── package.json
│   ├── name: @seed-design/react-accordion
│   └── dependencies:
│       ├── @seed-design/react-collapsible
│       ├── @seed-design/react-primitive
│       ├── @seed-design/dom-utils
│       ├── @radix-ui/react-use-controllable-state
│       └── @radix-ui/react-compose-refs
├── tsconfig.json (extends ../../../tsconfig.headless.json)
├── src/
│   ├── index.ts
│   ├── Accordion.namespace.ts
│   ├── Accordion.tsx
│   ├── useAccordion.ts
│   ├── useAccordionContext.tsx
│   ├── useAccordionItemContext.tsx
│   ├── dom.ts
│   ├── useAccordion.test.tsx
│   └── Accordion.test.tsx
└── lib/ (bunchee build output)

packages/react/src/components/Accordion/        (기존, 축소)
├── Accordion.tsx (styled-only, ~80줄)
├── Accordion.namespace.ts
└── index.ts
```

### Data Flow

```
AccordionRoot (discriminated union Props)
  └─ type === "single" ? AccordionImplSingle : AccordionImplMultiple
      └─ AccordionImpl (공통 DOM + keyboard handler)
         └─ AccordionProvider({ api = useAccordion(narrowed_props) })
            └─ Primitive.div (data-disabled, onKeyDown)
               └─ AccordionItem
                  └─ AccordionItemProvider({ value, open, disabled, triggerId })
                     └─ <Collapsible.Root open={derived} onOpenChange={toggle}>  ← controlled
                        └─ AccordionHeader (<h3>)
                           └─ AccordionTrigger (<Collapsible.Trigger>, aria-controls/expanded 자동)
                        └─ AccordionContent (<Collapsible.Content role="region" aria-labelledby>)
```

## API Design

### useAccordion (`as` 제거)

```typescript
// packages/react-headless/accordion/src/useAccordion.ts
"use client";

import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { useCallback } from "react";

export interface UseAccordionSingleProps {
  type: "single";
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  collapsible?: boolean;
  disabled?: boolean;
}

export interface UseAccordionMultipleProps {
  type?: "multiple";
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  disabled?: boolean;
}

export type UseAccordionProps = UseAccordionSingleProps | UseAccordionMultipleProps;

function isSingleProps(props: UseAccordionProps): props is UseAccordionSingleProps {
  return props.type === "single";
}

export function useAccordion(props: UseAccordionProps) {
  const disabled = props.disabled ?? false;

  const [singleValue, setSingleValue] = useControllableState<string>({
    prop: isSingleProps(props) ? props.value : undefined,
    defaultProp: isSingleProps(props) ? (props.defaultValue ?? "") : "",
    onChange: isSingleProps(props) ? props.onValueChange : undefined,
  });

  const [multipleValue, setMultipleValue] = useControllableState<string[]>({
    prop: !isSingleProps(props) ? props.value : undefined,
    defaultProp: !isSingleProps(props) ? (props.defaultValue ?? []) : [],
    onChange: !isSingleProps(props) ? props.onValueChange : undefined,
  });

  const collapsible = isSingleProps(props) ? (props.collapsible ?? true) : true;

  const isOpen = useCallback(
    (itemValue: string) =>
      isSingleProps(props) ? singleValue === itemValue : multipleValue.includes(itemValue),
    [props, singleValue, multipleValue],
  );

  const toggle = useCallback(
    (itemValue: string) => {
      if (isSingleProps(props)) {
        if (singleValue === itemValue) {
          if (collapsible) setSingleValue("");
        } else {
          setSingleValue(itemValue);
        }
      } else {
        setMultipleValue((prev) =>
          prev.includes(itemValue) ? prev.filter((v) => v !== itemValue) : [...prev, itemValue],
        );
      }
    },
    [props, singleValue, collapsible, setSingleValue, setMultipleValue],
  );

  return { disabled, collapsible, isOpen, toggle };
}

export type UseAccordionReturn = ReturnType<typeof useAccordion>;
```

### Root Impl 분리 (`as` 완전 제거)

```typescript
// packages/react-headless/accordion/src/Accordion.tsx

interface AccordionRootBaseProps
  extends PrimitiveProps,
    Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue"> {}

export type AccordionSingleRootProps = AccordionRootBaseProps & UseAccordionSingleProps;
export type AccordionMultipleRootProps = AccordionRootBaseProps & UseAccordionMultipleProps;
export type AccordionRootProps = AccordionSingleRootProps | AccordionMultipleRootProps;

export const AccordionRoot = forwardRef<HTMLDivElement, AccordionRootProps>((props, ref) => {
  if (props.type === "single") {
    return <AccordionImplSingle {...props} ref={ref} />;
  }
  return <AccordionImplMultiple {...props} ref={ref} />;
});
AccordionRoot.displayName = "AccordionRoot";

// Internal Impl — each receives narrowed type
const AccordionImplSingle = forwardRef<HTMLDivElement, AccordionSingleRootProps>((props, ref) => {
  const { type, value, defaultValue, onValueChange, collapsible, disabled, onKeyDown, children, ...rest } = props;
  const api = useAccordion({ type, value, defaultValue, onValueChange, collapsible, disabled });
  return <AccordionImpl ref={ref} api={api} onKeyDown={onKeyDown} {...rest}>{children}</AccordionImpl>;
});

const AccordionImplMultiple = forwardRef<HTMLDivElement, AccordionMultipleRootProps>((props, ref) => {
  const { type, value, defaultValue, onValueChange, disabled, onKeyDown, children, ...rest } = props;
  const api = useAccordion({ type, value, defaultValue, onValueChange, disabled });
  return <AccordionImpl ref={ref} api={api} onKeyDown={onKeyDown} {...rest}>{children}</AccordionImpl>;
});

// Shared DOM + keyboard handler
interface AccordionImplProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {
  api: UseAccordionReturn;
}

const AccordionImpl = forwardRef<HTMLDivElement, AccordionImplProps>(
  ({ api, onKeyDown, ...props }, ref) => {
    const handleKeyDown = useCallback(/* ArrowUp/Down/Home/End, onKeyDown 후 preventDefault 아닐 때만 */, [onKeyDown]);
    return (
      <AccordionProvider value={api}>
        <Primitive.div
          ref={ref}
          data-disabled={dataAttr(api.disabled)}
          onKeyDown={handleKeyDown}
          {...props}
        />
      </AccordionProvider>
    );
  },
);
```

### Item/Header/Trigger/Content (Collapsible 위임)

```typescript
export interface AccordionItemProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {
  value: string;
  disabled?: boolean;
}

export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ value, disabled: itemDisabled, ...props }, ref) => {
    const api = useAccordionContext();
    const triggerId = useId();
    const disabled = itemDisabled ?? api.disabled;
    const open = api.isOpen(value);

    return (
      <AccordionItemProvider value={{ value, open, disabled, triggerId }}>
        <Collapsible.Root
          open={open}
          onOpenChange={(nextOpen) => {
            if (nextOpen !== open) api.toggle(value);
          }}
          disabled={disabled}
          ref={ref}
          {...props}
        />
      </AccordionItemProvider>
    );
  },
);
AccordionItem.displayName = "AccordionItem";

export interface AccordionHeaderProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLHeadingElement> {}

/**
 * `AccordionHeader` wraps the `AccordionTrigger` to provide a semantic heading
 * level for screen readers and document outline.
 *
 * Renders as `<h3>` by default, but consumers can override the heading level
 * via `asChild` or by rendering a different element if their document structure
 * requires `<h2>` or `<h4>`.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/accordion/#wai-ariaroles%2Cstates%2Candproperties
 *   — "The title of each accordion header is contained in an element with role `button`.
 *   Each accordion header `button` is wrapped in an element with role `heading`..."
 */
export const AccordionHeader = forwardRef<HTMLHeadingElement, AccordionHeaderProps>(
  (props, ref) => <Primitive.h3 ref={ref} {...props} />,
);
AccordionHeader.displayName = "AccordionHeader";

// ✅ ButtonHTMLAttributes (I6 해결)
export interface AccordionTriggerProps
  extends PrimitiveProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

/**
 * `AccordionTrigger` toggles the open/closed state of an `AccordionItem`.
 * It should always be nested inside of an `AccordionHeader` to preserve the
 * WAI-ARIA accordion pattern (heading > button).
 *
 * Renders as a native `<button>` with `aria-expanded`, `aria-controls`,
 * `aria-disabled` automatically managed via the underlying collapsible.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
 */
export const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  (props, ref) => {
    const { triggerId } = useAccordionItemContext();
    return (
      <Collapsible.Trigger
        ref={ref}
        id={triggerId}
        data-accordion-trigger=""
        {...props}
      />
    );
  },
);
AccordionTrigger.displayName = "AccordionTrigger";

export const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(
  (props, ref) => {
    const { triggerId } = useAccordionItemContext();
    return (
      <Collapsible.Content
        ref={ref}
        role="region"
        aria-labelledby={triggerId}
        {...props}
      />
    );
  },
);
AccordionContent.displayName = "AccordionContent";
```

### Styled Layer 축소

```typescript
// packages/react/src/components/Accordion/Accordion.tsx
"use client";

import { Accordion as AccordionPrimitive } from "@seed-design/react-accordion";
import { accordion } from "@seed-design/css/recipes/accordion";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";

const { withRootProvider, withContext } = createSlotRecipeContext(accordion);

export const AccordionRoot = withRootProvider(AccordionPrimitive.Root);
export const AccordionItem = withContext(AccordionPrimitive.Item, "item");
export const AccordionHeader = withContext(AccordionPrimitive.Header, "header");
export const AccordionTrigger = withContext(AccordionPrimitive.Trigger, "trigger");
export const AccordionContent = withContext(AccordionPrimitive.Content, "content");

// Styled-only slots (headless 없음)
export const AccordionBody = withContext(Primitive.div, "body");
export const AccordionTitle = withContext(withStateProps(Primitive.span), "title");
export const AccordionDescription = withContext(withStateProps(Primitive.span), "description");
export const AccordionPrefix = withContext(withStateProps(Primitive.div), "prefix");
export const AccordionSuffixIcon = withContext(Primitive.div, "suffixIcon");
export const AccordionContentInner = withContext(Primitive.div, "contentInner");
```

## Recipe Changes

### `packages/qvism-preset/src/recipes/accordion.ts`

`header` slot 추가:

```typescript
slots: [
  "root", "item", "header", "trigger", "content", "contentInner",
  "body", "title", "description", "prefix", "suffixIcon",
],
base: {
  // ...
  header: {
    // minimal reset — inherits from <h3>, needs to not impose heading visual style
    margin: 0,
    display: "flex",
  },
  // ...
}
```

### `packages/rootage/components/accordion.yaml`

`header` slot 스펙 추가 (properties 없음, 기본 reset만).

## Snippet Layer

`docs/registry/ui/accordion.tsx`에서 snippet이 `AccordionHeader`를 자동으로 감싸서 사용자 API 변경이 없도록 한다:

```typescript
export const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ prefix, children, ...props }, ref) => (
    <SeedAccordion.Header>
      <SeedAccordion.Trigger ref={ref} {...props}>
        {prefix && <SeedAccordion.Prefix>{prefix}</SeedAccordion.Prefix>}
        <SeedAccordion.Body>{children}</SeedAccordion.Body>
        <SeedAccordion.SuffixIcon>
          <IconChevronDownSmallLine />
        </SeedAccordion.SuffixIcon>
      </SeedAccordion.Trigger>
    </SeedAccordion.Header>
  ),
);
```

이렇게 하면 기존 예시 파일들(12개)은 수정 불필요.

## Test Strategy

### `useAccordion.test.tsx`

- `single mode`
  - uncontrolled: `defaultValue` 초기화
  - uncontrolled: `toggle(value)` 시 상태 변경
  - uncontrolled: `collapsible=true` 재클릭 시 닫힘
  - uncontrolled: `collapsible=false` 재클릭 시 그대로 유지
  - controlled: `value` prop + `onValueChange` 호출
- `multiple mode`
  - uncontrolled: `defaultValue` 배열 초기화
  - uncontrolled: 여러 아이템 독립 토글
  - uncontrolled: 재클릭 시 배열에서 제거
  - controlled: `value` prop + `onValueChange` 호출
- `disabled`
  - `disabled=true` 반환값 반영
  - `disabled` 기본값은 `false`

### `Accordion.test.tsx`

- 렌더: Root → Item → Header → Trigger/Content 구조 확인
- 키보드 네비: `ArrowDown`/`ArrowUp`/`Home`/`End` (wrap-around + disabled 건너뛰기)
- ARIA:
  - `aria-expanded` 자동 설정 (Collapsible 위임)
  - `aria-controls` ↔ content `id` 매칭
  - `aria-labelledby` ↔ trigger `id` 매칭
  - Content에 `role="region"`
- 클릭: Trigger 클릭 시 open 상태 변경
- Data attributes: `data-state`, `data-disabled`, `data-accordion-trigger`
- Collapsible 위임 검증: `--collapsible-content-height` CSS 변수 존재

### 테스트 환경

- `bun:test`
- `@testing-library/react` + `@testing-library/user-event`
- ResizeObserver mock (Collapsible.Content 때문)

## Work Items (순서)

1. **`packages/react-headless/accordion/` 스캐폴딩**
   - `package.json`, `tsconfig.json`
   - `src/index.ts`, `src/Accordion.namespace.ts`, `src/dom.ts`
2. **`useAccordion.ts` + `useAccordionContext.tsx` + `useAccordionItemContext.tsx`** 작성
3. **`Accordion.tsx` — Root (Impl 분리) + Item + Header + Trigger + Content** 작성
4. **테스트 추가** — `useAccordion.test.tsx`, `Accordion.test.tsx`
5. **Rootage + recipe** — `header` slot 추가 → `bun rootage:generate` → `bun qvism:generate`
6. **`packages/react/src/components/Accordion/Accordion.tsx` 축소** — headless wrapper로 재작성
7. **`packages/react/package.json`** — `@seed-design/react-accordion` dependency 추가
8. **Snippet 업데이트** — `docs/registry/ui/accordion.tsx`에 `AccordionHeader` 자동 감싸기
9. **빌드 검증** — `bun packages:build`, `bun test:all`, `bun docs:test`
10. **Changeset 업데이트** — 기존 `.changeset/velvety-tinkering-key.md`에 `@seed-design/react-accordion` minor 추가

## Acceptance Criteria

- [ ] `@seed-design/react-accordion` 신규 패키지 생성, `bun packages:build` 통과
- [ ] `useAccordion.ts`에 `as` 타입 단언 0개 (type guard predicate만 사용)
- [ ] `AccordionTriggerProps`가 `React.ButtonHTMLAttributes<HTMLButtonElement>` 상속
- [ ] `useAccordion.test.tsx` + `Accordion.test.tsx` 작성, 모든 테스트 통과
- [ ] 기존 예시 12개 파일 수정 없이 동작 (snippet이 Header 자동 감쌈)
- [ ] `AccordionHeader`에 WAI-ARIA APG JSDoc `@see` 추가
- [ ] `AccordionTrigger`에 "Should be nested inside AccordionHeader" JSDoc 추가
- [ ] Chromatic 스냅샷 회귀 없음 (DOM에 `<h3>` 추가되어 baseline 갱신 필요할 수 있음)
- [ ] Changeset에 `@seed-design/react-accordion` minor 항목 추가

## Verification

```bash
# 1. 빌드 검증
bun packages:build

# 2. 테스트 통과
bun test:all

# 3. docs 빌드
bun docs:test

# 4. 타입 검사 (빌드 중 tsc emitDeclaration으로 커버됨)
# useAccordion.ts에 `as` grep 0건 확인
grep -c " as " packages/react-headless/accordion/src/useAccordion.ts
# → 0이어야 함

# 5. Storybook 수동 확인
bun --filter @seed-design/docs storybook
# Accordion stories 정상 렌더링, disabled/open/variant/size 매트릭스 확인
```

## Known Issues (의도적 유지)

- **`disabled` + `aria-disabled` 이중 적용**: `<button disabled>`는 non-focusable이므로 WAI-ARIA 엄격 준수는 아니지만, SEED의 다른 컴포넌트(Tabs, FieldButton)와 동일한 패턴이라 유지.

## References

- Radix accordion: `/Users/june.jung/Documents/GitHub/radix-primitives/packages/react/accordion/`
- Base UI accordion: `/Users/june.jung/Documents/GitHub/base-ui/packages/react/src/accordion/`
- SEED radio-group → fieldset 선례: `packages/react-headless/radio-group/package.json:33`, `src/useRadioGroup.ts:11,81`
- SEED collapsible: `packages/react-headless/collapsible/`
- WAI-ARIA APG Accordion Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/accordion/

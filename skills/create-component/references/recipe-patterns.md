# Recipe 작성 패턴

`packages/qvism-preset/AGENTS.md`에 기본 컨벤션이 있다. 이 문서는 전체 68개 recipe에서 추출한 공통 패턴을 보충한다.

## Token 경로 컨벤션

rootage에서 생성된 vars 변수는 일관된 경로 구조를 따른다:

```
vars.<variantType>.<state>.<element>.<property>
```

- **variantType**: `base`, `variantBrandSolid`, `variantNeutralWeak`, `toneNeutral`, `sizeLarge`, `sizeMedium` 등
- **state**: `enabled`, `disabled`, `pressed`, `selected`, `loading`
- **element**: `root`, `label`, `icon`, `prefixIcon`, `suffixIcon`, `content`, `track`, `range` 등
- **property**: `color`, `fontSize`, `lineHeight`, `fontWeight`, `cornerRadius`, `minHeight`, `gap`, `duration`, `timingFunction` 등

예시: `vars.variantBrandSolid.enabled.root.color`, `vars.base.disabled.label.color`

## Vocabulary 선택

outline, frame, divider처럼 **시각적 선**을 표현하는 token은 기본적으로 `strokeColor`/`strokeWidth` vocabulary를 먼저 검토한다.

- **`stroke*` 우선**: 1px frame, outline, separator처럼 "선을 그린다"는 의미가 핵심일 때
- **`border*` 사용**: 실제 CSS border semantics를 public contract로 드러내야 하거나, 기존 컴포넌트 vocabulary와 반드시 맞춰야 할 때

새 컴포넌트에서 둘 다 가능하다면 `stroke*` 쪽이 rootage vocabulary를 더 일관되게 유지한다.

## Pseudo 선택자

`pseudo()` 헬퍼를 사용하여 상태별 스타일을 정의한다. native HTML 속성과 data 속성을 동시에 지원한다.

**주요 선택자**:

| 선택자 | 의미 | 내부 구현 |
|--------|------|----------|
| `engaged` | hover + pressed 통합 | CSS `@custom-selector :--engaged` (모바일 우선) |
| `disabled` | 비활성 | `:is(:disabled, [disabled], [data-disabled])` |
| `checked` | 체크됨 | `:is(:checked, [data-checked])` |
| `selected` | 선택됨 | `:is([aria-selected=true], [data-selected])` |
| `pressed` | 눌림 | `:is([aria-pressed=true], [data-pressed])` |
| `focusVisible` | 키보드 포커스 | `:is(:focus-visible, [data-focus-visible])` |
| `open` | 열림 | `:is([data-state="open"], [data-open])` |
| `loading` | 로딩 중 | `[data-loading]` |
| `invalid` | 유효하지 않음 | `:is(:invalid, [data-invalid])` |

**사용법**:
```typescript
[pseudo(disabled)]: { cursor: "not-allowed", opacity: ... }
[pseudo(focusVisible)]: createFocusRingStyles()
[pseudo(disabled, "::placeholder")]: { color: vars.base.disabled.placeholder.color }
```

**핵심**: hover 대신 `engaged`를 사용한다 (모바일 우선 디자인). `disabled`는 반드시 `data-disabled`도 포함해야 headless 컴포넌트의 data 속성과 연동된다.

## Focus Ring

모든 인터랙티브 컴포넌트에 focus ring을 적용한다:

```typescript
base: {
  ...createFocusRingRestStyles(),  // 기본 상태: 투명 outline
  [pseudo(focusVisible)]: createFocusRingStyles(),  // 포커스 시: visible outline
}
```

transition에 `FOCUS_RING_TRANSITION`을 포함해야 부드러운 전환이 된다:
```typescript
transition: `background-color ${duration} ${timingFunction}, ${FOCUS_RING_TRANSITION}`
```

## 아이콘 헬퍼

아이콘 slot이 있는 컴포넌트에서 CSS custom property 기반으로 크기/색상을 관리한다:

```typescript
import { prefixIcon, suffixIcon, onlyIcon } from "../utils/icon";

// 사용
...prefixIcon({
  size: vars.sizeMedium.enabled.prefixIcon.size,
  color: vars.variantBrandSolid.enabled.prefixIcon.color,
})
```

- `prefixIcon()` → `--seed-prefix-icon-size`, `--seed-prefix-icon-color` 등
- `suffixIcon()` → `--seed-suffix-icon-size`, `--seed-suffix-icon-color` 등
- `onlyIcon()` → `--seed-icon-size`, `--seed-icon-color`

slot 이름과 token은 **public contract**를 따라간다.

- public API가 generic `prefix`라면 recipe가 크기를 강제하지 않는다
- public API가 icon-only `prefixIcon`으로 확정된 경우에만 `prefixIcon` slot과 `size` token을 도입한다
- icon과 avatar를 모두 받을 수 있는 slot이라면 색상 정도만 제어하고 크기 강제는 피한다

즉, `prefixIcon` slot은 "앞에 아이콘이 올 수 있다"가 아니라 "앞 슬롯은 아이콘 전용이다"가 확정됐을 때만 만든다.

## 애니메이션 패턴

### 색상 전환 (가장 흔함)

```typescript
transition: `background-color ${vars.base.enabled.root.colorDuration} ${vars.base.enabled.root.colorTimingFunction}, ${FOCUS_RING_TRANSITION}`
```

### Expand/Collapse (Accordion, Collapsible)

**핵심 규칙**: height 애니메이션과 padding은 반드시 다른 요소에 있어야 한다.

- `content` slot: `height` transition + `overflow: hidden` + `--collapsible-content-height` CSS 변수
- `contentInner` slot: padding + opacity transition

padding을 `content`에 넣으면 collapse 시 padding이 먼저 사라져 choppy한 애니메이션이 된다. 반드시 `contentInner` 래퍼를 사용한다.

`contentInner`는 animation quality를 위한 구현 패턴이다. 이 패턴이 필요하다는 사실과, 해당 helper slot을 public API로 export해야 한다는 사실은 별개로 판단한다.

### Modal/Sheet 진입/퇴장

```typescript
import { enterAnimation, exitAnimation } from "../utils/animation";

[pseudo(open)]: enterAnimation({
  timingFunction: vars.base.enabled.backdrop.enterTimingFunction,
  duration: vars.base.enabled.backdrop.enterDuration,
  opacity: vars.base.enabled.backdrop.enterOpacity,
})

[pseudo(not(open))]: exitAnimation({ ... })
```

복잡한 경우 `createPresence(enterConfig, exitConfig)` 유틸리티를 사용한다 (bottom-sheet 참조).

### 성능

- `willChange: "transform"` — 애니메이션 대상 요소에
- `isolation: "isolate"` — stacking context 분리
- `transform: "translate3d(0, 0, 0)"` — GPU 레이어 강제

## Compound Variants

variant × tone, variant × size 조합이 특수한 스타일을 가질 때 사용한다:

```typescript
compoundVariants: [
  {
    tone: "neutral",
    variant: "weak",
    css: { root: { backgroundColor: vars.toneNeutralVariantWeak.enabled.root.color } }
  }
]
```

사용 예: badge(18개 조합), text-input(6개 조합), chip, page-banner

## Arbitrary Content Slot

slot이 badge, custom inline element, rich text 등 **임의 content**를 받을 수 있다면 구조를 과하게 고정하지 않는다.

- 근거 없이 `display: flex`, `flexDirection: column`, `gap`을 기본값으로 두지 않는다
- typography, color처럼 의미가 분명한 스타일만 먼저 준다
- block형 구조가 실제 contract로 정해진 경우에만 layout 스타일을 추가한다

content contract가 느슨할수록 recipe는 구조보다 표현에 집중한다.

## defineRecipe vs defineSlotRecipe 전환 주의

recipe 타입을 변경하면 `bun generate:all` 실행 후 CSS 출력이 완전히 달라진다. 전환 시:
1. rootage YAML의 slot 정의 확인
2. recipe 파일 변경
3. `recipes/index.ts` export 확인
4. `bun generate:all` 실행
5. React 컴포넌트의 import/사용 패턴 변경

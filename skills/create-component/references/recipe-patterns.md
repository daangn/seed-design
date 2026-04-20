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

## defineRecipe vs defineSlotRecipe 전환 주의

recipe 타입을 변경하면 `bun generate:all` 실행 후 CSS 출력이 완전히 달라진다. 전환 시:
1. rootage YAML의 slot 정의 확인
2. recipe 파일 변경
3. `recipes/index.ts` export 확인
4. `bun generate:all` 실행
5. React 컴포넌트의 import/사용 패턴 변경

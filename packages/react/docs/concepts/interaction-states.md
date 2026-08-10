file: components/concepts/interaction-states.mdx

# Interaction States

SEED React 컴포넌트가 디바이스 환경에 따라 상호작용 스타일을 적용하는 방식을 설명합니다.

SEED React 컴포넌트는 모바일 터치 환경과 데스크톱 마우스 환경 모두에서 적절한 상호작용 피드백을 제공합니다. 별도의 설정이 불필요하며 SEED React 컴포넌트에 포함되어 있습니다.

## 디바이스 적응형 스타일 \[#디바이스-적응형-스타일]

SEED에서 컴포넌트 스펙 및 색상 토큰은 pressed 상태만 정의합니다. SEED React는 이 pressed 스타일을 디바이스 환경에 따라 다른 시점에 표시합니다.

| 디바이스 환경 | 트리거          | 표시되는 스타일    |
| ------- | ------------ | ----------- |
| 마우스     | 요소에 커서를 올릴 때 | pressed 스타일 |
| 터치      | 요소를 누르고 있을 때 | pressed 스타일 |

마우스 환경에서의 hover 스타일과 터치 환경에서의 active 스타일은 일반적으로 동일합니다.

| Token | theme-light | theme-dark |
| --- | --- | --- |
| $color.bg.brand-solid-pressed | $color.palette.carrot-700 | $color.palette.carrot-800 |
| $color.bg.brand-weak-pressed | $color.palette.carrot-200 | $color.palette.carrot-200 |
| $color.bg.critical-solid-pressed | $color.palette.red-800 | $color.palette.red-700 |
| $color.bg.critical-weak-pressed | $color.palette.red-200 | $color.palette.red-200 |
| $color.bg.informative-solid-pressed | $color.palette.blue-800 | $color.palette.blue-700 |
| $color.bg.informative-weak-pressed | $color.palette.blue-200 | $color.palette.blue-200 |
| $color.bg.layer-default-pressed | $color.palette.gray-100 | $color.palette.gray-300 |
| $color.bg.layer-floating-pressed | $color.palette.gray-100 | $color.palette.gray-300 |
| $color.bg.neutral-inverted-pressed | $color.palette.gray-800 | $color.palette.gray-800 |
| $color.bg.neutral-weak-alpha-pressed | $color.palette.static-black-alpha-300 | $color.palette.static-white-alpha-300 |
| $color.bg.neutral-weak-pressed | $color.palette.gray-300 | $color.palette.gray-400 |
| $color.bg.positive-solid-pressed | $color.palette.green-800 | $color.palette.green-600 |
| $color.bg.positive-weak-pressed | $color.palette.green-200 | $color.palette.green-200 |
| $color.bg.transparent-pressed | $color.palette.static-black-alpha-100 | $color.palette.static-white-alpha-50 |
| $color.bg.transparent-selected-pressed | $color.palette.static-black-alpha-300 | $color.palette.static-white-alpha-200 |
| $color.bg.warning-solid-pressed | $color.palette.yellow-400 | $color.palette.yellow-900 |
| $color.bg.warning-weak-pressed | $color.palette.yellow-200 | $color.palette.yellow-200 |

### CSS \[#css]

SEED CSS는 `@media (hover)` 와 `@media (pointer)` 미디어 쿼리를 조합하여 디바이스를 구분합니다.

```css
/* 마우스 환경: hover 시 pressed 색상 적용 */
@media (hover: hover) and (pointer: fine) {
  .seed-action-button--variant_brandSolid:is(:hover, [data-hover]) {
    background: var(--seed-color-bg-brand-solid-pressed);
  }
}

/* 터치 환경: active 시 pressed 색상 적용 */
@media not all and (hover: hover) and (pointer: fine) {
  .seed-action-button--variant_brandSolid:is(:active, [data-active]) {
    background: var(--seed-color-bg-brand-solid-pressed);
  }
}
```

## 키보드 포커스 스타일 \[#키보드-포커스-스타일]

웹 페이지를 키보드로 탐색하는 경우, 사용자가 현재 포커스된 요소를 시각적으로 인식할 수 있도록 focus ring이 표시됩니다. SEED React 컴포넌트에는 키보드 해당 스타일이 기본적으로 포함되어 있습니다.

키보드 포커스 스타일은 디바이스 환경과 관계없이 키보드 탐색 시에 항상 표시됩니다.

## Preview

```tsx
import { ActionButton } from "seed-design/ui/action-button";

export default function ActionButtonPreview() {
  return <ActionButton>라벨</ActionButton>;
}
```
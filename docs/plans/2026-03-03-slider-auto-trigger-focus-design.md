# Slider: auto trigger + focus-visible indicator

## Linear Issues

- **DES-1266**: `valueIndicatorTrigger` 'auto' 추가 및 기본값을 'auto'로 변경
- **DES-1268**: Slider thumb에 focus 시 value indicator 표시

## Problem

1. Slider value indicator의 기본 트리거가 `"active"`(드래그 중에만 표시)인데, 마우스 환경에서는 hover로 표시되는 것이 더 자연스러움
2. 키보드로 slider를 조작할 때 value indicator가 전혀 보이지 않아 접근성 부족

## Design Decisions

| 항목 | 결정 | 근거 |
|------|------|------|
| Device detection | JS `matchMedia('(hover: hover)')` | headless 레이어에서 직접 resolve하여 `data-value-indicator-shown` 의미 정확성 유지 |
| Focus indicator scope | 모든 trigger 모드에서 적용 | 키보드 접근성은 trigger 모드와 무관하게 보장되어야 함 |
| Focus type | `focus-visible`만 | 마우스 클릭 focus에서는 불필요, 키보드 내비게이션에서만 표시 |
| Default value | `"active"` → `"auto"` | DES-1266 요구사항 |

## Changes (headless only)

### 1. Type change

```typescript
// Before
valueIndicatorTrigger?: "active" | "hover";  // @default "active"

// After
valueIndicatorTrigger?: "active" | "hover" | "auto";  // @default "auto"
```

### 2. Auto resolve logic

```typescript
const resolvedTrigger = useMemo(() => {
  if (valueIndicatorTrigger !== "auto") return valueIndicatorTrigger;
  if (typeof window === "undefined") return "active";
  return window.matchMedia("(hover: hover)").matches ? "hover" : "active";
}, [valueIndicatorTrigger]);
```

SSR fallback: `"active"` (safer default — indicator hidden until interaction).

### 3. Focus-visible state tracking

New state in useSliderInternal:
- `focusVisibleThumbIndex: number | null`

Thumb props additions:
- `onFocus`: check `e.target.matches(':focus-visible')` → set index
- `onBlur`: clear focus-visible index

### 4. isShown logic update

```typescript
const isShown = (() => {
  if (api.focusVisibleThumbIndex === index) return true;

  switch (resolvedTrigger) {
    case "hover":
      return api.openThumbIndex === index ||
        (api.isDragging && api.valueIndexToChangeRef.current === index);
    case "active":
      return api.isDragging && api.valueIndexToChangeRef.current === index;
  }
})();
```

## Files to modify

- `packages/react-headless/slider/src/useSlider.ts` — core logic
- `packages/react-headless/slider/src/useSlider.test.tsx` — new tests

## Out of scope

- CSS/recipe changes (none needed)
- Styled component changes (none needed)
- Documentation updates

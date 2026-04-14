# Phase 2: 단순 인터랙티브 컴포넌트

bindtap 이벤트를 처리하는 버튼/칩 계열. Phase 0의 `usePressTap` 훅에 의존.

---

## 1. ToggleButton

**React 소스**: `packages/react/src/components/ToggleButton/ToggleButton.tsx`
**React headless**: `packages/react-headless/toggle/`
**Lynx CSS recipe**: `toggleButton` (단일 className)

**Variant Props:**
- `variant`: "brandSolid" | "neutralWeak", default: "brandSolid"
- `size`: "xsmall" | "small", default: "small"

**웹 동작:**
- TogglePrimitive.Root 기반 (on/off 토글)
- usePendingButton으로 loading 상태 관리
- pressed(toggled) 상태에 따라 스타일 변경

**Lynx 구현 포인트:**
- `useControllableState`로 pressed(toggled) 상태 관리
- `usePressTap`으로 tap 이벤트 처리
- pressed 상태 → className variant로 표현 (`pressed_true`)
- loading 상태는 SVG 의존이므로 Lynx에서는 미지원 (Omit)
- `bindtap`으로 toggle 전환

**Props:**
```typescript
interface ToggleButtonProps extends Omit<ToggleButtonVariantProps, "loading"> {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
  bindtap?: () => void;
  "main-thread:bindtap"?: () => void;
}
```

- [ ] `src/components/ToggleButton/ToggleButton.tsx`
- [ ] `docs/content/lynx/components/toggle-button.mdx`
- [ ] `examples/lynx-spa/src/pages/ToggleButtonPage.tsx`

---

## 2. ReactionButton

**React 소스**: `packages/react/src/components/ReactionButton/ReactionButton.tsx`
**Lynx CSS recipe**: `reactionButton` (단일 className)

**Variant Props:**
- `size`: "xsmall" | "small", default: "small"

**Lynx 구현 포인트:**
- ToggleButton과 거의 동일한 패턴
- pressed/unpressed 토글
- loading 미지원

- [ ] `src/components/ReactionButton/ReactionButton.tsx`
- [ ] `docs/content/lynx/components/reaction-button.mdx`
- [ ] `examples/lynx-spa/src/pages/ReactionButtonPage.tsx`

---

## 3. ControlChip

**React 소스**: `packages/react/src/components/ControlChip/ControlChip.tsx` (deprecated)
**Lynx CSS recipe**: `controlChip` (단일 className)

**Variant Props:**
- `size`: "medium" | "small", default: "medium"
- `layout`: "withText" (iconOnly는 SVG 필요이므로 Lynx 미지원)

**Lynx 구현 포인트:**
- 웹에서 deprecated (→ Chip.Toggle, Chip.Button) 이지만 Lynx CSS recipe가 존재
- layout을 "withText"로 고정
- 단순 버튼 래퍼 + bindtap

**주의:** deprecated 여부 확인 후 구현 필요성 재판단

- [ ] `src/components/ControlChip/ControlChip.tsx`
- [ ] `docs/content/lynx/components/control-chip.mdx`
- [ ] `examples/lynx-spa/src/pages/ControlChipPage.tsx`

---

## 4. Fab

**React 소스**: `packages/react/src/components/Fab/Fab.tsx` (deprecated → ContextualFloatingButton)
**Lynx CSS recipe**: `fab` (단일 className)

**Variant Props:** 없음

**주의:** deprecated. ContextualFloatingButton을 우선 구현하고 Fab는 후순위.

- [ ] `src/components/Fab/Fab.tsx`
- [ ] `docs/content/lynx/components/fab.mdx`
- [ ] `examples/lynx-spa/src/pages/FabPage.tsx`

---

## 5. ExtendedFab

**React 소스**: `packages/react/src/components/ExtendedFab/ExtendedFab.tsx` (deprecated → ContextualFloatingButton)
**Lynx CSS recipe**: `extendedFab` (단일 className)

**Variant Props:**
- `variant`: "neutralSolid" | "layerFloating", default: "neutralSolid"
- `size`: "small" | "medium", default: "medium"

**주의:** deprecated. ContextualFloatingButton을 우선 구현.

- [ ] `src/components/ExtendedFab/ExtendedFab.tsx`
- [ ] `docs/content/lynx/components/extended-fab.mdx`
- [ ] `examples/lynx-spa/src/pages/ExtendedFabPage.tsx`

---

## 6. ContextualFloatingButton

**React 소스**: `packages/react/src/components/ContextualFloatingButton/ContextualFloatingButton.tsx`
**Lynx CSS recipe**: `contextualFloatingButton` (단일 className)

**Variant Props:**
- `variant`: "solid" | "layer", default: "solid"
- `layout`: "withText" (iconOnly는 Lynx 미지원)

**Lynx 구현 포인트:**
- loading 상태 미지원 (SVG spinner)
- layout "iconOnly" 미지원 (SVG)
- 웹에서 IconRequired 검증 → Lynx에서 불필요 (iconOnly 미지원이므로)
- 단순 버튼 + bindtap

**Props:**
```typescript
interface ContextualFloatingButtonProps extends Omit<ContextualFloatingButtonVariantProps, "layout" | "loading"> {
  children?: React.ReactNode;
  className?: string;
  bindtap?: () => void;
  "main-thread:bindtap"?: () => void;
  disabled?: boolean;
}
```

- [ ] `src/components/ContextualFloatingButton/ContextualFloatingButton.tsx`
- [ ] `docs/content/lynx/components/contextual-floating-button.mdx`
- [ ] `examples/lynx-spa/src/pages/ContextualFloatingButtonPage.tsx`

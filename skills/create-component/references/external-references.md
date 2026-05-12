# 외부 레퍼런스 + 접근성 가이드

## Part 1: 외부 라이브러리 레퍼런스

SEED Design은 외부 라이브러리에 직접 의존하지 않지만, 인터페이스 설계 시 레퍼런스로 참고한다. headless 훅이나 새 컴포넌트 인터페이스를 설계할 때(카테고리 C/D) 아래 라이브러리에서 동일 컴포넌트를 찾아 비교한다.

| 라이브러리 | 참고 영역 | 언제 보는가 |
|-----------|----------|-----------|
| Base UI React | 최신 headless 패턴, hook API, 접근성 | headless 훅 설계 시 |
| Base UI Utils | 유틸리티 함수 패턴 | 유틸리티 패키지 설계 시 |
| Radix Primitives | Compound component, 포커스 관리 | compound 구조 설계 시 |
| Chakra UI | 인터페이스 다양성, 예시, 종류 | prop 인터페이스 설계 시 |
| shadcn/ui | snippet/registry 패턴 | snippet 설계 시 |

**GitHub 경로**:
- Base UI React: https://github.com/mui/base-ui/tree/master/packages/react
- Base UI Utils: https://github.com/mui/base-ui/tree/master/packages/utils
- Radix Primitives: https://github.com/radix-ui/primitives
- Chakra UI: https://github.com/chakra-ui/chakra-ui
- shadcn/ui: https://github.com/shadcn-ui/ui

### 조사 방법

1. **Base UI**: hook API 구조, controlled/uncontrolled 패턴, 이벤트 핸들링, 접근성 구현
2. **Radix**: compound component slot 분리 기준, context 전달 패턴, 포커스 관리
3. **Chakra**: 어떤 prop이 표준인지, 네이밍 컨벤션, variant 체계
4. **shadcn**: 최종 사용자 API 형태, 파일 구조, registry 패턴

**주의**: 외부 패턴을 그대로 복사하지 않는다. SEED Design의 기존 패턴(Primitive, createSlotRecipeContext, data-* 속성)과 조화시킨다.

### 라이브러리 우선순위 룰

같은 컴포넌트라도 라이브러리마다 다른 결정을 내린다. 어느 라이브러리를 어떤 결정의 기준점으로 삼을지가 명확하지 않으면 결정이 흔들린다. **결정 영역별 1순위 라이브러리**를 다음 표를 기준으로 한다:

| 결정 영역 | 1순위 | 이유 |
|---------|------|------|
| Headless 훅 API 형태 (`use*` 반환값, slot별 props) | Base UI | 가장 최신의 hook-first 설계, 접근성 구현 깊이 |
| controlled/uncontrolled 패턴 | Base UI | `useControllableState`와 유사한 패턴을 가장 일관되게 적용 |
| Compound 구조 (Root/Trigger/Content 분리) | Radix | compound primitives 설계 표준 |
| 포커스 트랩, dismissable layer | Radix | 이미 SEED가 일부 의존 (`@radix-ui/react-dismissable-layer` 등) |
| Prop naming / variant 체계 (size, intent, kind 등) | Chakra | 컴포넌트 카탈로그가 넓고 prop 일관성 강함 |
| Snippet/registry 사용자 API | shadcn | snippet 시스템 자체가 shadcn에서 영감 |

1순위가 SEED 패턴과 충돌하면 SEED를 우선한다. 예: Radix가 `<Component.Root>` 같은 dotted namespace를 권장해도 SEED의 `ComponentRoot` 명명을 따른다 (`api-design.md` §convenience wrapper 참조).

### 차용 vs 거부 결정 트리

외부 라이브러리에서 어떤 패턴을 발견했을 때 차용할지 거부할지의 판단 기준:

```text
외부 패턴 발견
    │
    ├─ SEED 기존 패턴과 충돌? ──Yes──> 거부. SEED 패턴 유지.
    │                                  (예: 외부의 dotted namespace, 외부의 controlled-only API)
    │
    └─ No → SEED가 같은 문제를 다른 방식으로 푸는가?
              ├─ Yes → 거부. 같은 문제에 두 가지 패턴 공존 금지.
              │        (예: state 동기화에 SEED는 useControllableState 사용 → 외부의 다른 동기화 패턴 거부)
              │
              └─ No → 차용 가능. 단, 한 가지 조건:
                       SEED 기존 컴포넌트와 prop naming/variant naming이 일관되는지 확인.
                       (예: 외부가 `colorScheme`이라도 SEED가 `variant`를 쓰면 `variant`로 정렬)
```

### 카테고리별 외부 레퍼런스 조사 수준

| 카테고리 | 외부 조사 깊이 |
|---------|------------|
| A. Simple | prop naming + variant 체계만 최소 비교 (Chakra 위주) |
| B. Compound (Stateless) | 위 + compound 구조 (Radix) |
| C. Compound (Stateful) | 위 + Headless 훅 API + 접근성 (Base UI 필수) |
| D. Multi-Recipe | 위 전체 |
| E. Layout | prop naming 최소 비교만 (Chakra의 Flex/Stack 등) |

카테고리 C/D는 외부 조사 없이 진행 금지. 다른 카테고리도 최소 prop naming 일관성은 확인한다.

## Part 2: SEED Design의 외부 의존성

SEED Design이 실제로 의존하는 외부 패키지. 새 의존성을 추가하기 전에 이 목록을 확인하고, 기존 패키지로 해결 가능한지 먼저 검토한다.

| 패키지 | 용도 | 사용 위치 |
|--------|------|----------|
| `@radix-ui/react-compose-refs` | ref 합성 | react, stackflow |
| `@radix-ui/react-slot` | polymorphic 렌더링 (asChild) | react, stackflow |
| `@radix-ui/react-use-controllable-state` | controlled/uncontrolled 상태 | 15+ headless 컴포넌트 |
| `@radix-ui/react-use-layout-effect` | SSR 안전한 layout effect | react |
| `@radix-ui/react-use-callback-ref` | 안정적인 callback ref 헬퍼 | hooks, controlled 컴포넌트 |
| `@radix-ui/react-use-size` | 요소 크기 관찰 | slider, tabs |
| `@radix-ui/react-collapsible` | collapsible/accordion 동작 | collapsible, accordion |
| `@radix-ui/react-dismissable-layer` | 외부 클릭 닫기 | dialog, drawer, popover |
| `@radix-ui/react-focus-scope` | 포커스 트랩 관리 | dialog, drawer, modal |
| `@floating-ui/react` | 포지셔닝 수학 | popover |

새 외부 의존성 추가는 반드시 유저에게 확인한다 (AGENTS.md §Boundaries "Ask first").

## Part 3: 접근성 설계 가이드

SEED Design은 ARIA Authoring Practices Guide 패턴을 따르되 독자 구현한다.

### Headless 컴포넌트 접근성 체크리스트

새 headless 컴포넌트를 설계할 때 아래를 순서대로 확인한다.

#### 1. ARIA APG 패턴 조회

https://www.w3.org/WAI/ARIA/apg/patterns/ 에서 해당 컴포넌트 패턴을 찾는다.

정리할 항목:
- 필수 `role` (예: `role="tablist"`, `role="tab"`, `role="tabpanel"`)
- 필수 `aria-*` 속성 (예: `aria-selected`, `aria-controls`, `aria-labelledby`)
- 필수 키보드 인터랙션

#### 2. SEED Design 접근성 유틸리티

`@seed-design/dom-utils`에서 제공하는 유틸리티:

| 유틸리티 | 용도 | 예시 |
|---------|------|------|
| `ariaAttr(value)` | boolean → ARIA 문자열 (`"true"` / `undefined`) | `aria-checked: ariaAttr(isChecked)` |
| `dataAttr(value)` | boolean → data attribute 값 | `data-disabled: dataAttr(isDisabled)` |
| `visuallyHidden` | 화면에서 숨기고 스크린리더에서 접근 가능 | hidden native input |
| `elementProps()` | 타입 안전한 요소 props 빌더 | headless 훅 반환값 |
| `inputProps()` | 타입 안전한 input props 빌더 | form control |

#### 3. 숨겨진 Native Input 패턴

checkbox, radio, switch 등 native form control이 있는 컴포넌트에서:

```typescript
// hidden native input (실제 접근성 담당)
hiddenInputProps: inputProps({
  type: "checkbox",
  role: "checkbox",
  checked: isControlled ? isChecked : undefined,
  "aria-invalid": ariaAttr(props.invalid),
  style: visuallyHidden,
  // event handlers...
})

// visual control (시각적 표시만)
controlProps: elementProps({
  "aria-hidden": true,  // 스크린리더에서 무시
  // visual styling...
})
```

참조: `packages/react-headless/checkbox/src/useCheckbox.ts`

#### 4. 키보드 인터랙션 구현

| 컴포넌트 타입 | 키 | 동작 |
|-------------|---|------|
| 버튼/토글 | Space, Enter | 활성화 |
| 체크박스/스위치 | Space | 토글 |
| 탭/라디오 | Arrow Left/Right | 이전/다음 (RTL 지원) |
| 슬라이더 | Arrow, Home/End, PageUp/Down | 값 조정 |
| 다이얼로그/팝오버 | Escape | 닫기 |
| 목록 탐색 | Home, End | 처음/마지막으로 이동 |

구현 패턴:
```typescript
onKeyDown: (e) => {
  if (e.key === " ") { e.preventDefault(); setIsActive(true); }
}
onKeyUp: (e) => {
  if (e.key === " ") { setIsActive(false); onChange(); }
}
```

참조: `packages/react-headless/slider/src/useSlider.ts` (가장 복잡한 키보드 구현)

#### 5. Focus 관리

- 인터랙티브 요소: `createFocusRingRestStyles()` + `createFocusRingStyles()` (recipe에서)
- 다이얼로그/팝오버: `@radix-ui/react-dialog`의 FocusScope 활용
- `data-focus-visible` 속성으로 키보드 포커스만 구분
- Roving tabindex: 탭, 라디오 그룹에서 Arrow로 포커스 이동

#### 6. 동적 콘텐츠 알림

- Snackbar/Toast: `aria-live="polite"` + `aria-atomic="true"`
- 에러 메시지: `aria-describedby`로 입력 필드와 연결
- 로딩 상태: `data-loading` (스타일링) + 선택적 `aria-busy="true"`

### WCAG 2.2 핵심 Success Criteria

컴포넌트 구현 시 가장 자주 관련되는 기준:

| Criteria | 설명 | SEED Design 대응 |
|----------|------|-----------------|
| 1.3.1 Info and Relationships | 구조가 프로그래밍적으로 결정 가능 | semantic HTML + ARIA roles |
| 1.4.3 Contrast (Minimum) | 텍스트 4.5:1, 큰 텍스트 3:1 | rootage 토큰에서 관리 |
| 2.1.1 Keyboard | 모든 기능이 키보드 접근 가능 | headless 키보드 핸들러 |
| 2.4.7 Focus Visible | 포커스 인디케이터 표시 | createFocusRingStyles() |
| 2.5.5 Target Size (Enhanced) | 최소 24×24px, 권장 44×44px | rootage minHeight |
| 4.1.2 Name, Role, Value | UI 컴포넌트에 이름/역할/값 | ARIA attributes |

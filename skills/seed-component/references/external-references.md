# 외부 레퍼런스 + 접근성 가이드

headless 훅이나 새 컴포넌트 인터페이스를 설계할 때(카테고리 C·D) 외부 라이브러리의 같은 컴포넌트와 비교하고 접근성 계약을 정한다. SEED는 아래 라이브러리를 인터페이스 참고로만 쓴다. 실제 의존성은 「Part 2」로 확인한다.

## Part 1: 외부 라이브러리 레퍼런스

### 카테고리별 조사 깊이

- A. Simple → prop naming과 variant 체계만 최소 비교(Chakra 위주)
- B. Compound (Stateless) → 위 + compound 구조(Radix)
- C. Compound (Stateful) → 위 + Headless 훅 API와 접근성(Base UI 필수)
- D. Multi-Recipe → 위 전체
- E. Layout → prop naming만 최소 비교(Chakra의 Flex·Stack 등)

새 C·D headless를 설계할 때는 외부 조사를 건너뛰지 않는다 → Base UI 비교 결과를 [architecture-decisions.md](architecture-decisions.md) §4a에 기록한 뒤 진행한다. 기존 구조를 유지하는 변경에는 요구하지 않는다. 다른 카테고리도 최소한 prop naming 일관성은 확인한다.

### 라이브러리와 볼 것

- [Base UI React](https://github.com/mui/base-ui/tree/master/packages/react) → headless 훅 설계 시. hook API 구조, controlled·uncontrolled 패턴, 이벤트 처리, 접근성 구현
- [Base UI Utils](https://github.com/mui/base-ui/tree/master/packages/utils) → 유틸리티 패키지 설계 시. 유틸리티 함수 패턴
- [Radix Primitives](https://github.com/radix-ui/primitives) → compound 구조 설계 시. slot 분리 기준, context 전달, 포커스 관리
- [Chakra UI](https://github.com/chakra-ui/chakra-ui) → prop 인터페이스 설계 시. 표준 prop, 네이밍 컨벤션, variant 체계
- [shadcn/ui](https://github.com/shadcn-ui/ui) → snippet 설계 시. 최종 사용자 API 형태, 파일 구조, registry 패턴

외부 패턴을 그대로 복사하지 않는다 → SEED의 기존 패턴(`Primitive`, `createSlotRecipeContext`, `data-*` 속성)과 맞춘다.

### 라이브러리 우선순위 룰

라이브러리마다 같은 컴포넌트에 다른 결정을 내린다. 결정 영역별 기준점을 다음처럼 둔다.

- Headless 훅 API 형태(`use*` 반환값, slot별 props) → Base UI. 가장 최신의 hook-first 설계이고 접근성 구현이 깊다.
- controlled·uncontrolled 패턴 → Base UI. `useControllableState`와 비슷한 패턴을 가장 일관되게 적용한다.
- Compound 구조(Root·Trigger·Content 분리) → Radix. compound primitive 설계의 표준이다.
- 포커스 트랩, dismissable layer → Radix. SEED는 `@radix-ui/react-focus-scope`에 의존하고, 외부 클릭 닫기는 자체 `packages/react-headless/dismissible-layer`로 구현한다.
- Prop naming·variant 체계(size, intent, kind 등) → Chakra. 컴포넌트 카탈로그가 넓고 prop 일관성이 강하다.
- Snippet·registry 사용자 API → shadcn. SEED snippet 시스템의 출발점이다.

1순위가 SEED 패턴과 충돌하면 SEED를 우선한다. 예: 외부 관례가 snippet에서 dotted namespace(`<Component.Root>`)를 권장해도 SEED snippet의 최상위 export는 [api-design.md](api-design.md)「[Snippet] Export naming」의 `Component`·`ComponentRoot` 규칙을 따른다. package 레이어는 SEED도 namespace를 쓴다(예: `packages/react-headless/checkbox/src/Checkbox.namespace.ts`).

### 차용 vs 거부

외부 패턴을 발견하면 다음 순서로 판단한다.

1. SEED 기존 패턴과 충돌함 → 거부하고 SEED 패턴을 유지한다. 예: snippet export의 dotted namespace, controlled만 지원하는 외부 API.
2. SEED가 같은 문제를 다른 방식으로 이미 풂 → 거부한다. 같은 문제에 패턴 두 개를 두지 않는다. 예: 상태 동기화는 `useControllableState`를 쓰므로 외부의 다른 동기화 패턴은 쓰지 않는다.
3. 둘 다 아님 → 차용한다. 단, prop·variant 이름은 SEED 기존 컴포넌트에 맞춘다. 예: 외부가 `colorScheme`이어도 SEED가 `variant`를 쓰면 `variant`로 정렬한다.

## Part 2: SEED의 실제 외부 의존성

새 의존성을 추가하기 전에 기존 패키지로 해결되는지 확인한다. `package.json`이 원천이다.

1. 현재 의존성을 조회한다: `git grep -h '"@radix-ui/\|"@floating-ui/' -- 'packages/**/package.json' | sort | uniq -c`
2. 같은 역할의 패키지가 이미 있으면 그것을 쓴다. 예: ref 합성 `@radix-ui/react-compose-refs`, `asChild` `@radix-ui/react-slot`, controlled 상태 `@radix-ui/react-use-controllable-state`, 포커스 트랩 `@radix-ui/react-focus-scope`, 포지셔닝 `@floating-ui/react`.
3. 외부 클릭 닫기처럼 SEED 자체 headless 패키지(`packages/react-headless/dismissible-layer` 등)가 맡는 동작이 있는지 먼저 본다.
4. 그래도 새 외부 의존성이 필요하면 추가 전에 사용자에게 확인한다(루트 `AGENTS.md`「경계」).

## Part 3: 접근성 설계 가이드

SEED는 ARIA Authoring Practices Guide(APG) 패턴을 따르되 직접 구현한다. React headless 기준이며, Lynx는 [lynx-patterns.md](lynx-patterns.md#accessibility)를 따른다. 새 headless 컴포넌트를 설계할 때 다음을 순서대로 확인한다.

### 1. ARIA APG 패턴 조회

https://www.w3.org/WAI/ARIA/apg/patterns/ 에서 해당 패턴을 찾아 정리한다.

- 필수 `role`(예: `role="tablist"`, `role="tab"`, `role="tabpanel"`)
- 필수 `aria-*` 속성(예: `aria-selected`, `aria-controls`, `aria-labelledby`)
- 필수 키보드 인터랙션

### 2. SEED 접근성 유틸리티

`@seed-design/dom-utils`(`packages/utils/dom-utils/src/`)가 제공한다.

- `ariaAttr(value)` → boolean을 `"true"` 또는 `undefined`로. 예: `"aria-checked": ariaAttr(isChecked)`
- `dataAttr(value)` → boolean을 `""` 또는 `undefined`로. 예: `"data-disabled": dataAttr(isDisabled)`
- `visuallyHidden` → 화면에서 숨기고 스크린리더에는 노출하는 style. hidden native input에 쓴다.
- `elementProps()`, `inputProps()`, `buttonProps()`, `labelProps()` → `data-*`를 허용하는 타입 안전 props 빌더. headless 훅 반환값에 쓴다.

### 3. 숨겨진 Native Input 패턴

checkbox, radio, switch처럼 native form control이 있는 컴포넌트는 접근성을 hidden native input이 맡고, 시각 control은 `aria-hidden`으로 스크린리더에서 뺀다. 기준 구현은 `packages/react-headless/checkbox/src/useCheckbox.ts`의 `hiddenInputProps`(`inputProps`, `visuallyHidden`)와 `controlProps`(`elementProps`, `"aria-hidden": true`)다.

### 4. 키보드 인터랙션

- 버튼·토글: Space, Enter → 활성화
- 체크박스·스위치: Space → 토글
- 탭·라디오: Arrow Left·Right → 이전·다음(RTL에서 방향을 뒤집는다)
- 슬라이더: Arrow, Home·End, PageUp·PageDown → 값 조정
- 다이얼로그·팝오버: Escape → 닫기. 목록 탐색: Home, End → 처음·마지막으로 이동

Space는 `useCheckbox.ts`의 `onKeyDown`·`onKeyUp`처럼 누르는 동안 active 상태를 표시하는 패턴을 따른다. 가장 복잡한 키보드 구현은 `packages/react-headless/slider/src/useSlider.ts`다.

### 5. Focus 관리

- 인터랙티브 요소의 focus ring → recipe에서 `createFocusRingRestStyles()`·`createFocusRingStyles()`로 적용한다([recipe-patterns.md](recipe-patterns.md)「Focus Ring」).
- 다이얼로그·팝오버의 포커스 트랩 → `@radix-ui/react-focus-scope`의 `FocusScope`(`packages/react-headless/dialog`, `drawer`, `menu`, `select`)
- 키보드 포커스만 구분 → `data-focus-visible` 속성
- 탭·라디오 그룹 → roving tabindex로 Arrow 키 포커스 이동

### 6. 동적 콘텐츠 알림

- Snackbar·Toast → `aria-live="polite"` + `aria-atomic="true"`(`packages/react-headless/snackbar/src/useSnackbar.ts`)
- 에러 메시지 → `aria-describedby`로 입력 필드와 연결
- 로딩 상태 → 스타일링용 `data-loading` + 선택적 `aria-busy="true"`

### WCAG 2.2 핵심 Success Criteria

- 1.3.1 Info and Relationships, 4.1.2 Name, Role, Value → semantic HTML과 ARIA role·속성
- 1.4.3 Contrast (Minimum)(텍스트 4.5:1, 큰 텍스트 3:1) → Rootage 토큰에서 관리한다. 조합 확인은 [color-token-analysis.md](color-token-analysis.md)의 `token-contrast.ts`
- 2.1.1 Keyboard → headless 키보드 핸들러
- 2.4.7 Focus Visible → `createFocusRingStyles()`
- 2.5.8 Target Size (Minimum)(24×24 CSS px), 2.5.5 Target Size (Enhanced)(44×44 CSS px) → Rootage `minHeight`

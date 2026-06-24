# SEED Web Components 구현 계획 (Lit)

> 상태: DRAFT v3. 전제: (1) 최종 빌드는 Lit, (2) 모든 컴포넌트 지원 불필요(단계적), (3) **DOM 전략 = Light DOM 확정**.
>
> v2→v3: DOM 전략이 **Light DOM으로 확정**됨. 근거: SEED는 `@seed-design/react`가 `@seed-design/css`를 **peerDependency**로 두어 **컴포넌트와 CSS가 별개로 글로벌 로드**되는 분리 구조다(컴포넌트는 className만 생성, CSS는 소비자가 별도 로드). 이건 Light DOM 모델 그 자체이고 WC도 동일하게 간다. → Shadow 관련 blocking(CSS 텍스트 전달, recipe side-effect 누수)은 **전부 해소**.

## 0. TL;DR

- 새 렌더 타겟으로 **Lit 기반 Web Components 패키지**를 모노레포에 추가한다 (`packages/elements` → `@seed-design/elements`).
- **Light DOM**으로 렌더한다. `@seed-design/css`를 **peerDependency**로 두고(컴포넌트는 className만 생성), 소비자가 `all.css`/토큰을 글로벌 로드한다 — 현 `@seed-design/react`와 동일한 분리 모델. recipe 함수(`(props) => className`)를 Lit에서 직접 호출.
- **headless 로직(상태·a11y·키보드·포커스)은 Lit으로 재구현**한다. `react-headless`는 React 강결합이라 재사용 불가. Lynx 포트가 "recipe 재사용 + 로직 재구현"을 이미 입증(사내 선례).
- 전 컴포넌트 대상 아님. **wave 단위**: 파일럿 → presentational → 단일 interactive → form control → (마지막) overlay.
- 착수 전 결정: form-association(ElementInternals) 방식, Icon SVG-slot 규약, controlled/uncontrolled + CustomEvent 설계, 테스팅 스택.

---

## 1. 리서치 근거 요약 (코드 검증 완료)

### 1.1 스타일 레이어는 framework-agnostic + Light DOM 분리 모델

- recipe `.mjs`는 **순수 함수**: `(props) => className`(단일) / `(props) => { slots }`(slot), React import 0. `splitVariantProps` 포함. (검증: `packages/css/recipes/action-button.mjs`, `checkbox.mjs`, `shared.mjs`.)
- `@seed-design/css`는 **빌드 스텝 없이 prebuilt를 커밋**해 ship(`exports`가 소스 `.mjs`/`.css` 직접 지시, `files`에 `recipes/`·`vars/`·`*.css`). peer-dep 소비자는 런타임에 그대로 받는다.
- **분리 모델(핵심)**: `@seed-design/react`는 `@seed-design/css`를 **peerDependency**로 둔다. 즉 컴포넌트는 className 문자열만 만들고, **클래스 정의 CSS는 소비자가 글로벌로 따로 로드**한다. recipe `.mjs`의 self side-effect import(`action-button.mjs:1` → `import './action-button.css'`)도 이 글로벌(Light DOM) 전제에서 document에 정상 주입된다. WC도 같은 분리 모델을 따른다.
- 토큰: `:root` + `<html>` data-*(`data-seed-color-mode` 등)로 라이트/다크 전환. JS 문자열로도 import(`vars.$color.bg.brandSolid` === `"var(--seed-color-bg-brand-solid)"`).
- recipe CSS는 `:is(:hover,[data-hover])`, `:is(:disabled,[disabled],[data-disabled])`, `:is(:focus-visible,[data-focus-visible])`로 매칭 — native pseudo와 `data-*` 둘 다(§3.3).

### 1.2 headless 레이어는 React 강결합 (재구현)

- `packages/react-headless/*` = 컴포넌트별 ~37개 패키지, 전부 React hooks/Context/synthetic event/refs. overlay 계열은 `createPortal`·Radix·`aria-hidden` 의존. framework-agnostic core 없음.
- **사내 선례**: `packages/lynx-react`는 `@seed-design/react-*`를 **0개** 의존. 자체 `src/hooks/useControllableState.ts`·`usePressTap.ts`로 재구현, 스타일은 `lynx-css` 미러로 재사용.
- WC 이점: real DOM + Light DOM이므로 `@seed-design/css`를 직접 쓴다(별도 css 미러 불필요).

### 1.3 lion + Lit 베스트프랙티스

- lion = white-label/subclasser: mixin 합성(`dedupeMixin`), granular `_*Template()` override, plain-class controller + 얇은 Lit mixin adapter(`OverlayController`+`OverlayMixin`), pure class export + `define` 분리 + `sideEffects` allowlist.
- form: lion은 `ElementInternals` 미사용(구식). → SEED는 **ElementInternals(form-associated custom elements)** 권장. Baseline(2023.3~). Firefox는 value/validation은 되나 internals ARIA/role reflection·host `:disabled` 등 미흡 → attribute fallback.

---

## 2. 패키지 구조

- 신설: `packages/elements/` → `@seed-design/elements`(확정). 루트 `workspaces`의 `packages/*`에 자동 포함.
- 의존: `lit`(runtime); `@seed-design/css`(**peerDependency** `^2`, react와 동일); overlay wave에서 `@floating-ui/dom`.
- 빌드: **bunchee** ESM-only, `ultra -r`로 `packages:build` 자동 편입.
- export(lion 차용): pure class export(`export { SeedActionButton }`) + 등록 분리(`@seed-design/elements/define/action-button` → `customElements.define`); `sideEffects`에 `define/**`만.
- 태그: `seed-*` prefix, 글로벌 `define`. ScopedElementsMixin 비채택(§6).
- **class-name ABI**: WC가 `.seed-action-button--variant_brandSolid` 같은 클래스명을 하드코딩 → `@seed-design/css` minor의 클래스 rename이 조용히 깸. peer `^2`만으론 부족 → **lockstep 호환성 테스트/릴리스 정책 필요**(§7). (react도 같은 결합을 가지므로 신규 리스크는 아님.)

---

## 3. 아키텍처

### 3.1 Light DOM (확정) — 적용 방식

- 컴포넌트는 `createRenderRoot() { return this; }`로 **Light DOM 렌더**.
- recipe 클래스: `actionButton({…})` → className을 host(presentational) 또는 inner native 요소(interactive)에 부여. **CSS는 컴포넌트가 자기 recipe를 import하면 self-import로 그 CSS만 주입된다(실측: `action-button.css`만, 타 recipe 0 rules) → `all.css` 불필요.** `package.json` `"sideEffects": ["**/*.css"]`로 JS는 tree-shake·CSS는 보존, native ESM + source-path import(barrel은 전체 CSS를 끌어오므로 회피), tree-shaking은 prod 빌드에서 검증. 토큰(`base.css` `:root`)은 한 번만 글로벌 로드.
- 토큰: `var(--seed-*)` 사용(소비자가 `base.css` 로드, `:root`에서 상속). `<html>` data-* 테마 그대로 적용.
- 트레이드오프(수용): 캡슐화 없음 → 소비자 글로벌 CSS와 클래스명 충돌 가능. `seed-*` 네임스페이스로 완화. `<slot>`/`::part` 미사용(Light DOM은 native slot 불가) → 합성은 일반 DOM 자식 + 명시적 API로.
- **컴포넌트별 CSS는 전부 글로벌 `@seed-design/css`(recipe 또는 `base.css`)에 둔다.** Light DOM에선 Lit `static styles`가 무시되므로 엘리먼트에 스타일을 두지 않는다(인라인 host CSS 변수는 예외).

### 3.2 컴포넌트 패턴 — child-handling (파일럿 실측 검증)

> **PoC 실측**(`~/Projects/lit-pilot`, Lit 3 + `@seed-design/css`, 브라우저): ① light DOM `render()`는 author children을 **덮어쓰지 않고** template을 형제로 append한다(2회 재렌더 후에도 author text 보존) — 단 형제로 섞이므로 "author children을 내부 요소로 감싸기"는 `render()`로 불가, imperative wrap 필요. ② recipe import는 그 컴포넌트 CSS만 주입(`action-button.css` 53 rules, badge/checkbox 0 rules) → **all.css 불필요**. ③ inner native `<button>`은 focus/`:disabled`/키보드 + recipe 스타일(bg/padding/radius) 모두 정상; host에 class만 준 경우 시각 스타일은 적용되나 `:disabled` 등 native 동작은 없음.

컴포넌트를 두 부류로 나눈다.

- **Non-interactive presentational(Badge, Text, Box, Divider, layout) — host에 recipe class, `render()` 없음.**
  ```ts
  createRenderRoot() { return this; }                              // light DOM
  willUpdate() { this.setAttribute("class", badge({ tone: this.tone })); }  // host에 recipe class
  // render() 없음 → author children 그대로 보존
  ```
  host(`<seed-badge>`)에 recipe class만 부여 → 시각 스타일 완벽(실측: bg/display/padding). native 인터랙션이 불필요한 표시용에 적합.
- **Interactive(예: `SeedActionButton`) — author children을 inner native 요소(`<button>`/`<a>`)로 wrap.**
  - `connectedCallback`에서 author children을 `<button class=recipe(...)>`로 이동(imperative). native `<button>`이 focus·`:disabled`·키보드 + recipe 스타일을 모두 처리(실측 확인). `<slot>`이 없는 light DOM에서 author children을 내부 native 요소에 넣는 표준 해법.
  - **#2 host-as-button 기각**: host에 `role=button`+수동 키보드는 native가 공짜로 주는 focus/Enter·Space/`:disabled`/tabindex를 재구현 → 폐기. `is=` customized built-in도 Safari 미지원으로 회피. (근거: web.dev custom-elements-best-practices, HTML Standard §4.13, MDN button role.)
  - style props(color/fontWeight)는 host 또는 inner 요소 inline CSS 변수로.
- **Composite form control(예: `SeedCheckbox`) — interactive 패턴 + 폼.** inner native `<input type="checkbox" hidden>` + checkmark 구조 + ElementInternals(§3.5, form-association은 shadow 불필요·light DOM에서 더 안정적). author label/SVG는 light DOM children으로 두거나(render append 동작 활용) 속성으로 — Wave 0에서 실측 확정. recipe: `checkbox({size})` → **`{root,label}`만**(`packages/css/recipes/checkbox.mjs`), checkmark는 **별도** `checkmark.mjs`.
- variant 프롭은 `splitVariantProps`로 호스트 속성과 분리.
- **controlled/uncontrolled**: 속성은 문자열 → React `onChange` 등가 없음. property↔attribute reflection + `checked`/`value` 라운드트립 + `CustomEvent`(`seed-change`, `detail.checked`) 발행 규약 명시(§3.5, §5).

### 3.3 상태와 native pseudo

- recipe가 `:is(native, [data-*])`를 받지만 **host custom element는 native pseudo를 대부분 못 받음**(`:disabled`는 form-associated/native만, `:focus-visible`는 host vs inner 이슈). → interaction state는 **host에 `data-*` 토글**(`data-disabled`/`data-focus-visible`/`data-hover`/`data-active`)을 1차로 설계. 내부에 native `<button>`/`<input>`을 두면 거기서는 native pseudo 정상.

### 3.4 로직 공유 (재구현)

- **ReactiveController**: `ControllableStateController`, `FocusVisibleController`/`PressController`(→ `data-*`), `OverlayController`(plain class)+`OverlayMixin`(`@floating-ui/dom`).
- **Mixin(`dedupeMixin`)**: `DisabledMixin`, `FocusMixin`, `FormAssociatedMixin`(ElementInternals 래핑 + `declare class` 블루프린트).
- **유틸 lift**: `prevent-scroll` DOM 함수 — iOS-Safari 경로는 upstream 패치 중이라 verbatim 아님(`usePreventScroll.ts` 확인); `dataAttr`/`ariaAttr` 사소; `visuallyHidden` verbatim; `splitMultipleVariantsProps`는 Lynx 버전 참고.
- **style-props [정정]**: `packages/react/src/utils/styled.tsx`는 **815줄 + React hooks 사용**. 순수 helper `handleColor`/`handleDimension`(~40줄)만 lift, 반응형/context 머신은 Lit directive/controller로 재구현. (포팅 범위는 결정 항목 §7.)

### 3.5 form-association

- `static formAssociated = true` + `attachInternals()` + `setFormValue`/`setValidity`/`formResetCallback`. `FormAssociatedMixin`으로 추출, Firefox reflection 미흡 → role/aria/`:disabled` attribute fallback. lion slotted-input 방식 비채택.

---

## 4. 컴포넌트 롤아웃 (wave)

인벤토리 ≈79개(`packages/react/src/components`).

- **Wave 0 — 파일럿 (패턴/빌드/배포 확정)**: **`ActionButton` + `Checkbox`**.
  - 목적(아키텍처는 Light DOM으로 확정됐으므로 결정이 아니라 **검증**): `define`/export 전략, bunchee 빌드, recipe 호출 + 글로벌 CSS 적용, 토큰/테마, §3.2 child-handling 패턴(leaf=no-render / composite=props-in) 검증, 테스팅 파이프라인.
  - ActionButton: 단일 + style-props + icon 경로(§5).
  - Checkbox: form-association(ElementInternals), `data-*` 상태, checkmark sub-recipe, controlled/uncontrolled + `CustomEvent` — **form control 패턴의 레퍼런스**.
- **Wave 1 — presentational**: Text, Box, Icon, Divider, Skeleton, Flex/VStack/HStack/Grid. (Icon은 §5 SVG-slot 선행.)
- **Wave 2 — 단일 interactive**: Chip 계열, Fab 계열, ToggleButton, ActionChip.
- **Wave 3 — form control 확장**: Switch, RadioGroup, SegmentedControl(Wave 0 Checkbox 패턴 재사용).
- **Wave 4 — overlay (defer, 공유 인프라 먼저)**: Dialog/BottomSheet/Menu/Tooltip. 이들은 leaf가 아니라 하나의 overlay infra 공유(`BottomSheet → react-drawer → dismissible-layer + presence + prevent-scroll + focus-scope + aria-hidden`). **Wave 4 안에서 인프라 먼저, 컴포넌트는 그 위에**(병렬 불가).

각 wave 종료 시 docs/storybook + 테스트.

---

## 5. 착수 전 해결 항목

1. **Icon/SVG 전달**: React `Icon`은 SVG를 **prop(`svg: ReactNode`)** 으로 받음(`@radix-ui/react-slot`). WC + Light DOM(native slot 불가)에서는 **자식 SVG를 그대로 두거나 문자열 속성**으로 받는 규약 필요(레포에 아이콘 레지스트리 없음). Icon(Wave 1)·ActionButton 아이콘(Wave 0) 선행 의존.
2. **이벤트 API / React parity**: `CustomEvent`(`seed-change` + `detail`) 네이밍 규약.
3. **framework wrapper**: 주 소비자 React → `@lit/react` wrapper 제공 여부 결정(현재 레포에 없음). 미제공 시 소비자가 ref/event/boolean-attr 인체공학 부담.
4. **TS 타입**: `HTMLElementTagNameMap` 보강 + 태그별 prop 타입.
5. **SSR / Declarative Shadow DOM**: Light DOM이라 Shadow 하이드레이션 통증은 회피되나, custom element 정의 타이밍/Next.js 환경에서의 등록 전략은 입장 필요.
6. **테마 부트스트랩**: 소비자는 `@seed-design/css/theming`의 `generateThemingScript`로 `<html>` data-* + `base.css` 로드 필요 — WC 단독으론 테마 안 됨(명시).
7. **테스팅 현실 [검증됨]**: happy-dom 20.4.0은 `customElements`/`data-*`/`CustomEvent`는 지원하나 **`ElementInternals`/`attachInternals`/`formAssociated` 미지원**(소스 확인). → Checkbox form-association은 기존 bun 파이프라인에서 unit test 불가. **결정 필요**: (a) form-control slice는 `@open-wc/testing`+web-test-runner, (b) form-association은 Storybook/브라우저 검증만. (leaf·단순 컴포넌트는 bun+happy-dom으로 충분.)
8. **번들/tree-shaking [실측 확정]**: 컴포넌트가 자기 recipe를 import하면 그 CSS만 주입됨(PoC: `action-button.css` 53 rules만, 타 recipe 0). `package.json` `"sideEffects":["**/*.css"]` + native ESM + source-path import(barrel 회피). `all.css` 미사용. tree-shaking은 prod 빌드에서 최종 검증.

---

## 6. lion에서 빌릴 것 / 피할 것

- **빌릴**: mixin 합성(`dedupeMixin`), granular `_*Template()` override, plain-class controller + mixin adapter(OverlayController), pure export + define 분리 + `sideEffects` allowlist, 재사용 test suite.
- **피할**: lion form system(→ ElementInternals), ScopedElementsMixin(스펙 불안정·SSR 충돌 → 글로벌 `define` + `seed-` prefix).

---

## 7. 결정 항목 & 리스크

**결정 필요(파일럿 전/중):**
1. ~~패키지 이름~~ → `@seed-design/elements`(확정).
2. form-association: ElementInternals 채택 확정 + `FormAssociatedMixin` 형태.
3. Icon SVG-slot 규약(§5.1).
4. controlled/uncontrolled + `CustomEvent` 설계(§3.2, §5.2).
5. style-props 포팅 범위(순수 helper만 vs 반응형 전체).
6. 테스팅 스택: happy-dom은 ElementInternals 미지원 확정 → form-control은 web-test-runner vs Storybook-only 택일(§5.7).
7. framework wrapper(`@lit/react`) 스코프.

**리스크:**
8. overlay 인프라 재구현 — 가장 비쌈. 매핑:

| react-headless 조각 | 네이티브 대체 | 손수 구현 |
|---|---|---|
| positioning(`@floating-ui/react`) | `@floating-ui/dom` | 거의 없음 |
| focus trap(`@radix-ui/react-focus-scope`) | `<dialog>` modal, `inert` | 부분(스택/복원) |
| dismissible-layer stack | 네이티브 등가 없음 | 전부 |
| scroll lock(`react-prevent-scroll`) | — | iOS 경로 패치 반영 재구현 |
| `aria-hidden` siblings | `inert`/Popover top-layer | 부분 |
| presence/animation(`react-presence`) | Web Animations API | 라이프사이클 재구현 |

9. class-name ABI / lockstep 버전(§2).
10. Light DOM 글로벌 CSS 충돌 — `seed-*` 네임스페이스로 완화, 잔여 위험 모니터링.

---

## 8. 배포 & snippet 전략 (3층)

published 패키지에 **아이콘·i18n 레이블을 포함하지 않는다**(baseline). 대신 3개 레이어로 나누고, 의존성은 위→아래 한 방향(3→2→1)으로만 흐른다.

1. **`@seed-design/elements` (npm) — white-label base.** 컴포넌트 클래스를 export. 아이콘은 `checkedIcon` 같은 property의 **빈 자리**로만 받고, 내장 텍스트(aria-label 등)도 0. 로직·구조·a11y는 강제하되 concrete 아이콘 패키지 의존은 없음. (예: `SeedCheckbox`는 checkmark SVG를 `checkedIcon` property로만 받음 — 패키지엔 SVG 없음.)
2. **WC snippet (사용자 복사·소유) — 아이콘 박은 완성 WC.** published 클래스를 **상속**해 concrete 아이콘(`@karrotmarket`/`@daangn`)을 property로 박고 `customElements.define`으로 태그 등록. default `aria-label` + "own i18n" 주석. 이 레이어까지로 **바닐라/Vue에서 완성품**.
3. **React wrapper snippet (사용자 복사, 선택) — `@lit/react` 어댑터.** `createComponent({ tagName, elementClass })`로 2층 WC를 React 컴포넌트로 변환. 아이콘을 모르는 **순수 어댑터**(prop→attribute, event→onXxx, ref). React 안 쓰면 생략. react integration이 아이콘보다 먼저 올 필요 없음(아이콘은 2층, react는 그 위).

아이콘 없는 컴포넌트(ActionButton 등)는 1층이 곧 완성품이라 published define으로 바로 등록 가능.

**근거**: published `@seed-design/react`도 concrete 아이콘셋 의존 0(opaque `svg` slot), 실제 아이콘 import는 snippet에서(`docs/registry/react/ui/*` + `@karrotmarket/...icon`), `aria-label`은 snippet에 default + `{/* implement your own i18n */}` 주석. 같은 규율을 elements에 적용.

**인프라 재사용**: registry/CLI(`add`) 파이프라인이 framework-agnostic이고 lynx가 이미 같은 파이프라인을 씀(`docs/registry/lynx/`). `docs/registry/elements/` 트리 + `frameworks[]` 엔트리 추가로 재사용(신규 인프라 거의 없음).

**오픈 이슈**:
- **등록 지점 정책**: 아이콘 필수 컴포넌트는 1층이 클래스만 export하고 등록은 2층 snippet에서(`define("seed-checkbox", MyCheckbox)`). 아이콘 없는 컴포넌트는 1층 define entry로 바로 등록. `customElements.define`은 태그당 1회라 1·2층 등록이 겹치지 않게 정리 필요.
- `checkedIcon` 외 `uncheckedIcon`/`indeterminateIcon` property 확장.
- `@lit/react` 의존성 위치와 wrapper 자동 생성.
- **아이콘 주입 보류**: `@karrotmarket/icon-data`가 SVG **string**만 제공 → raw `innerHTML` 주입은 임시방편이라 보류. icon-data가 SVG 파일(import 가능) 또는 아이콘 WC를 제공하면 2층 snippet에서 주입한다. snippet 구조는 구현됨(`demo/seed-design/ui/checkbox.ts`가 빈 서브클래스로 아이콘 자리만 잡아둠).

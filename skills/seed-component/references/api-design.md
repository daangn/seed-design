# API 설계 원칙

Snippet 레이어와 컴포넌트 공개 API를 설계할 때 따른다. React·Lynx snippet 모두에 적용하는 API 설계 규칙의 단일 원천이다. 파일 위치·등록·문서 반영 순서는 [implementation-steps.md](implementation-steps.md)에 있고, 이 문서는 어떤 API 형태를 왜 고르는지만 다룬다.

- Snippet 경로: React `docs/registry/react/ui/`, Lynx `docs/registry/lynx/ui/`
- Lynx snippet은 React snippet을 복사하지 않는다 → `@lynx-js/react`, `@seed-design/lynx-react`, Lynx icon package, 지원하지 않는 Web API 차이를 반영해 별도 user-facing API로 설계한다.

## Delivery Surface Gate

컴포넌트를 어디서 공개할지 먼저 정한다. "컴포넌트 제작"이 항상 registry snippet 제작을 뜻하지 않는다.

- `package-only` → package export가 이미 user-facing API이고, 단일 import로 충분하며, wrapper가 composition·state·dependency를 줄이지 않는다.
- `snippet-only` → package primitive가 없거나, 사용자가 설치 후 앱 코드에 복사해 조정해야 하는 wrapper가 핵심이다.
- `package+snippet` → package primitive가 필요하고, snippet이 3개 이상 sub-component 조합, 기본 아이콘·indicator, 서드파티 통합, 반복되는 앱 코드 boilerplate를 줄인다.
- `docs-only` → 구현 표면이 이미 있고 문서·예제 parity만 필요하다.

### 필수 확인 신호

React 또는 다른 플랫폼에 동등 컴포넌트가 있으면 함께 본다.

1. docs Usage import가 package direct인지 `@/components/ui/*` snippet인지 확인한다.
2. `docs/registry/{platform}/ui/{name}.tsx`가 있는지 확인한다.
3. package export(`packages/react/src/components/index.ts`, `packages/lynx-react/src/components/index.ts`)가 있는지 확인한다.
4. example app이 package direct를 쓰는지 vendored snippet copy를 쓰는지 확인한다.
5. wrapper가 줄이는 dependency·state·composition boilerplate가 실제로 있는지 확인한다.

### 판단 규칙

- React 동등 컴포넌트가 package direct이고 registry snippet이 없음 → Lynx도 `package-only`를 기본값으로 둔다. 예: React `Badge`가 `@seed-design/react` export로만 제공되면 Lynx `Badge`도 `@seed-design/lynx-react` export와 docs·example direct import가 기본이다.
- 단일 presentational primitive → snippet을 만들지 않는 쪽이 기본이다. wrapper가 더하는 가치가 없으면 `docs/registry/*/ui` 파일, `registry-ui.ts` 등록, vendored snippet copy를 만들지 않는다.
- snippet이 필요함 → "사용자가 snippet 없이 쓰면 어떤 반복이나 실수가 생기는가?"를 한 문장으로 설명할 수 있어야 한다.
- `docs/content/*`와 `examples/*`는 공개 표면에 맞는 import 경로를 쓴다. package-only 컴포넌트 문서에서 `ui:{name}` 설치를 안내하지 않는다.

## Analog Parity Check

동등 컴포넌트를 참고할 때 variant·interface만 비교하지 않는다. React와 Lynx를 함께 다루면 먼저 [React·Lynx API 비교](api-parity.md)를 실행하고, 결과의 `sources`와 차원별 `evidence`를 아래 항목의 근거로 붙인다.

- Variant·interface: prop 이름, default variant, 지원하지 않는 prop
- Docs Usage: 사용자가 import하는 경로와 최소 예시
- Registry·package export: snippet 파일과 `registry-ui.ts` 등록 여부, package barrel export와 type export 여부
- Example surface: example app이 package direct인지 vendored snippet인지
- Wrapper value: snippet이 숨기는 composition·state·dependency가 있는지

비교 결과에 함께 기록한다.

- [경로 조회](component-map.md)의 `component.state`와 현재 경로
- API 비교에서 확인한 공통·React 전용·Lynx 전용 항목
- 정적 분석으로 확인하지 못해 `unknown`으로 남은 항목과 직접 확인한 결론. `confidence: unknown`은 한쪽 기능이 없다는 뜻이 아니다 → 해당 플랫폼의 공개 파일과 상속 타입을 직접 확인한다.
- 의도적으로 다르게 설계할 항목과 플랫폼 제약

## Correction Retro

사용자 조정이 들어오면 다음을 기록한 뒤 작업을 갱신한다.

- 빠진 맥락: 어떤 docs·registry·package·example 신호를 확인하지 않았는가?
- 잘못 적용한 패턴: "대부분 컴포넌트는 snippet이 있다"처럼 어떤 규칙을 과잉 일반화했는가?
- 다음 판단 규칙: 같은 상황에서 먼저 볼 파일과 제외할 작업은 무엇인가?
- Skill 업데이트 후보: 이 규칙을 `SKILL.md`, `platform-gate.md`, `api-design.md` 중 어디에 넣을 것인가?

사용자가 Skill을 함께 발전시키자고 요청하면 correction retro를 구현 작업의 일부로 다룬다. 회고 설명에서 끝내지 않고 해당 reference에 지속 규칙을 추가할지 판단한다.

## API 설계 9원칙

### 1. Action을 노출하고 State setter를 숨긴다

사용자가 내부 상태를 직접 조작하지 않게 한다. render-prop이나 callback이 주는 API도 같다.

- 좋음: `updateFileStatus(fileId, { status: "error", message: "..." })`처럼 의미 있는 action
- 나쁨: `setAcceptedFiles(prev => prev.map(...))`처럼 raw state setter를 노출해 사용자가 배열을 직접 map·filter하게 함

### 2. API가 Recipe 구조를 이끈다

Snippet prop interface가 필요한 slot과 state를 정하는 입력이다. Recipe의 token·slot 이름이 public API를 강제하지 않도록 사용자가 볼 표면을 먼저 검토한다.

- snippet이 여러 sub-component를 감추거나, 자동 주입 요소·affix·helper slot처럼 public contract 판단이 필요함 → API 초안을 먼저 잡는다.
- 단일 presentational 컴포넌트이고 기존 컴포넌트와 API 패턴이 거의 같음 → Recipe부터 빠르게 검증해도 된다.
- minimal user code, 접근성 구조, 공개할 slot과 숨길 helper slot, token vocabulary가 서로 충돌하지 않아야 한다.

### 3. 자동 주입 요소는 prop으로 명시한다

Snippet이 아이콘이나 indicator를 자동으로 넣으면 이를 제어할 prop을 interface에 둔다. 예: `docs/registry/react/ui/accordion.tsx`의 `AccordionTriggerProps.suffixIcon`(기본값 `IconChevronDownSmallLine`).

- 완전 교체 prop(`suffixIcon`, `indicator`), 숨김·비활성화 prop(`hideIndicator`), 또는 둘 다 중에서 고른다.
- 기본값이 있는 자동 주입 요소를 consumer가 제어할 수 없으면 Snippet이 보기보다 훨씬 opinionated해진다.

### 4. Recipe 통합 기준

- sub-component가 항상 부모와 함께 쓰임 → 부모 recipe의 slot으로 통합한다. 예: `file-upload-item` recipe 안의 remove button slot
- 독립적으로 쓸 수 있음 → 별도 recipe로 분리한다. 예: `checkbox` recipe와 `checkmark` recipe(checkmark는 다른 컴포넌트에서도 쓴다)

### 5. 내부 helper slot과 공개 slot을 구분한다

애니메이션, padding 분리, layout 보정용 helper slot은 구현에 필요해도 공개 API에 노출할 필요는 없다.

- 공개 기본값: 사용자가 의미를 이해할 수 있는 slot만 export
- 비공개 기본값: animation wrapper, padding wrapper, measurement wrapper 같은 implementation helper slot
- 예외: consumer가 직접 조합하거나 스타일링해야 하는 명확한 사용 사례가 있을 때만 공개

`contentInner`, `layoutWrapper` 같은 helper slot을 export하려면 "사용자가 왜 이 레이어를 알아야 하는가?"를 먼저 설명할 수 있어야 한다.

### 6. Prop 이름 충돌을 의식적으로 처리한다

Snippet convenience prop이 underlying primitive나 native prop과 이름이 겹치면 consumer가 보는 타입과 실제 런타임 contract가 정확히 맞게 설계한다.

- `title`, `size`, `color`, `prefix`는 native HTML attribute나 기존 slot prop과 충돌하기 쉽다.
- 충돌 가능성이 보임 → `Omit<...>`으로 제외하거나 prop 이름을 바꾼다. 예: `AccordionTriggerProps`는 `Omit<SeedAccordion.TriggerProps, "children" | "title" | "prefix">`를 확장한다.
- `interface extends`가 충돌로 막힘 → type alias를 쓴다. union이 필요 없으면 interface로 평평하게 둔다.

### 7. Mode API는 확장 가능성이 분명할 때만 enum으로 만든다

모드가 사실상 on/off면 enum 문자열보다 boolean prop을 우선한다.

- boolean 우선: `multiple?: boolean`처럼 한 가지 capability를 켜고 끔
- enum 허용: `orientation: "horizontal" | "vertical"`처럼 값이 대등하거나 제3의 상태가 이미 명확함
- 나쁜 신호: `"single" | "multiple"`처럼 한 값이 기본 상태를 다시 이름 붙인 것이고 추가 상태 계획이 없음

외부 레퍼런스가 enum을 써도 그대로 따르지 않는다. SEED의 snippet·headless 표면에서 사용자가 실제로 선택하는 개념을 먼저 정한다. 예: `packages/react-headless/accordion/src/useAccordion.ts`의 `multiple?: boolean`.

### 8. 특정 mode에서만 유효한 prop은 타입으로 차단한다

특정 mode에서 의미 없는 prop을 런타임에서 조용히 무시하지 않는다 → discriminated union으로 불가능한 조합을 막는다.

```typescript
type ComponentProps =
  | { multiple?: false; collapsible?: boolean }
  | { multiple: true; collapsible?: never };
```

- 문서는 prop이 어느 mode에서만 유효한지 명시한다.
- 테스트는 허용·불허 타입 예시와 런타임 동작을 함께 확인한다.
- headless hook이 이 union을 쓰면 styled wrapper도 같은 contract를 유지한다. wrapper에서 props를 다시 조합할 때 mode별로 hook props를 분기해 `multiple: true` 객체에 single 전용 prop이 섞이지 않게 한다.

런타임 fallback이 필요해도 public API에 "넣어도 되지만 무시됨" 상태를 만들지 않는다.

### 9. Affix prop은 content contract 기준으로 정한다

`prefix`, `suffix`, `prefixIcon`, `prefixAvatar` 같은 affix API는 recipe token 이름이 아니라 사용자에게 열어 줄 content 종류로 정한다.

- broad content가 필요함 → `prefix`·`suffix` 같은 generic content slot을 우선한다.
- icon-only contract가 명확함 → `prefixIcon`·`suffixIcon` 같은 icon 전용 prop을 둔다.
- avatar, thumbnail, control처럼 별도 semantic content kind가 명확함 → 전용 prop이나 전용 slot으로 분리할 수 있다.
- 같은 위치에 `prefix`와 `prefixIcon`을 동시에 열지 않는다 → 둘을 함께 넣을 수 있어 API 모델이 흐려진다. 하나를 고른다.

`prefixIcon` token은 generic `prefix` slot 안의 icon styling을 뜻할 수 있다. token 이름이 곧 snippet prop 이름일 필요는 없다.

## [Snippet] Children composition vs convenience prop 판단 기준

둘 다 가능하면 다음 기준으로 정한다.

- convenience prop 우선 → snippet이 3개 이상 sub-component를 감춤, `title`·`description`·`prefix`처럼 반복 구조가 명확함, 사용자가 child 순서나 내부 마크업을 바꿀 이유가 적음
- children composition 유지 → rich content가 핵심 사용 사례임, child 순서·구조를 consumer가 자주 제어함, snippet이 low-level composition wrapper라는 목적이 문서로 명확함

## Snippet 작성 패턴

기준 예시는 `docs/registry/react/ui/accordion.tsx`다. `Accordion`·`AccordionItem`은 root를 그대로 re-export하고, `AccordionTrigger`는 convenience prop을 가진 `React.forwardRef` wrapper다.

### Wrapper와 노출 범위

- convenience wrapper를 먼저 설계한다. low-level re-export보다 사용자가 가장 짧게 쓸 수 있는 표면을 먼저 만든다.
- Props를 `RootProps extends`로 끝내지 않는다 → `title`, `description`, `suffixIcon` 같은 실제 convenience prop을 먼저 정의한다. `children`을 그대로 열어야 하는 low-level composition이면 문서에 이유와 권장 composition을 쓴다.
- 로직 없는 root wrapper를 만들지 않는다 → `children`을 underlying `Root`에 넘기기만 하면 `export const Accordion = SeedAccordion.Root`처럼 re-export한다. title·description 조합, 자동 close button, 접근성 경고처럼 조합 책임이 있으면 wrapper를 둔다.
- 하위 컴포넌트는 독립적인 public 사용 의도, root와 다른 props·lifecycle, consumer가 별도 위치에 렌더해야 하는 요구가 있을 때만 노출한다.
- `rootProps`, `headerProps` 같은 escape hatch는 실제 사용성이 분명할 때만 추가한다. 예: `docs/registry/react/ui/list.tsx`의 `ListButtonItem` `rootProps`.

### 접근성 fallback

접근성 경고와 fallback 렌더링은 별개의 선택이다. `aria-label`이나 `aria-labelledby`가 underlying content에 그대로 전달되면 convenience wrapper가 임의의 hidden label·title을 대신 렌더하지 않는다. hidden fallback을 만들기 전에 실제 DOM·ARIA 연결이 필요한지, consumer가 준 aria prop과 충돌하지 않는지 확인한다.

### Responsive wrapper

- breakpoint 순서와 fallback 의미가 필요함 → `useBreakpoint()` 값을 직접 비교하지 않고 `useBreakpointValue()`를 우선한다. 예: `docs/registry/react/ui/pagination.tsx`.
- 서로 다른 underlying component를 조건부 렌더링하는 Root wrapper → 한쪽 Root props 전체를 양쪽에 spread하지 않는다. 예: `packages/react/src/components/ResponsiveSidePanel/ResponsiveSidePanel.tsx`의 `sidePanelRootProps`·`bottomSheetRootProps`.
- wrapper가 open state를 소유함 → `children`, `open`, `defaultOpen`, `onOpenChange`를 top-level에 직접 정의하고, 대상 component가 드러나는 prop bag에서 이 state props를 `Omit`한다.
- top-level `onOpenChange`가 boolean-only → underlying component의 change details는 의도적으로 추상화한 contract로 본다. details를 노출해야 하면 top-level callback 타입에서 명시적으로 설계하고, bag-level `onOpenChange`와 동시에 열지 않는다.

## [Snippet] Export naming

Snippet의 최상위 export 이름은 사용자가 설치 후 import하는 이름이다 → underlying React primitive 이름을 그대로 따르지 않는다.

- convenience wrapper는 `Component`를 우선한다. 내부에서 `SeedComponent.Root`를 써도 사용자용 이름에 `Root`를 붙이지 않는다.
- low-level composition wrapper라는 목적이 분명하고 sub-component를 함께 노출해야 할 때만 `ComponentRoot`를 쓴다.
- 한 snippet에 `Component`와 `ComponentRoot`를 함께 두면 `Component`는 가장 짧은 기본 사용 경로, `ComponentRoot`는 escape hatch여야 한다.
- wrapper는 `React.forwardRef`로 감싸고 `displayName`을 exported symbol과 같은 단순 문자열로 맞춘다(`AccordionTrigger` export → `"AccordionTrigger"`). namespace가 실제 runtime API가 아니면 `Accordion.Trigger` 같은 dotted name을 쓰지 않는다.

## Registry 등록

등록 파일과 절차는 [implementation-steps.md의 Registry UI 단계](implementation-steps.md#step-5-registry-ui-snippet-레이어)에 있다. API 설계 단계에서는 다음만 정한다.

- snippet이 안정된 user API인가
- 설치 후 사용자가 쓸 최소 코드는 무엇인가
- version·dependency metadata에 영향을 주는 공개 표면이 있는가

## Block 패턴

preset 조합이 필요한 컴포넌트(Footer 등)는 block을 제공한다. 현재 block은 React에만 있다.

- 역할: 실제 사용 시나리오를 보여 주는 완성된 UI 조합이다. variant 쇼케이스가 아니라 legal links, contact info, SNS links 같은 실제 사용 패턴을 보여 준다.
- 위치와 등록: `docs/registry/react/block/`, `docs/registry/react/registry-block.ts`. block 전용 아이콘은 `docs/registry/react/icon/`과 `docs/registry/react/registry-icon.ts`.
- 이름·파일 규칙(zero-padded 번호 `footer-01` 등)은 `docs/registry/react/block/AGENTS.md`, 아이콘 규칙은 `docs/registry/react/icon/AGENTS.md`를 따른다.

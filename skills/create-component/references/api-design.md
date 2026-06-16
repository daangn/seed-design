# API 설계 원칙

Snippet 레이어와 컴포넌트 공개 API 설계 시 따르는 원칙.

Platform별 snippet 경로:
- React: `docs/registry/react/ui/`
- Lynx: `docs/registry/lynx/ui/`

Lynx snippet은 React snippet을 그대로 복사하지 않는다. `@lynx-js/react`, `@seed-design/lynx-react`, Lynx icon package, unsupported Web API 차이를 반영해 별도 user-facing API로 설계한다.

## Delivery Surface Gate

컴포넌트를 어디서 공개할지 먼저 결정한다. "컴포넌트 제작"은 항상 registry snippet 제작을 뜻하지 않는다.

| 공개 표면 | 선택 조건 |
|-----------|-----------|
| package-only | package export가 이미 사용자-facing API이고, 단일 import로 충분하며, wrapper가 composition/state/dependency를 줄이지 않는다 |
| snippet-only | package primitive가 없거나, 사용자가 설치 후 앱 코드에 복사해 조정해야 하는 wrapper가 핵심이다 |
| package + snippet | package primitive는 필요하지만, snippet이 3개+ sub-component 조합, 기본 아이콘/indicator, 서드파티 통합, 반복되는 앱 코드 boilerplate를 줄인다 |
| docs-only | 구현 표면이 이미 존재하고 문서/예제 parity만 필요한 경우 |

### 필수 확인 신호

React 또는 다른 플랫폼 동등 컴포넌트가 있으면 아래를 함께 본다.

1. docs Usage import가 package direct인지, `@/components/ui/*` snippet인지 확인
2. `docs/registry/{platform}/ui/{name}.tsx` 존재 여부 확인
3. package export (`packages/{platform-react}/src/components/index.ts`) 존재 여부 확인
4. example app이 package direct를 쓰는지, vendored snippet copy를 쓰는지 확인
5. wrapper가 줄이는 dependency/state/composition boilerplate가 실제로 있는지 확인

### 판단 규칙

- React 동등 컴포넌트가 package direct이고 registry snippet이 없으면, Lynx도 package-only를 기본값으로 둔다.
- 단일 presentational primitive는 snippet을 만들지 않는 쪽이 기본이다. wrapper가 추가하는 가치가 없으면 `docs/registry/*/ui`, `registry-ui.ts`, vendored snippet copy를 만들지 않는다.
- snippet이 필요한 경우에는 "사용자가 snippet 없이 쓰면 어떤 반복/실수가 생기는가?"를 한 문장으로 설명할 수 있어야 한다.
- `docs/content/*`와 `examples/*`는 공개 표면에 맞춰 import 경로를 쓴다. package-only 컴포넌트 문서에서 `ui:{name}` 설치를 안내하지 않는다.

## Analog Parity Check

동등 컴포넌트를 참고할 때 variant/interface만 비교하지 않는다. 아래 매트릭스를 채운 뒤 구현 표면을 결정한다.

| 항목 | 확인할 내용 |
|------|-------------|
| Variant/interface | prop 이름, default variant, unsupported prop |
| Docs Usage | 사용자가 import하는 경로와 최소 예시 |
| Registry 여부 | snippet 파일과 registry-ui 등록 여부 |
| Package export | package barrel export와 type export 여부 |
| Example surface | example app이 package direct인지 vendored snippet인지 |
| Wrapper value | snippet이 숨기는 composition/state/dependency가 있는지 |

Badge 같은 package-only primitive의 경우: React `Badge`가 `@seed-design/react` package export로 제공되고 registry snippet이 없다면, Lynx `Badge`도 `@seed-design/lynx-react` package export와 docs/example direct import를 기본값으로 한다.

## Correction Retro

사용자 조정이 들어오면 아래를 기록한 뒤 작업을 갱신한다.

| 항목 | 질문 |
|------|------|
| 빠진 맥락 | 어떤 docs/registry/package/example 신호를 확인하지 않았는가? |
| 잘못 적용한 패턴 | "대부분 컴포넌트는 snippet이 있다"처럼 어떤 규칙을 과잉 일반화했는가? |
| 다음 판단 규칙 | 같은 상황에서 먼저 볼 파일과 제외할 작업은 무엇인가? |
| 스킬 업데이트 후보 | 이 규칙을 `SKILL.md`, `platform-gate.md`, `api-design.md` 중 어디에 넣을 것인가? |

사용자가 스킬을 함께 발전시키자고 요청하면, correction retro를 구현 작업의 일부로 취급한다. 단순 회고 설명에서 끝내지 말고 해당 reference에 durable rule을 추가할지 판단한다.

## Snippet 레이어 필요 여부

| 조건 | Snippet 필요? |
|------|-------------|
| 3개+ sub-component를 조합해야 사용 가능 | Yes |
| 서드파티 라이브러리와 통합 필요 | Yes |
| 단일 import으로 사용 가능 | No |
| 이미 심플한 API | No |

## API 설계 9원칙

### 1. Action을 노출하고 State setter를 숨긴다

사용자가 내부 상태를 직접 조작할 필요 없게 한다.

- **좋음**: `updateFileStatus(fileId, { status: "error", message: "..." })` — 명확한 action
- **나쁨**: `setAcceptedFiles(prev => prev.map(...))` — raw state setter 노출

render-prop이나 callback에서 제공하는 API도 동일하다. 사용자가 배열을 직접 map/filter하게 하지 말고, 의미 있는 action 함수를 제공한다.

### 2. API가 Recipe 구조를 이끈다

Snippet prop interface는 필요한 slot과 state를 결정하는 입력이다. Recipe의 token/slot 이름이 public API를 강제하지 않도록, 사용자가 보게 될 surface를 먼저 검토한다.

- **API 초안을 먼저 잡아야 하는 경우**: snippet이 여러 sub-component를 감추거나, 자동 주입 요소/affix/helper slot처럼 public contract 판단이 필요한 경우
- **Recipe부터 빠르게 검증해도 되는 경우**: 단일 presentational 컴포넌트이고 기존 컴포넌트와 API 패턴이 거의 같은 경우
- **판단 기준**: minimal user code, accessibility 구조, 공개해야 하는 slot과 숨겨야 하는 helper slot, token vocabulary가 서로 충돌하지 않아야 한다

세부 구현 순서와 registry 작업은 `implementation-steps.md`의 Snippet/Recipe 단계가 기준이다. 이 문서에는 "왜 이 API 형태를 선택하는가"만 남긴다.

### 3. 자동 주입 요소는 prop으로 명시한다

Snippet이 아이콘이나 indicator를 자동으로 삽입하는 경우, 반드시 prop interface에 이를 제어할 수 있는 prop을 포함한다.

```typescript
// 좋음: suffixIcon을 제어 가능
interface AccordionItemProps {
  suffixIcon?: React.ReactNode;  // 기본값: ChevronDown
}

// 나쁨: 아이콘이 암묵적으로 삽입됨
```

자동 주입 요소가 있으면 아래 중 하나를 public API에 둘지 검토한다:
- 완전 교체 prop (`suffixIcon`, `indicator`)
- 숨김/비활성화 prop (`hideIndicator`)
- 둘 다

기본값이 있는 자동 주입 요소를 consumer가 제어할 수 없으면, Snippet이 보기보다 훨씬 더 opinionated해진다. 구체적인 wrapper 작성 규칙은 `implementation-steps.md`의 Snippet 파일 작성 패턴을 따른다.

### 4. Recipe 통합 기준

sub-component가 항상 부모와 함께 사용되면 부모 recipe의 slot으로 통합한다. 독립적으로 사용 가능하면 별도 recipe로 분리한다.

- **통합**: `file-upload-item` recipe 안에 remove button slot (항상 item 안에서만 사용)
- **분리**: `checkbox` recipe와 `checkmark` recipe (checkmark은 다른 컴포넌트에서도 사용)

### 5. 내부 helper slot과 공개 slot을 구분한다

애니메이션, padding 분리, layout 보정 때문에 필요한 helper slot은 구현에 필요할 수 있지만, 공개 API에 반드시 노출되어야 하는 것은 아니다.

- **공개 기본값**: 사용자가 의미를 이해할 수 있는 slot만 export
- **비공개 기본값**: animation wrapper, padding wrapper, measurement wrapper 같은 implementation helper slot
- **예외 허용**: consumer가 직접 조합하거나 스타일링해야 하는 명확한 사용 사례가 있을 때만 공개

`contentInner`, `layoutWrapper` 같은 helper slot을 export하려면 "왜 사용자에게 이 레이어를 알아야 하는가?"를 먼저 설명할 수 있어야 한다.

### 6. Prop 이름 충돌을 의식적으로 처리한다

Snippet convenience prop이 underlying primitive/native prop과 이름이 겹치면 interface/type surface를 의식적으로 설계한다.

- `title`, `size`, `color`, `prefix` 같은 이름은 native HTML attribute나 기존 slot prop과 충돌하기 쉽다
- 충돌 가능성이 보이면 먼저 `Omit<...>`으로 제외하거나 prop 이름을 바꾼다
- `interface extends`가 충돌 때문에 막히면 type alias를 쓰거나, 반대로 union이 필요 없으면 interface로 평평하게 유지한다

핵심은 "편한 이름을 먼저 쓴다"가 아니라, consumer가 보는 타입 surface와 실제 런타임 contract가 정확히 맞아야 한다는 점이다.
구체적인 snippet 타입 작성 예시는 `implementation-steps.md`의 Snippet 파일 작성 패턴을 기준으로 삼는다.

### 7. Mode API는 확장 가능성이 분명할 때만 enum으로 만든다

모드가 사실상 on/off라면 enum 문자열보다 boolean prop을 우선한다.

- **boolean 우선**: `multiple?: boolean`처럼 한 가지 capability를 켜고 끄는 경우
- **enum 허용**: `orientation: "horizontal" | "vertical"`처럼 값들이 대등하거나, 제3의 상태가 이미 명확한 경우
- **나쁜 신호**: `"single" | "multiple"`처럼 한 값이 기본 상태를 다시 이름 붙인 형태이고 추가 상태 계획이 없는 경우

외부 레퍼런스가 enum을 쓰더라도 그대로 따르지 않는다. SEED Design의 snippet/headless surface에서 사용자가 실제로 선택해야 하는 개념이 무엇인지 먼저 정한다.

### 8. 특정 mode에서만 유효한 prop은 타입으로 차단한다

특정 mode에서 의미 없는 prop을 런타임에서 조용히 무시하지 않는다. 타입, 문서, 테스트가 같은 contract를 설명해야 한다.

```typescript
type ComponentProps =
  | { multiple?: false; collapsible?: boolean }
  | { multiple: true; collapsible?: never };
```

- 타입: discriminated union으로 불가능한 조합을 막는다
- 문서: prop이 어느 mode에서만 유효한지 명시한다
- 테스트: 허용/불허 타입 예시와 런타임 동작을 함께 확인한다

런타임 fallback이 필요하더라도 public API에서 "넣어도 되지만 무시됨"이라는 상태를 만들지 않는다.

### 9. Affix prop은 content contract 기준으로 정한다

`prefix`, `suffix`, `prefixIcon`, `prefixAvatar` 같은 affix API는 recipe token 이름이 아니라 사용자에게 열어줄 content 종류를 기준으로 정한다.

- broad content가 필요하면 `prefix`/`suffix`처럼 generic content slot을 우선한다
- icon-only contract가 명확하면 `prefixIcon`/`suffixIcon`처럼 icon 전용 prop을 둔다
- avatar, thumbnail, control처럼 별도 semantic content kind가 명확하면 전용 prop이나 전용 slot으로 분리할 수 있다
- 같은 위치에 `prefix`와 `prefixIcon`을 동시에 열면 두 prop을 함께 넣을 수 있어 API 모델이 흐려진다

`prefixIcon` token은 generic `prefix` slot 안의 icon styling을 의미할 수 있다. token 이름이 곧 snippet prop 이름이어야 하는 것은 아니다.

## [Snippet] Children composition vs convenience prop 판단 기준

둘 다 가능한 경우 아래 기준으로 결정한다:

- **convenience prop 우선**
  - snippet이 3개 이상 sub-component를 감춘다
  - `title`/`description`/`prefix`처럼 반복되는 구조가 명확하다
  - 사용자가 child 순서나 내부 마크업을 자주 바꿀 이유가 적다
- **children composition 유지**
  - rich content가 핵심 사용 사례다
  - child 순서/구조를 consumer가 자주 제어해야 한다
  - snippet이 low-level composition wrapper라는 목적이 문서로 명확하다

## Snippet 작성 패턴

```typescript
"use client";

import * as React from "react";
import * as SeedComponent from "@seed-design/react/components/Component";

/**
 * @see https://seed-design.pages.dev/react/components/component
 */
export interface ComponentProps extends Omit<SeedComponent.RootProps, "children"> {
  // 편의 props (label, description 등)
}

export const Component = React.forwardRef<HTMLElement, ComponentProps>(
  ({ label, description, ...props }, ref) => {
    return (
      <SeedComponent.Root ref={ref} {...props}>
        {label && <SeedComponent.Label>{label}</SeedComponent.Label>}
        {description && <SeedComponent.Description>{description}</SeedComponent.Description>}
      </SeedComponent.Root>
    );
  },
);

Component.displayName = "Component";
```

Snippet이 convenience wrapper라면, 이 패턴에서 `children`을 그대로 열어두기보다 사용자 의미가 분명한 prop을 먼저 정의한다. Low-level composition을 유지해야 하는 경우에는 `children`을 열어두되, 문서에서 그 이유와 권장 composition을 함께 설명한다.

로직 없는 root wrapper는 만들지 않는다. `children`을 받아 underlying `Root`에 그대로 넘기기만 한다면 `export const ComponentRoot = SeedComponent.Root`처럼 re-export를 우선한다. 반대로 `Content`처럼 title/description, 자동 close button, accessibility warning 등 convenience 조합 책임이 있으면 wrapper를 유지한다.

accessibility warning과 fallback 렌더링은 별개의 선택이다. `aria-label` 또는 `aria-labelledby`가 underlying content에 그대로 전달된다면, convenience wrapper가 임의의 hidden label/title을 대신 렌더하지 않는다. hidden fallback을 만들기 전에 실제 DOM/ARIA 연결이 필요한지, consumer가 제공한 aria prop과 충돌하지 않는지 확인한다.

responsive/adaptive Root wrapper가 서로 다른 underlying component를 조건부 렌더링할 때는 한쪽 Root props 전체를 양쪽에 spread하지 않는다. wrapper가 open state를 소유하면 `children`, `open`, `defaultOpen`, `onOpenChange`는 top-level에서 직접 정의하고, `sidePanelRootProps`, `bottomSheetRootProps`처럼 대상 component가 드러나는 prop bag에서 이 state props를 `Omit`한다. top-level `onOpenChange`를 boolean-only API로 설계하는 경우 underlying component의 change details는 의도적으로 추상화한 contract로 본다. details를 함께 노출해야 한다면 top-level callback 타입에서 명시적으로 설계하고, bag-level `onOpenChange`와 동시에 열지 않는다.

## [Snippet] Export naming

Snippet의 최상위 export 이름은 사용자가 설치 후 import하는 이름이므로 underlying React primitive 이름을 그대로 따라가지 않는다.

- convenience wrapper는 `Component`를 우선한다. 내부에서 `SeedComponent.Root`를 쓰더라도 사용자-facing 이름에 `Root`를 붙이지 않는다.
- low-level composition wrapper라는 목적이 분명하고 sub-component를 함께 노출해야 할 때만 `ComponentRoot`를 사용한다.
- 같은 snippet 안에서 `Component`와 `ComponentRoot`를 동시에 둘 필요가 있으면, `Component`는 가장 짧은 기본 사용 경로, `ComponentRoot`는 escape hatch 역할이어야 한다.
- `displayName`은 exported symbol과 맞춘다. namespace가 실제 runtime API가 아니면 dotted name보다 flat name을 우선한다.

## Registry 등록

Registry 등록 절차는 `implementation-steps.md`의 Registry UI 단계가 기준이다. API 설계 단계에서는 snippet이 stable user API인지, 설치 후 사용자가 작성할 최소 코드가 무엇인지, version/dependency metadata에 영향을 주는 public surface가 있는지만 결정한다.

- React registry: `docs/registry/react/registry-ui.ts`
- Lynx registry: `docs/registry/lynx/registry-ui.ts`
- Lynx snippet dependency range에는 `@seed-design/lynx-react`와 `@seed-design/lynx-css`가 포함되어야 한다.

## Block 패턴

preset 조합이 필요한 컴포넌트(Footer 등)에서 block을 제공한다.

- **네이밍**: zero-padded 번호 (`footer-01`, `footer-02`, `footer-03`)
- **위치**: `docs/registry/block/{name}-{number}.tsx`
- **역할**: 실제 사용 시나리오를 보여주는 완성된 UI 조합
- **아이콘**: block 전용 아이콘은 `docs/registry/icon/`에 등록

block은 단순한 variant 쇼케이스가 아니라, 실제 사용 패턴(legal links, contact info, SNS links 등)을 보여줘야 한다.

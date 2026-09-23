# Recipe 작성 패턴

React Web recipe(`packages/qvism-preset/src/recipes/`)를 쓰거나 고치기 전에 읽는다.

1. `packages/qvism-preset/AGENTS.md`를 읽는다. `engaged` 우선 규칙, 토큰 참조 형식, 상태 선택자 통일, arbitrary content slot, `defineRecipe` ↔ `defineSlotRecipe` 차이는 그곳이 원천이다.
2. [pattern-catalog.md](pattern-catalog.md)에서 같은 카테고리의 레퍼런스 recipe를 연다.
3. 아래에서 필요한 절만 읽는다.
4. recipe를 고친 뒤 루트 `AGENTS.md`「생성」의 해당 명령을 실행한다. Rootage YAML도 바꿨으면 Rootage 명령부터 실행한다.

- target platform이 `lynx`이거나 `cross-platform`의 Lynx 구현 → 이 문서는 token vocabulary 비교에만 쓰고 [lynx-patterns.md](lynx-patterns.md)와 `packages/lynx-qvism-preset/AGENTS.md`를 따른다.
- 새 recipe를 추가한다 → `packages/qvism-preset/src/recipes.ts`에 import·등록한다.

## Token 경로 컨벤션

형식은 `packages/qvism-preset/AGENTS.md`의 `vars.{variant}.{state}.{slot}.{property}`다. 예: `vars.variantBrandSolid.enabled.root.color`, `vars.base.disabled.label.color`.

- variant 자리: `base`, `variantBrandSolid`, `variantNeutralWeak`, `toneNeutral`, `sizeLarge`, `sizeMedium` 등
- state 자리: `enabled`, `disabled`, `pressed`, `selected`, `loading`

## Fraction token 변환

viewport·부모 크기 대비 비율은 Rootage에 `0.8` 같은 `number` token으로 두고 recipe에서 단위로 바꾼다. 예: `packages/rootage/components/dialog.yaml`의 `widthFraction`.

- recipe에 `80vw`, `80%` 같은 디자인 값을 직접 쓰지 않는다 → token을 `calc()`로 변환한다.
- viewport 기준 → `calc(${vars.base.enabled.content.widthFraction} * 100vw)`
- 부모 기준 → `calc(${vars.base.enabled.content.widthFraction} * 100%)`
- token 이름은 의미와 대상을 드러낸다: `widthFraction`, `heightFraction`

## Vocabulary 선택

- outline, frame, divider처럼 선을 그리는 의미가 핵심이다 → `strokeColor`·`strokeWidth`
- CSS border semantics를 공개 계약으로 드러내야 하거나 기존 컴포넌트 vocabulary와 맞춰야 한다 → `border*`
- 새 컴포넌트에서 둘 다 가능하다 → `stroke*`. 현재 `packages/rootage/components/*.yaml`의 선 토큰은 `strokeColor`·`strokeWidth`뿐이다.

## Pseudo 선택자

상태 스타일은 `pseudo()`와 `packages/qvism-preset/src/utils/pseudo.ts`의 상수로 쓴다. 전체 목록과 실제 선택자는 그 파일에 있다.

- raw `:hover`, `:disabled`, `[data-disabled]`를 직접 쓰지 않는다 → `pseudo(disabled)` 같은 상수를 쓴다. 상수가 native 속성과 headless `data-*`를 함께 잡는다.
- hover·press 피드백 → `engaged`. `active`를 쓰는 좁은 경우는 `packages/qvism-preset/AGENTS.md`를 따른다.
- 조합 → `[pseudo(disabled, "::placeholder")]`, 부정 → `[pseudo(not(open))]`

## Focus Ring

인터랙티브 컴포넌트에는 focus ring을 넣는다. 헬퍼는 `packages/qvism-preset/src/utils/focus-ring.ts`에 있다.

```typescript
base: {
  ...createFocusRingRestStyles(),                  // 평소: 투명 outline
  [pseudo(focusVisible)]: createFocusRingStyles(), // 포커스: 보이는 outline
  transition: `background-color ${duration} ${timingFunction}, ${FOCUS_RING_TRANSITION}`,
}
```

다른 `transition`을 쓸 때도 `FOCUS_RING_TRANSITION`을 함께 넣는다. 빠지면 outline이 전환 없이 바뀐다.

## 아이콘 헬퍼

아이콘 slot의 크기·색상은 `packages/qvism-preset/src/utils/icon.ts`의 헬퍼가 CSS custom property로 넘긴다.

```typescript
import { prefixIcon, suffixIcon, onlyIcon } from "../utils/icon";

...prefixIcon({
  size: vars.sizeMedium.enabled.prefixIcon.size,
  color: vars.variantBrandSolid.enabled.prefixIcon.color,
})
```

- `prefixIcon()` → `--seed-prefix-icon-*`, `suffixIcon()` → `--seed-suffix-icon-*`, `onlyIcon()` → `--seed-icon-*`
- `--seed-icon-*`는 SEED `Icon` 컴포넌트만 소비한다. 예제에서 raw SVG나 외부 아이콘을 그대로 넣지 않는다 → `<Icon svg={...} />`로 감싼다.

slot 이름과 token은 공개 content 계약을 따른다.

- 앞 슬롯이 아이콘 전용으로 확정됐다 → `prefixIcon` slot과 `size` token을 만든다. "앞에 아이콘이 올 수 있다"만으로는 만들지 않는다.
- 공개 API가 generic `prefix`다 → `prefix` slot을 두고, 안에 든 SEED `Icon`에만 크기·색상을 적용할 수 있다(`list-item.ts` 참조).
- 아이콘과 avatar를 모두 받는다 → 색상만 제어하고 크기는 강제하지 않는다.

## Overlay Close Button 위치와 터치 영역

Dialog, Drawer, Sheet류 close button은 visual root·icon 위치와 touch target 크기를 따로 다룬다. 레퍼런스: `packages/qvism-preset/src/recipes/bottom-sheet.ts`, `packages/rootage/components/bottom-sheet.yaml`(위치), `packages/rootage/components/bottom-sheet-close-button.yaml`(`size`·`targetSize`).

1. 위치 토큰(`fromTop`, `fromRight` 등)을 더하거나 고치기 전에 레퍼런스가 그 토큰을 visual root 기준으로 쓰는지 touch target 기준으로 쓰는지 확인한다.
2. 크기가 다르면 `root.size`는 visual root, `root.targetSize`는 터치 영역으로 둔다.
3. 터치 영역은 recipe의 `::after`에 `calc((root.size - root.targetSize) / 2)` inset으로 넓힌다.

- Figma가 아이콘 기준 좌표를 준다 → 보정값을 `fromTop`·`fromRight`에 넣지 않는다. 토큰은 visual root 좌표를 표현하고, 보정은 `targetSize` + `::after`가 맡는다.
- header·title이 터치 영역과 겹칠 수 있다 → padding 보정을 `root.targetSize` 기준으로 잡는다.
- visual root가 투명한 icon-only 버튼이고 디자인에 배경이 없다 → 피드백용 배경 면을 새로 만들지 않는다. `pressed.icon.color` 같은 icon state token으로 `--seed-icon-color`를 바꾸고 semantic fg token(예: `$color.fg.neutral`)을 우선한다.
- icon color에 transition이 필요하다 → duration·timing token을 `icon` slot 아래에 두고 `.seed-icon`의 `color` transition을 지정한다.

## 애니메이션 패턴

### 색상 전환

```typescript
transition: `background-color ${vars.base.enabled.root.colorDuration} ${vars.base.enabled.root.colorTimingFunction}, ${FOCUS_RING_TRANSITION}`
```

### Expand/Collapse

height를 애니메이션하는 요소에 padding을 두지 않는다 → padding은 안쪽 요소로 옮긴다. padding이 height 요소에 있으면 접을 때 padding이 먼저 사라져 끊겨 보인다.

- height 요소 → `overflow: hidden`, `height` transition, 열림 상태에서 `height: var(--collapsible-content-height)`. 예: `packages/qvism-preset/src/recipes/accordion.ts`의 `content`(padding 없음). 변수는 headless `useCollapsible`이 설정한다.
- 안쪽 요소 → 내용의 padding·layout을 맡는다. 예: `packages/lynx-qvism-preset/src/recipes/accordion.ts`의 `contentInner`

`contentInner` 같은 helper slot이 필요하다는 것과 공개 export로 올릴지는 따로 판단한다. 공개 기준은 `packages/react/src/components/AGENTS.md`를 따른다.

### Modal/Sheet 진입/퇴장

`packages/qvism-preset/src/utils/animation.ts`의 `enterAnimation`·`exitAnimation`을 쓴다. 레퍼런스: `dialog.ts`, `action-sheet.ts`, `menu-sheet.ts`.

```typescript
[pseudo(open)]: enterAnimation({
  timingFunction: vars.base.enabled.backdrop.enterTimingFunction,
  duration: vars.base.enabled.backdrop.enterDuration,
  opacity: vars.base.enabled.backdrop.enterOpacity,
}),
[pseudo(not(open))]: exitAnimation({ ... }),
```

같은 파일의 `createPresence(enterConfig, exitConfig)`는 현재 어느 recipe도 쓰지 않는다.

## Compound Variants

variant × tone, variant × size 조합에 특수 스타일이 있을 때 `compoundVariants`를 쓴다. 레퍼런스: `badge.ts`, `text-input.ts`, `chip.ts`, `page-banner.ts`.

## Arbitrary Content Slot

임의 content를 받는 slot의 구조 강제 금지 규칙은 `packages/qvism-preset/AGENTS.md`에 있다. content 계약이 느슨할수록 recipe는 구조보다 typography·color 같은 표현에 집중한다.

## defineRecipe vs defineSlotRecipe 전환 주의

전환하면 생성 CSS 클래스가 `.seed-{name}`에서 `.seed-{name}__{slot}`으로 바뀐다.

1. `packages/rootage/components/<name>.yaml`의 slot 정의를 확인한다.
2. recipe 파일을 바꾼다.
3. `packages/qvism-preset/src/recipes.ts` 등록을 확인한다.
4. 루트 `AGENTS.md`「생성」의 해당 명령을 실행한다.
5. React 컴포넌트의 recipe import와 slot 사용을 바꾼다.

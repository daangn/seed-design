# packages/lynx-qvism-preset

Lynx 전용 qvism preset(private)이다. Rootage가 생성한 `src/vars/`와 Lynx Recipe로 `packages/lynx-css/` 산출물을 만든다. 웹 preset(`packages/qvism-preset`)과 따로 유지한다.

## 검증

- `bun test packages/lynx-qvism-preset`. 테스트는 패키지 루트의 `*.test.ts`에 있다.
- `bun --filter @seed-design/lynx-qvism-preset typecheck`
- Recipe 변경 → `bun qvism:generate` 후 `git diff packages/lynx-css/recipes/`로 의도한 CSS만 바뀌었는지 본다.

## 작업 절차

새 Recipe를 추가할 때:

1. `src/recipes/<kebab-case 이름>.ts`에 `src/utils/define.ts`의 `defineRecipe` 또는 `defineSlotRecipe`로 정의한다.
2. `src/recipes.ts`에 등록한다. 등록하지 않으면 `packages/lynx-css/recipes/`에 생성되지 않는다.
3. `bun qvism:generate`를 실행한다.

## 규칙

### 허용하지 않는 style

`define.ts`의 strict style type이 Lynx가 지원하지 않는 입력을 막는다. 타입 캐스트로 우회하지 않고 아래처럼 바꾼다.

- `boxSizing`, `verticalAlign`, SVG `stroke*`·`fill` 계열, `content`, CSS-wide keyword(`initial`, `inherit`, `unset`) → 쓰지 않는다. Lynx가 지원하는 property와 명시적인 값으로 바꾼다.
- `inset`·`inset-*` shorthand → `top`·`right`·`bottom`·`left` longhand로 쓴다. `src/index.ts`의 Lightning CSS `include: Features.LogicalProperties`가 최종 CSS에서도 longhand를 유지한다.

### 상태와 slot

- 상태 → 기본적으로 boolean·string variant로 모델링한다.
- Main Thread에서 즉시 보여야 하는 pressed 시각 피드백 → `:active`를 쓸 수 있다. 이때 enabled·interactive variant class로 disabled·loading 상태를 반드시 제외한다.
- trigger와 target이 다름 → trigger의 `:active` selector가 해당 content slot class만 대상으로 하게 쓴다.
- root와 text를 나눠야 함 → qvism core에서 slot을 파생하지 않고 `defineSlotRecipe`로 slot을 명시한다.

### 웹과의 차이

- Lynx 전용 selector·theme·platform 차이 → qvism core나 PostCSS 후처리에 넣지 않고 이 preset에서 class selector와 명시적인 fallback 값으로 해결한다.
- CSS attribute selector 후처리에 의존하지 않는다 → Lynx에서 쓸 class selector를 source에 직접 쓴다.

# packages/qvism-preset

## 디렉토리 개요

**CSS Recipe를 정의**하는 패키지. `rootage`에서 생성된 토큰(`src/vars/`)을 사용하여 컴포넌트별 스타일을 정의한다. `bun qvism:generate`로 `css/recipes`에 CSS를 생성한다.

## 파일 작성 컨벤션

- 레시피 소스, 생성 토큰, 유틸리티를 역할별로 분리한다.
- 생성 토큰 영역은 직접 수정하지 않고 원천 정의를 통해 갱신한다.

## 코드 작성 컨벤션

- Recipe 이름: kebab-case (예: `action-button`)
- Pseudo 선택자: `active` (hover 대신, 모바일 우선), `disabled`, `focus`, `checked` 등
- 토큰 참조: `vars.{variant}.{state}.{slot}.{property}`

## defineRecipe vs defineSlotRecipe

| 기준 | `defineRecipe` | `defineSlotRecipe` |
|------|---------------|-------------------|
| 슬롯 수 | 1개 (root만) | 2개 이상 |
| 예시 | ActionButton, Badge | Avatar, TextField, Chip |
| CSS 클래스명 | `.seed-{name}` | `.seed-{name}__{slot}` |

### defineSlotRecipe 사용법

`defineSlotRecipe`는 `name`, `slots` 배열, `base`, `variants` 등을 인자로 받는다. `base.slotName` 형태로 슬롯별 기본 스타일을 작성하고, `variants.variantName.variantValue.slotName` 형태로 슬롯별 variants를 적용한다.

### ⚠️ defineRecipe ↔ defineSlotRecipe 전환 시 주의사항

1. **반드시 `bun generate:all` 실행**: Recipe 타입을 변경한 후 generate를 실행하지 않으면 CSS와 소스가 불일치해 빌드가 깨집니다.
2. **CSS 클래스명 패턴이 변경됨**: `defineRecipe`의 `.seed-{name}` → `defineSlotRecipe`의 `.seed-{name}__root`로 변경되므로 React 컴포넌트에서 사용하는 import도 업데이트 필요.
3. **올바른 순서**: Recipe 수정 → `bun generate:all` → React 코드 수정

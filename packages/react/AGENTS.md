# packages/react

## 디렉토리 개요

**스타일이 적용된 React 컴포넌트**를 제공하는 패키지. `css` 패키지의 Recipe와 `react-headless` 패키지의 로직을 통합한다.

## 파일 작성 컨벤션

- `src/components/{ComponentName}/`: 컴포넌트별 디렉토리 (PascalCase)
- `src/components/{ComponentName}/{ComponentName}.tsx`: 메인 컴포넌트
- `src/components/{ComponentName}/index.ts`: barrel export

## 코드 작성 컨벤션

- `forwardRef` + `displayName` 필수
- Recipe는 `@seed-design/css/recipes/`에서 import
- Headless 로직은 `@seed-design/react-*`에서 import
- `clsx`로 className 병합
- HTML 요소 대신 `Primitive.*` 사용
- compound component의 경우 Root 컴포넌트가 context를 포함해야 하고 하위 컴포넌트가 상위 context에서 제공하는 값을 바탕으로 동작해야 하므로 `createSlotRecipeContext`가 제공하는 도구를 적극적으로 활용한다.

## 코드 스타일

모든 컴포넌트는 반드시 `forwardRef`로 감싸고 `displayName`을 설정해야 한다. HTML 요소 대신 `Primitive.*`을 사용하고, Recipe 함수 호출 결과를 `clsx`로 className에 병합한다.

## SlotRecipe 사용 패턴

복합 컴포넌트(슬롯이 여러 개인 경우)는 `createSlotRecipeContext`를 사용한다.

### import 경로

`createSlotRecipeContext`는 반드시 `../../utils/createSlotRecipeContext` 상대 경로로 import한다. `@seed-design/react-utils` 같은 패키지는 존재하지 않는다.

### createSlotRecipeContext 호출 방법

`createSlotRecipeContext`에는 slotRecipe 함수를 직접 전달한다. 객체로 감싸면 타입 불일치가 발생한다.

### withContext 슬롯 연결

각 슬롯 컴포넌트는 `withContext`의 두 번째 인자로 해당 슬롯 이름(예: `"fallback"`)을 지정하여 자동으로 슬롯 className이 적용되게 한다.

### 절대 금지: React 레이어에 style prop 직접 작성

스타일은 반드시 qvism-preset recipe를 통해 className으로 적용해야 한다. style prop을 직접 사용하면 테마, 다크모드, CSS 변수 활용이 불가능하고 스타일 관리가 분산된다. 해당 슬롯의 스타일은 qvism-preset recipe의 `base.slotName`에 작성하고, `withContext`로 연결한다.

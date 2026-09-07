# packages/react

## 디렉터리 개요

스타일이 적용된 React 컴포넌트를 제공하는 패키지다. `css` 패키지의 Recipe와 `react-headless` 패키지의 로직을 통합한다.

## 파일 작성 컨벤션

- `src/components/{ComponentName}/`처럼 컴포넌트별 `PascalCase` 디렉터리를 사용한다.
- 단일 컴포넌트는 `{ComponentName}.tsx`와 `index.ts`를 기본으로 둔다.
- compound component에서 public namespace가 필요할 때만 `{ComponentName}.namespace.ts`를 추가한다.

## 코드 작성 컨벤션

- 컴포넌트는 `forwardRef`로 감싸고 `displayName`을 설정한다.
- Recipe는 `@seed-design/css/recipes/`에서, headless 로직은 `@seed-design/react-*`에서 import한다.
- HTML 요소 대신 `Primitive.*`를 사용하고, Recipe 결과와 사용자 `className`은 `clsx`로 병합한다.
- variant props(`variant`, `size`, `tone` 등)는 수동 destructuring하지 않는다. `recipe.splitVariantProps(props)` 또는 `createRecipeContext`/`createSlotRecipeContext`를 사용한다.
- headless hook이 discriminated union props나 `stateProps`를 제공하면 styled wrapper도 같은 타입과 context contract를 직접 재사용한다.
- `asChild` 같은 escape hatch는 런타임 구현이 실제로 지원할 때만 공개한다.
- compound component를 변경할 때 public React surface와 `docs/registry/react/ui/` snippet surface의 관계를 확인한다.
- 공개 export는 사용자에게 의미가 있는 slot만 기본 노출한다. 내부 animation/layout helper slot은 명확한 사용 사례가 없으면 숨긴다.

### Slot Recipe

- 여러 slot을 가진 compound component는 `createSlotRecipeContext`를 사용한다.
- `createSlotRecipeContext`는 `../../utils/createSlotRecipeContext`에서 import하고, slot recipe 함수를 직접 전달한다.
- Root는 `withProvider`, 하위 slot은 `withContext`로 연결하며 두 번째 인자로 slot 이름을 지정한다.
- 스타일은 qvism Recipe의 `base`와 slot 정의로 관리한다. React 레이어에 직접 `style`을 작성하지 않는다.

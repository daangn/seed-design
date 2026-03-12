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

## 코드 스타일 예시

✅ Good:
```tsx
import { actionButton } from "@seed-design/css/recipes/action-button";
import { Primitive } from "@seed-design/react-primitive";

export const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({ variant = "brandSolid", size = "medium", className, ...props }, ref) => (
    <Primitive.button
      ref={ref}
      className={clsx(actionButton({ variant, size }), className)}
      {...props}
    />
  )
);
ActionButton.displayName = "ActionButton";
```

❌ Bad:
```tsx
// forwardRef 누락, displayName 없음, Primitive 미사용
export const ActionButton = (props) => (
  <button className={actionButton(props)} {...props} />
);
```

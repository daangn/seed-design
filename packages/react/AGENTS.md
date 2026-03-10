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

## SlotRecipe 사용 패턴

복합 컴포넌트(슬롯이 여러 개인 경우)는 `createSlotRecipeContext`를 사용합니다.

### import 경로

✅ 올바른 import:
```tsx
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
```

❌ 잘못된 import (존재하지 않는 패키지):
```tsx
import { createSlotRecipeContext } from "@seed-design/react-utils";
```

### createSlotRecipeContext 호출 방법

✅ 올바른 호출 (slotRecipe를 직접 전달):
```tsx
const { withProvider, withContext } = createSlotRecipeContext(avatar);
```

❌ 잘못된 호출 (객체로 감싸면 타입 불일치 발생):
```tsx
const { withProvider, withContext } = createSlotRecipeContext({ root: imageFrameRecipe });
```

### withContext 슬롯 연결

각 슬롯 컴포넌트는 withContext로 해당 슬롯 이름을 지정합니다:
```tsx
export const AvatarFallback = withContext<HTMLDivElement, AvatarFallbackProps>(Image.Fallback, "fallback");
```

### ⚠️ 절대 금지: React 레이어에 style prop 직접 작성

스타일은 반드시 qvism-preset recipe를 통해 className으로 적용해야 합니다.

❌ 잘못된 코드:
```tsx
<Image.Fallback ref={ref} style={{ width: "100%", height: "100%" }} {...rest}>
```

✅ 올바른 코드:
```tsx
export const ImageFrameFallback = withContext<HTMLDivElement, ImageFrameFallbackProps>(
  Image.Fallback,
  "fallback",
);
// fallback의 width/height 100%는 qvism-preset recipes/image-frame.ts의 base.fallback에 작성
```

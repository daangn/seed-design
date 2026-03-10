---
"@seed-design/react": patch
"@seed-design/css": patch
---

`ImageFrame` 컴포넌트의 내부 구조를 개선합니다.

- `imageFrameRecipe()` 직접 호출 대신 `createRecipeContext` 기반의 `withContext` 패턴을 적용합니다.
- `ImageFrameFallback` 컴포넌트를 추가합니다. `Image.Fallback`을 감싸며, fallback 콘텐츠가 이미지 프레임 전체를 채울 수 있도록 `width: 100%`, `height: 100%` 스타일을 적용합니다.

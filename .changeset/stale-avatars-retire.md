---
"@seed-design/react": major
---

(BREAKING CHANGE: `@seed-design/react/primitive`의 Headless Avatar API를 `@seed-design/react-image`로 교체해야 합니다.) Deprecated된 `@seed-design/react-avatar`의 소스와 React 의존성을 제거하고 배포를 중단합니다.

`@seed-design/react/primitive`에서 `Avatar` namespace, `AvatarRoot`, `AvatarImage`, `AvatarFallback`, `useAvatarContext`와 관련 Props·Context 타입을 제거합니다. `@seed-design/react`의 스타일이 적용된 `Avatar`는 이미 `@seed-design/react-image`를 사용하므로 그대로 동작합니다.

## 마이그레이션

```diff
- import { Avatar, useAvatarContext } from "@seed-design/react/primitive";
+ import { Image, useImageContext } from "@seed-design/react-image";
```

| 기존 | 대체 |
| --- | --- |
| `AvatarRoot` / `AvatarImage` / `AvatarFallback` | `Image.Root` / `Image.Content` / `Image.Fallback` |
| `Avatar.Root` / `Avatar.Image` / `Avatar.Fallback` | `Image.Root` / `Image.Content` / `Image.Fallback` |
| `AvatarRootProps` / `AvatarImageProps` / `AvatarFallbackProps` | `Image.RootProps` / `Image.ContentProps` / `Image.FallbackProps` |
| `useAvatarContext` / `UseAvatarContext` | `useImageContext` / `UseImageContext` |
| Context의 `getImageProps({ src })` | `getContentProps({ src, srcSet })` |

직접 import하는 프로젝트에는 `@seed-design/react-image`를 의존성으로 추가하세요. `@seed-design/react-avatar`를 직접 사용하던 프로젝트도 같은 대체 API로 옮길 수 있습니다.

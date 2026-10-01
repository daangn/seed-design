---
"@seed-design/react": major
---

(BREAKING CHANGE: `@seed-design/react/primitive`에서 가져오던 `Avatar`·`useAvatarContext` 등 headless Avatar API를 `@seed-design/react-image`의 `Image`·`useImageContext`로 교체해야 합니다.) `@seed-design/react`가 더 이상 deprecated된 `@seed-design/react-avatar`에 의존하지 않으며, `@seed-design/react-avatar`의 배포를 중단합니다.

`@seed-design/react/primitive`에서 `Avatar` namespace, `AvatarRoot`, `AvatarImage`, `AvatarFallback`, `useAvatarContext`와 관련 Props·Context 타입을 제거합니다. `@seed-design/react`의 스타일이 적용된 `Avatar`는 이미 `@seed-design/react-image`를 사용하므로 그대로 동작합니다.

**마이그레이션**

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
| Context의 `getImageProps({ src, onLoad, onError })` | `getContentProps({ src, srcSet })`와 `setSrc(src, srcSet)`, `handleLoad()`, `handleError()` |

`getImageProps`는 이미지 주소 등록과 load·error 처리를 함께 맡았지만, `getContentProps`는 `img` 요소의 props만 반환합니다. Context로 `img`를 직접 렌더한다면 `src`·`srcSet`이 바뀔 때 `setSrc(src, srcSet)`를 호출하고, `img`의 `onLoad`·`onError`에서 `handleLoad()`·`handleError()`를 호출하세요. `Image.Content`를 사용하면 이 처리가 자동으로 적용됩니다.

직접 import하는 프로젝트에는 `@seed-design/react-image`를 의존성으로 추가하세요. `@seed-design/react-avatar`를 직접 사용하던 프로젝트도 같은 대체 API로 옮기세요.

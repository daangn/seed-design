---
"@seed-design/react": major
---

deprecated된 `@seed-design/react-avatar`를 아카이브하고 `@seed-design/react/primitive`에서 제거합니다.

`Avatar` 컴포넌트는 이전부터 `@seed-design/react-image` 위에 올라가 있어 그대로 동작합니다. `@seed-design/react/primitive`에서 `useAvatar`·`AvatarRoot`·`AvatarImage`·`AvatarFallback`을 직접 가져다 쓰던 경우에만 영향이 있습니다.

## 마이그레이션

```diff
- import { useAvatar, AvatarRoot, AvatarImage, AvatarFallback } from "@seed-design/react/primitive";
+ import { useImage, Image } from "@seed-design/react/primitive";
```

| 기존 | 대체 |
| --- | --- |
| `useAvatar()` | `useImage()` |
| `getImageProps({ src })` | `getContentProps({ src, srcSet })` |
| `AvatarRoot` / `AvatarImage` / `AvatarFallback` | `Image.Root` / `Image.Content` / `Image.Fallback` |

스타일이 적용된 `Avatar`를 쓰고 있다면 바꿀 것이 없습니다.

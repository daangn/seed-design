# @seed-design/react-avatar

> [!WARNING]
> 이 패키지는 **deprecated**이며, **v3.0에서 `packages/archive`로 이동하고 배포를 중단합니다.**
> 새 코드에는 [`@seed-design/react-image`](../image)를 사용하세요.

`@seed-design/react`의 `Avatar` 컴포넌트는 이미 `@seed-design/react-image` 위에 올라가 있습니다.
이 패키지는 `useAvatar` 훅을 직접 쓰던 기존 사용처를 위해서만 남아 있습니다.

## 마이그레이션

| 기존 | 대체 |
| --- | --- |
| `useAvatar()` | `useImage()` |
| `getImageProps({ src })` | `getContentProps({ src, srcSet })` |
| `AvatarRoot` / `AvatarImage` / `AvatarFallback` | `Image.Root` / `Image.Content` / `Image.Fallback` |

## 유지보수 정책

동작을 바꾸는 수정은 받지 않습니다. `useImage`가 받은 수정(로딩 중 이미지를 숨기지 않아 `loading="lazy"`와 LCP가 정상 동작하는 것 등)도 이 패키지에는 반영되지 않습니다.

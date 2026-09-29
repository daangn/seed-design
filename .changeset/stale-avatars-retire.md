---
"@seed-design/react": major
---

(BREAKING CHANGE: 기존 Headless Avatar 사용 코드를 `@seed-design/react-image`로 이전해야 합니다.) Deprecated된 `@seed-design/react-avatar`의 소스를 제거하고 새 버전 배포를 중단합니다.

수정 대상은 `@seed-design/react/primitive` 또는 `@seed-design/react-avatar`에서 Avatar 컴포넌트·context hook·관련 타입을 가져와 직접 작성한 코드입니다. `@seed-design/react`의 스타일이 적용된 `Avatar`는 이미 `@seed-design/react-image`를 사용하므로 그대로 동작합니다.

## 마이그레이션

`bun add @seed-design/react-image`로 의존성을 추가하고 import를 바꾸세요. `@seed-design/react-avatar`에서 직접 가져오던 코드에도 같은 대체 API를 사용하세요.

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
| Context의 `getImageProps`로 직접 작성한 `<img>` | `Image.Content` 사용 권장 |

`getContentProps`는 이미지 속성만 반환하므로, `getImageProps`의 이름만 바꾸면 로딩 상태와 fallback이 갱신되지 않을 수 있습니다. 직접 `<img>`를 유지한다면 `refs.image`를 연결하고, `src`·`srcSet` 변경 시 effect에서 `setSrc(src, srcSet)`를 호출해야 합니다. `getContentProps({ src, srcSet })`의 반환값을 이미지에 전달하고 `onLoad`·`onError`에서 각각 `handleLoad()`·`handleError()`도 호출하세요. 기존 ref와 이벤트 처리도 함께 유지해야 합니다.

`Image.Content`를 사용하면 위 로딩 처리가 포함됩니다. 다만 로딩 중 이미지의 `hidden` 적용 방식도 달라지므로, 로딩 중 숨김에 의존한 스타일이 있다면 [React 3 업그레이드 가이드](https://seed-design.io/react/updates/upgrade/v3#headless-avatar를-사용한-경우)를 확인하세요.

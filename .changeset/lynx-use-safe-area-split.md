---
"@seed-design/lynx-react-use-safe-area": minor
---

화면 가장자리의 콘텐츠가 시스템 영역과 겹치지 않도록 inset을 읽는 `@seed-design/lynx-react-use-safe-area`를 추가합니다. `useSafeArea`는 `safeAreaInsetTop`·`safeAreaInsetRight`·`safeAreaInsetBottom`·`safeAreaInsetLeft`를 스타일에 쓸 수 있는 문자열로 반환합니다.

- host가 제공한 값은 `px` 문자열로 반환하고, 값이 없거나 유효하지 않으면 CSS `env(safe-area-inset-*)`를 반환합니다. 위·아래 inset은 host 값이 `0`이어도 `env()`를 사용합니다.

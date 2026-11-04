---
"@seed-design/lynx-react-use-safe-area": patch
"@seed-design/lynx-react": patch
---

host가 위·아래 inset을 `0`으로 제공해도 `useSafeArea`가 `env(safe-area-inset-*)`를 반환해 native가 이미 확보한 여백 위에 여백이 한 번 더 생기던 문제를 수정합니다. 이제 네 방향 모두 host가 제공한 `0` 이상의 유한한 숫자를 `px` 문자열로 반환하므로 `0`은 `"0px"`가 됩니다.

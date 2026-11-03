---
"@seed-design/lynx-react-use-safe-area": patch
"@seed-design/lynx-react-app-bar": patch
"@seed-design/lynx-react-floating": patch
"@seed-design/lynx-react-menu": patch
"@seed-design/lynx-react-popover": patch
"@seed-design/lynx-react-select": patch
---

`globalPropsMode: "event"`에서 host가 `safeAreaInset*` global props를 바꿔도 `useSafeArea`가 이전 값을 반환하던 문제를 수정합니다. 이제 `useGlobalProps()`로 값을 구독해 화면 회전이나 폴더블 기기의 inset 변경을 반영합니다.

- `useGlobalProps()`를 사용하므로 `useSafeArea`를 직접·간접으로 쓰는 headless 패키지의 `@lynx-js/react` peer dependency 하한을 `>=0.117.0`으로 올립니다. `@seed-design/lynx-react`는 이미 `>=0.117.0`을 요구합니다.

---
"@seed-design/lynx-react": patch
"@seed-design/lynx-react-use-safe-area": patch
"@seed-design/lynx-react-scale-feedback": patch
---

기본 `globalPropsMode: "reactive"`에서 SEED 컴포넌트가 렌더될 때마다 개발 빌드에 `useGlobalProps` 경고가 반복되던 문제를 수정합니다. 이제 `"event"` 모드에서만 `useGlobalProps()`로 변경을 구독하고, `"reactive"` 모드에서는 `lynx.__globalProps`를 바로 읽습니다.

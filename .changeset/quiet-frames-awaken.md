---
"@seed-design/css": patch
"@seed-design/react-image": patch
"@seed-design/react-avatar": patch
---

ImageFrame과 Avatar가 로딩 중에 이미지를 숨기지 않도록 수정합니다.

- `loading="lazy"` 이미지가 화면에 들어와도 로드되지 않던 문제를 수정합니다. 숨겨진 이미지는 레이아웃 박스가 없어 브라우저가 뷰포트 진입을 감지하지 못했고, 로드돼야 숨김이 풀리는데 숨김이 풀려야 로드되는 상태에 빠져 있었습니다.
- 이미지가 LCP 요소일 때 측정값이 이미지 도착 시각이 아니라 하이드레이션 시각으로 잡히던 문제를 수정합니다. `loading="eager"`에도 해당됩니다.
- `fallback`은 이제 이미지 뒤에 깔리며, 이미지가 디코드되는 순간 JS 개입 없이 그 위에 그려집니다. 로딩 중 플레이스홀더가 보이고 완료 시 이미지가 보이는 동작은 그대로입니다.
- 이미지를 숨기는 것은 로딩에 실패했을 때뿐입니다.
- deprecated된 `useAvatar` 훅에도 같은 수정을 적용합니다.

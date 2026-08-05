---
"@seed-design/react-image": minor
"@seed-design/css": patch
"@seed-design/react": patch
---

ImageFrame과 Avatar가 로딩 중에 이미지를 숨기지 않습니다.

- `loading="lazy"` 이미지가 화면에 들어와도 끝내 로드되지 않던 문제를 수정합니다.
- 이미지가 LCP 요소일 때 측정값이 실제 도착 시각으로 잡힙니다. `loading="eager"`에도 해당됩니다.
- `src` 없이 `srcSet`만 지정한 반응형 이미지를 지원합니다.

로딩 중 플레이스홀더가 보이고 완료 시 이미지가 보이는 동작은 그대로입니다. 다만 로딩 중에는 이미지가 화면에 남아 있으므로, 스크린리더가 플레이스홀더와 함께 이미지의 `alt`도 읽습니다.

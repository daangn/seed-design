---
"@seed-design/css": patch
"@seed-design/react": patch
---

ImageFrame과 Avatar의 이미지 로딩 수정을 1.2.x에 백포트합니다.

- `loading="lazy"` 이미지가 화면에 들어와도 로드되지 않던 문제를 수정합니다.
- 로딩 중 이미지를 숨기지 않아, eager 이미지도 하이드레이션을 기다리지 않고 표시할 수 있습니다.
- 이미 수정이 배포된 `@seed-design/react-image@1.1.0`을 사용해 `srcSet`을 유효한 이미지 소스로 처리합니다.

플레이스홀더는 이미지 뒤에 표시하며 로딩 완료 또는 오류에 따라 전환합니다. 로딩 중 스크린리더가 플레이스홀더와 함께 이미지의 `alt`도 읽을 수 있습니다.

`@seed-design/react`와 `@seed-design/css`를 함께 업데이트해야 합니다. React의 CSS 최소 요구 버전을 `1.2.19`로 올립니다.

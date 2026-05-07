---
"@seed-design/react-image": minor
"@seed-design/react": patch
"@seed-design/css": patch
---

(BREAKING CHANGE: `useImage` 훅을 직접 사용하는 경우 image 가시성 시각 처리를 styled layer에서 담당해야 합니다.) ImageFrame과 Avatar의 `loading="lazy"` 데드락을 수정합니다.

- `<ImageFrame loading="lazy">`와 `<Avatar.Image loading="lazy">`로 사용 시 이미지가 viewport에 진입해도 영구히 fetch되지 않던 문제를 해결합니다.
- `useImage` 훅은 더 이상 `<img>`에 HTML `hidden` 속성을 부여하지 않습니다. 대신 `aria-hidden`을 로드 상태에 따라 토글하여 a11y tree 처리만 담당합니다.
- `image-frame`, `avatar` recipe의 `display: none` 토글이 fallback overlay 패턴(`position: absolute` + `inset: 0`)으로 변경되어 `<img>`가 layout에 항상 존재합니다. 이로 인해 native `loading="lazy"`의 viewport intersection 측정이 정상 동작합니다.
- error 상태에서는 image에 `visibility: hidden`을 적용해 브라우저 기본 broken icon이 노출되지 않습니다.

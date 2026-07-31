---
"@seed-design/react-image": minor
"@seed-design/react-avatar": minor
"@seed-design/css": patch
"@seed-design/react": patch
---

ImageFrame과 Avatar가 로딩 중에 이미지를 숨기지 않도록 수정합니다.

- `loading="lazy"` 이미지가 화면에 들어와도 로드되지 않던 문제를 수정합니다. 숨겨진 이미지는 레이아웃 박스가 없어 브라우저가 뷰포트 진입을 감지하지 못했고, 로드돼야 숨김이 풀리는데 숨김이 풀려야 로드되는 상태에 빠져 있었습니다.
- 이미지가 LCP 요소일 때 측정값이 이미지 도착 시각이 아니라 하이드레이션 시각으로 잡히던 문제를 수정합니다. `loading="eager"`에도 해당됩니다.
- `fallback`은 이제 이미지 뒤에 깔리며, 이미지가 디코드되는 순간 JS 개입 없이 그 위에 그려집니다. 로딩 중 플레이스홀더가 보이고 완료 시 이미지가 보이는 동작은 그대로입니다.
- 이미지를 숨기는 것은 로딩에 실패했거나, 아직 로드되지 않았는데 받을 소스도 없을 때뿐입니다.
- 스크린리더가 읽는 내용은 그대로입니다. 로딩 중에는 이미지의 `alt`만 읽히고 플레이스홀더는 접근성 트리에서 빠지므로, 둘이 중복 낭독되지 않습니다.

`getContentProps`(`useImage`)와 `getImageProps`(`useAvatar`)가 `srcSet`을 받습니다. `src` 없이 `srcSet`만 지정한 반응형 이미지도 정상 동작합니다. 기존 호출부는 그대로 두어도 됩니다.

```tsx
// src 없이 srcSet만 있어도 로드되고, LCP preload도 정상 동작합니다
<ImageFrame srcSet="photo-1x.webp 1x, photo-2x.webp 2x" alt="상품 사진" loading="lazy" />
```

`@seed-design/css`의 선택자를 직접 덮어쓰고 있었다면 확인이 필요합니다. `.seed-image-frame__content` / `.seed-avatar__image`의 숨김 조건이 `:not([data-loading-state='loaded'])`에서 `[data-loading-state='error']`로 바뀌었습니다.

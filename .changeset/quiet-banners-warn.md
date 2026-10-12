---
"@seed-design/lynx-react": patch
---

`PageBanner.CloseButton`에 `accessibility-label`이 없을 때 같은 개발 경고가 렌더링마다 반복되던 문제를 수정합니다. 이제 마운트하거나 `accessibility-element`·`accessibility-label`이 바뀔 때만 누락 여부를 확인해 경고합니다.

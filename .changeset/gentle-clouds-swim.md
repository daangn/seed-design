---
"@seed-design/react-tabs": patch
---

`TabsCarousel`의 `autoHeight`와 `lazyMount`를 함께 사용할 때 lazy content 마운트 후 높이가 갱신되지 않는 문제를 수정합니다.

- Embla v8 AutoHeight 플러그인이 slide 내부 content의 높이 변화를 감지하지 못하는 알려진 이슈에 대해 `watchResize` workaround를 적용합니다.

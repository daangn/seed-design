---
"@seed-design/stackflow": patch
"@seed-design/css": patch
---

AppScreen 전환 애니메이션의 성능을 개선하고 스와이프 백 관련 버그를 수정합니다.

- 스와이프 중 CSS variable cascade로 인한 스타일 재계산 병목을 제거하고, 개별 요소에 직접 inline style을 적용하는 방식으로 변경합니다.
- 스와이프 종료 시 발생하던 플리커(CSS 핸드오프 gap)를 WAAPI(Web Animations API)로 대체하여 해결합니다.
- 스와이프 complete 후 CSS `[pop]` animation이 재트리거되는 이중 애니메이션 문제를 해결합니다.
- 제스처 중 `useState` 기반 상태 관리를 `useRef`로 변경하여 불필요한 React 리렌더를 제거합니다.
- `slideFromRightIOS`, `fadeFromBottomAndroid`, `fadeIn` 세 가지 transition style 모두 지원합니다.
- 프로덕션에서 무거운 activity를 push/pop 할 때 애니메이션이 경로 중간부터 시작되던 jank를 수정합니다. (`requestAnimationFrame` 대기 구간 제거)
- `Animation.finished`를 지원하지 않는 구형 WebView(Chrome < 84)에서 push → pop 시 화면이 비어버리던 문제를 `onfinish`/`oncancel` 기반 폴백과 setTimeout race 안전망으로 해결합니다.
- AppBar 배경을 pseudo-element에서 일반 DOM slot으로 옮겨, `pseudoElement` WAAPI 옵션을 지원하지 않는 브라우저(Chrome < 82)에서도 swipe back 중 AppBar 전환이 정상 동작하도록 합니다.

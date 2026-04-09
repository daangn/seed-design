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

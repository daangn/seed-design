---
"@seed-design/stackflow": minor
---

스와이프백 성능 및 안정성을 개선해요

- rAF 배칭으로 touchmove당 CSS var 업데이트를 프레임당 1회로 제한
- swipe-back state를 useRef + direct DOM write로 전환하여 React re-render 지연 제거
- completing/canceling 시 two-frame technique 적용으로 현재 위치에서 부드럽게 애니메이션
- completing 중 exit animation 재생 방지 (animation: none !important)
- will-change: transform, opacity로 GPU 레이어 프로모션 명시

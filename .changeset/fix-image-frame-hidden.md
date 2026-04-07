---
"@seed-design/css": patch
---

ImageFrame에서 이미지 로드 실패 시 깨진 img 요소가 fallback 위에 노출되는 버그를 수정합니다.

- content 슬롯에 `[hidden]` 규칙을 추가하여 `[hidden]` reset CSS가 없는 환경에서도 올바르게 숨겨지도록 처리합니다.

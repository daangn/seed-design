---
"@seed-design/lynx-react-page-banner": minor
"@seed-design/lynx-react": patch
---

SEED 스타일 없이 Lynx PageBanner를 조합하는 `@seed-design/lynx-react-page-banner`를 추가합니다. `open`·`defaultOpen`·`onDismiss`와 dismiss, 탭할 수 있는 Root의 눌림 상태와 접근성 기본값, Button·CloseButton의 tap 순서와 catch 기반 독립 action 격리(`getIndependentActionProps`)를 제공합니다. `@seed-design/lynx-react`의 PageBanner는 이 패키지를 사용하며, 사용법과 표현은 바뀌지 않습니다. CloseButton의 `accessibility-label` 누락 경고는 렌더마다 반복하지 않고 마운트와 조건 변경 때만 출력하며, 탭할 수 있는 Root의 native view에 쓰지 않는 `pressed` 속성을 더 이상 전달하지 않습니다.

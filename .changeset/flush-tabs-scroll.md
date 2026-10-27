---
"@seed-design/css": patch
"@seed-design/react-tabs": patch
---

`triggerLayout="fill"`인 Tabs에서 선택한 탭을 화면 안으로 스크롤할 때 16px 여유를 두지 않고 목록 끝에 맞춰 멈추도록 수정합니다. Chip Tabs와 `triggerLayout="hug"`인 Tabs는 지금처럼 목록 padding만큼 떨어져 멈춥니다.

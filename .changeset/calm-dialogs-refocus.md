---
"@seed-design/react-dialog": patch
"@seed-design/css": patch
---

`AlertDialog`, `MenuSheet` 등 Dialog 기반 컴포넌트가 열릴 때 첫 항목 대신 컨테이너에 포커스가 가도록 수정합니다.

- URL로 직접 진입해 열었을 때 첫 항목에 포커스 링이 노출되던 문제를 수정합니다.
- 스크린리더가 다이얼로그의 제목과 설명을 먼저 읽도록 초기 포커스를 컨테이너로 옮깁니다.

---
"@seed-design/lynx-react": patch
---

Switch 등 controlled 컴포넌트에서 외부 값 변경 후 변경 콜백이 누락되던 문제를 수정합니다. 부모가 변경 요청을 반영하지 않은 경우에도 다음 사용자 입력에서 변경을 다시 요청할 수 있습니다.

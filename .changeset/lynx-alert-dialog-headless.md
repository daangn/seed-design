---
"@seed-design/lynx-react": minor
---

AlertDialog가 `@seed-design/lynx-react-dialog`를 사용합니다. `AlertDialog.Content`에 넘긴 `accessibility-label` 등 접근성 속성과 `dialogContentProps`의 `bindtap` 등 native callback이 이제 전달됩니다. presence handler는 `AlertDialog.Content`의 `dialogContentProps` 타입에서, presence handler와 `bindtap`은 `AlertDialog.Backdrop`의 `dialogBackdropProps` 타입에서 제외됩니다. 기존에도 무시되던 값이므로 지워 주세요.

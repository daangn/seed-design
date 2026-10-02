---
"@seed-design/lynx-react": minor
---

Dialog가 `@seed-design/lynx-react-dialog`를 사용합니다. `Dialog.Content`의 `dialogContentProps`에 넘긴 `bindtap` 등 native callback이 이제 전달됩니다. presence handler(`bindanimationstart`·`bindanimationend`·`bindanimationcancel`·`bindtransitionstart`·`bindtransitionend`)는 `Dialog.Content`의 `dialogContentProps` 타입에서, 이 handler와 `bindtap`은 `Dialog.Backdrop`의 `dialogBackdropProps` 타입에서 제외됩니다. 기존에도 무시되던 값이므로 지우세요. 배경 탭으로 Dialog가 닫힐 때 알림을 받으려면 `Dialog.Backdrop`의 `onClick`을 쓰세요. `clickToClose`가 `false`이면 `onClick`은 호출되지 않습니다.

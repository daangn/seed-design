---
"@seed-design/lynx-react": major
---

(BREAKING CHANGE: `Dialog`와 `AlertDialog`의 `dialogContentProps`에서 `bindanimationstart`·`bindanimationend`·`bindanimationcancel`·`bindtransitionstart`·`bindtransitionend`를 제거하고, `dialogBackdropProps.bindtap`은 `Backdrop`의 `onClick`으로 옮겨야 합니다. `dialogContentProps.bindtap`이 실행되면 안 되는 사용처에서는 해당 callback을 제거해야 합니다.) `Dialog.Content`와 `AlertDialog.Content`의 `dialogContentProps`가 `bindtap` 같은 native prop을 실제 Content에 전달합니다. `AlertDialog.Content`에 직접 전달한 접근성 속성도 Content에 적용됩니다. `Backdrop.onClick`은 `clickToClose`로 Dialog가 닫힐 때만 호출됩니다.

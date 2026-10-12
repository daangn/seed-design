---
"@seed-design/lynx-react": major
---

(BREAKING CHANGE: `Dialog`와 `AlertDialog`의 `dialogContentProps`·`dialogBackdropProps`에서 `bindanimationstart`·`bindanimationend`·`bindanimationcancel`·`bindtransitionstart`·`bindtransitionend`를 제거하고, `dialogBackdropProps.bindtap`은 `Backdrop`의 `onClick`으로 옮겨야 합니다. `dialogContentProps.bindtap`이 실행되면 안 되는 사용처에서는 해당 callback을 제거해야 합니다.)

`Dialog`·`AlertDialog`의 Content 탭 callback과 `AlertDialog.Content`에 직접 전달한 접근성 속성을 실제 요소에 적용하도록 변경합니다.

- 이전에는 `dialogContentProps.bindtap` 같은 callback이 Content에서 실행되지 않았습니다. 이제 열림·닫힘 처리용으로 예약된 callback을 제외한 native prop과 callback을 전달합니다.
- `dialogContentProps`·`dialogBackdropProps`의 animation·transition callback과 Backdrop의 nested `bindtap`은 기존처럼 Dialog의 열림·닫힘 처리를 위해 예약하며, 공개 타입에서도 제외합니다.
- Backdrop의 탭 callback은 `onClick`으로 지정합니다. 이 callback은 `clickToClose`로 실제로 닫히는 탭에서만 호출됩니다.
- 이전에는 적용되지 않던 `AlertDialog.Content`의 직접 전달한 접근성 속성도 Content에 적용합니다. 같은 속성을 `dialogContentProps`에도 지정하면 nested 값이 우선합니다.

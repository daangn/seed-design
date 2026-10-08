---
"@seed-design/lynx-react": major
---

(BREAKING CHANGE: `useAttachmentInputItemContext`의 `removeButtonProps`에서 `main-thread:bindtap`을 읽는 코드는 `bindtap`을 사용하도록 변경해야 합니다. 반환 객체를 직접 구성하는 코드는 `removeButtonProps.bindtap`과, `imageProps`가 있으면 `imageProps.alt` 문자열을 제공해야 합니다.) 첨부 항목 context의 반환 타입을 변경합니다.

`removeButtonProps`는 필수 `bindtap`만 제공합니다. `AttachmentInputContextValue`를 직접 구성한다면 `acceptType`도 필수 property로 제공해야 하며, 값은 `"image"` 또는 `undefined`를 사용합니다.

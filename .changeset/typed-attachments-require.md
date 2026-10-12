---
"@seed-design/lynx-react": major
---

(BREAKING CHANGE: `useAttachmentInputItemContext`의 `removeButtonProps`에서 `main-thread:bindtap`을 읽는 코드는 `bindtap`을 사용하도록 변경해야 합니다. 반환 객체를 직접 구성한다면 `removeButtonProps.bindtap`과, `imageProps`가 있으면 `imageProps.alt` 문자열을 제공해야 합니다. `AttachmentInputContextValue`를 직접 구성한다면 `acceptType`도 `"image"` 또는 `undefined` 값으로 제공하고, property 존재 여부 대신 값을 검사해야 합니다.)

첨부 항목 context의 반환 타입에서 삭제 handler와 이미지 대체 설명, 파일 유형의 계약을 명시합니다.

- `removeButtonProps`는 optional tap handler들을 허용하던 타입에서 필수 `bindtap`만 제공하는 객체로 바뀝니다.
- `imageProps.alt`는 optional에서 필수 문자열로 바뀝니다. 이미지 미리보기가 없으면 `imageProps` 자체는 여전히 `undefined`입니다.
- `AttachmentInputContextValue.acceptType`은 optional property에서 항상 존재하는 property로 바뀌며, 값은 `"image"` 또는 `undefined`입니다.

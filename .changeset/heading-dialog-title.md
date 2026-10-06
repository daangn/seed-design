---
"@seed-design/lynx-react-dialog": minor
"@seed-design/lynx-react": minor
---

Dialog·AlertDialog의 Title이 기본으로 `accessibility-heading`을 켜서 스크린 리더가 제목으로 읽습니다. 이전에는 `AlertDialog.Title`만 heading이었고 `Dialog.Title`과 Headless `DialogTitle`은 아니었습니다. 제목으로 읽히지 않게 하려면 `accessibility-heading={false}`를 넘기세요.

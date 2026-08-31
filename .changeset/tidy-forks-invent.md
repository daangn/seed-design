---
"@seed-design/css": patch
---

숨겨진 폼 요소가 컴포넌트 밖으로 빠져나가 스크롤을 만드는 문제를 수정합니다.

`field`와 `attachment-input`의 root에 `position: relative`를 지정합니다. 이전에는 Select의 native `<select>`와 AttachmentField의 `<input type="file">`이 컴포넌트 바깥의 positioned 조상을 기준으로 배치되어, 자체 스크롤 영역을 가진 페이지에서 바깥 컨테이너에 불필요한 스크롤이 생겼습니다.

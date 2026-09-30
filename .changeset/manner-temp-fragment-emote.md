---
"@seed-design/lynx-react": patch
---

`MannerTemp`의 children에서 Fragment로 감싼 `MannerTempEmote`가 label 안에 inline 이미지로 렌더링되던 문제를 수정합니다. Fragment 안의 `MannerTempEmote`도 label 뒤 emote 이미지로 표시됩니다.

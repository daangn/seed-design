---
"@seed-design/lynx-react": patch
---

`AttachmentDisplay`에서 같은 위치로 `reorderEntry`를 호출하거나 추가할 자리가 없을 때 `addEntries`를 호출하면 목록이 그대로인데도 `onEntriesChange`가 호출되던 문제를 수정합니다.

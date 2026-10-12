---
"@seed-design/lynx-react": patch
---

`AttachmentDisplay`에서 같은 위치로 `reorderEntry`를 호출하거나 여러 항목을 허용하는 목록이 가득 찬 상태에서 `addEntries`를 호출하면, 목록이 그대로인데도 `onEntriesChange`가 호출되던 문제를 수정합니다. 이제 이 경우에는 목록을 유지하고 `onEntriesChange`를 호출하지 않습니다.

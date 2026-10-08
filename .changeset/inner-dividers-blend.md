---
"@seed-design/lynx-css": major
"@seed-design/lynx-react": patch
---

(BREAKING CHANGE: `MenuSheet.Item`을 직접 조합한다면 `menuSheetItem().divider` 요소를 `menuSheetItem().root` 요소의 다음 형제에서 마지막 자식으로 옮겨야 합니다.) `MenuSheet` 구분선이 각 Item의 안쪽 하단에 겹쳐 표시되어 Item 배경과 올바른 대비를 유지합니다.

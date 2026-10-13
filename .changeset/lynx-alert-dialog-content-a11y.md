---
"@seed-design/lynx-react": patch
---

AlertDialog.Content가 더 이상 기본으로 접근성 요소(`accessibility-element`)가 아니고 `accessibility-role-description="alertdialog"`도 적용하지 않습니다. iOS에서 열린 Alert Dialog의 제목·설명·action이 접근성 트리에서 가려지던 문제를 고칩니다. Content 자체를 하나의 요소로 노출해야 하면 `accessibility-element`를 직접 지정하세요.

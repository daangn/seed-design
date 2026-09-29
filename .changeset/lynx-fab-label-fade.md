---
"@seed-design/lynx-css": patch
"@seed-design/lynx-react": patch
---

Lynx Floating Action Button이 축소될 때 label이 한 줄 크기를 유지한 채 투명해지며 사라지고, 확장될 때 다시 나타납니다. `extended={false}`에서도 label은 접근성 트리에서 숨겨진 채 렌더링되어 버튼 폭 전환 동안 줄바꿈되지 않고 잘려 보입니다.

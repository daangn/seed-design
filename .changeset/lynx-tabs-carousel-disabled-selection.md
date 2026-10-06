---
"@seed-design/lynx-react": patch
---

Lynx Tabs·ChipTabs의 Carousel에 비활성화된 Trigger가 있으면 처음 표시될 때 선택이 첫 탭으로 바뀌고 `onValueChange`가 호출되던 문제를 수정합니다. 이제 사용자가 스와이프한 경우에만 선택이 바뀌며, 탭이 추가·제거되거나 비활성화 상태가 바뀌어도 선택한 탭의 콘텐츠를 유지합니다.

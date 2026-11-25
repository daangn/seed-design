---
"@seed-design/lynx-react-tabs": patch
"@seed-design/lynx-react": patch
---

Lynx `Tabs`를 스와이프할 때 Indicator가 손가락을 따라오지 못하고 페이지가 넘어간 뒤에야 이동하던 문제를 수정합니다. 이제 pager가 페이지 사이에 있는 동안에는 Indicator transition을 끄고 스와이프 위치를 바로 반영하며, 페이지에 닿으면 기존 transition으로 돌아갑니다. Trigger를 눌러 이동할 때의 transition은 그대로입니다.

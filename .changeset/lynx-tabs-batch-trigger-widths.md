---
"@seed-design/lynx-react-tabs": patch
---

Tabs·ChipTabs가 처음 표시될 때 trigger마다 폭 측정을 따로 반영해 trigger 수만큼 Main Thread commit을 보내던 문제를 수정합니다. 모든 trigger가 측정되기 전에는 선택·표시 중인 trigger까지의 폭이 바뀔 때만 `triggerRects`에 반영하고, 측정이 끝나면 남은 폭을 한 번에 반영합니다. 측정이 끝난 뒤의 폭 변경은 이전처럼 바로 반영합니다.

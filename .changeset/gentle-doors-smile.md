---
"@seed-design/cli": patch
---

`docs` 명령어에서 경로를 잘못 입력했을 때 유사한 항목을 제안합니다.

- 오타가 포함된 경로를 입력하면 가장 가까운 유효 경로를 알려줍니다. (예: `react/component/action-buton` → `react/components/action-button`)
- 카테고리, 섹션, 아이템 각 단계에서 유사 후보를 자동 검색합니다.

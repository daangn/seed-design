---
"@seed-design/lynx-react": minor
---

variant props context 유틸 `createRecipeContext`(단일 슬롯)와 `createSlotRecipeContext`(복합 슬롯)를 추가했어요. 두 유틸은 Lynx 런타임 제약(children 분리, ref null 가드)을 반영해 포팅되었고, ActionButton 내부가 `createSlotRecipeContext` 기반으로 리팩토링되었습니다. 공개 API는 동일해요.

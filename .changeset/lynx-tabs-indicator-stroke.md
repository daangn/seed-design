---
"@seed-design/lynx-css": patch
---

Lynx `Tabs.Indicator`가 하단 stroke 위에 떠 있던 문제를 수정하여 stroke와 겹치도록 1px 아래에 배치합니다. 이를 보정하려고 지정한 `bottom: -1px`은 제거해야 합니다.

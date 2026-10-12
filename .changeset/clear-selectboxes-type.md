---
"@seed-design/lynx-react": major
---

(BREAKING CHANGE: `SelectBoxGroupProps`를 `CheckSelectBox.GroupProps` 또는 `RadioSelectBox.GroupProps`로, `SelectBoxFooterProps`를 `CheckSelectBox.FooterProps` 또는 `RadioSelectBox.FooterProps`로 변경해야 합니다.)

이전에 공통으로 제공하던 `SelectBoxGroupProps`·`SelectBoxFooterProps` export를 제거하고, `CheckSelectBox`·`RadioSelectBox`별 `GroupProps`·`FooterProps`를 제공합니다.

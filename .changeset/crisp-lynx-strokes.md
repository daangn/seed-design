---
"@seed-design/lynx-css": patch
"@seed-design/lynx-react": patch
---

iOS에서 테두리가 흐리게 보이고 코너 모양이 상태마다 달라지던 문제를 수정합니다. `SelectBox`, `SegmentedControl`, `Accordion`(separated), `QuantityPicker`, `Tabs`, `Avatar`, `AvatarStack`, `AttachmentInput`의 테두리를 inset `box-shadow` 대신 `border`로 그립니다.

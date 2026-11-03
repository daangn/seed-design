---
"@seed-design/lynx-css": patch
---

iOS에서 테두리가 흐리게 보이고 코너 모양이 상태마다 달라지던 문제를 수정합니다. `SelectBox`, `SegmentedControl`, `Accordion`(separated), `Tabs`, `Avatar`, `AvatarStack`, `AttachmentInput`의 테두리를 inset `box-shadow` 대신 `border`로 그리고, 테두리 두께만큼 padding·margin을 보정해 기존 크기와 콘텐츠 배치를 유지합니다.

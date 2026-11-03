---
"@seed-design/lynx-css": minor
"@seed-design/lynx-react": patch
---

iOS에서 테두리가 흐리게 보이고 코너 모양이 상태마다 달라지던 문제를 수정합니다. `SelectBox`, `SegmentedControl`, `Accordion`(separated), `QuantityPicker`, `Tabs`, `Avatar`, `AvatarStack`, `AttachmentInput`의 테두리를 inset `box-shadow` 대신 `border`로 그리고, 테두리 두께만큼 padding·margin을 보정해 기존 크기와 콘텐츠 배치를 유지합니다.

- `@seed-design/lynx-css`의 `quantity-picker` Recipe에 `stroke` slot을 추가합니다. `QuantityPicker`는 버튼이 root와 같은 높이라 이 overlay slot으로 테두리를 그립니다.
- `@seed-design/lynx-react`의 `QuantityPicker`는 이 slot을 사용하므로 같은 버전 이상의 `@seed-design/lynx-css`가 필요합니다.

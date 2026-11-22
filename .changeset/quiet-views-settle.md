---
"@seed-design/lynx-react": patch
"@seed-design/lynx-react-app-bar": patch
"@seed-design/lynx-react-image": patch
"@seed-design/lynx-react-segmented-control": patch
"@seed-design/lynx-react-tabs": patch
---

Lynx 컴포넌트의 첫 표시와 상호작용에서 화면에 반영할 변경 없이 반복되던 렌더링과 커밋을 줄입니다.

- `Tabs`·`ChipTabs`의 초기 레이아웃, `AppBar`의 너비 측정, `SegmentedControl`의 항목 등록, `Slider`의 값 변경에서 불필요한 하위 갱신을 줄입니다.
- `Avatar`·`ImageFrame`의 이미지 로드 및 실패 상태가 중복 반영되는 문제를 수정합니다.
- `Checkbox`·`Switch`·`ReactionButton`과 `AttachmentDisplay`·`AttachmentInput`의 항목 액션에서 눌림 피드백에 중복되던 상태 갱신을 줄입니다.

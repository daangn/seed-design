---
"@seed-design/rootage-artifacts": major
---

(BREAKING CHANGE: 제거된 컴포넌트 스펙과 속성을 참조했다면 사용처를 정리해야 합니다.) SEED React 3에 맞춰 컴포넌트 스펙을 업데이트합니다.

- `popover`, `popover-close-button` 컴포넌트 스펙을 추가합니다.
- `badge` 컴포넌트 스펙에 `prefix`, `action` 부분을 추가하고, `root`의 `maxWidth` 속성을 제거합니다.
- `date-picker` 컴포넌트 스펙에 Week의 연·월 Wheel Picker를 표시하는 `wheelPopover` 부분을 추가하고, `wheelItem`의 글자 스타일 속성(`paddingX`, `fontSize`, `lineHeight`, `fontWeight`)을 제거합니다.
- deprecated 컴포넌트인 Control Chip과 Inline Banner의 `control-chip`, `inline-banner` 컴포넌트 스펙을 제거합니다.
- `dialog-close-button`, `side-panel-close-button` 컴포넌트 스펙에서 `icon`의 `colorDuration`, `colorTimingFunction` 속성을 제거합니다.

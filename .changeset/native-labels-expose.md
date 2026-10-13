---
"@seed-design/lynx-react": minor
"@seed-design/lynx-react-radio-group": minor
"@seed-design/lynx-react-quantity-picker": minor
---

iOS·Android 네이티브 접근성 트리에 컨트롤의 이름과 항목이 빠지지 않게 합니다.

- ActionButton, Chip, Checkbox, Switch, Accordion Trigger, List 행, RadioGroup·SelectBox 항목, Tabs·ChipTabs·SegmentedControl 항목이 텍스트 children으로 `accessibility-label`을 채웁니다. children에 `<text>` 같은 native 요소만 있으면 이름을 알 수 없으므로 `accessibility-label`을 직접 지정하세요(개발 환경에서 경고합니다).
- Menu·HelpBubble·Dialog·AlertDialog·MenuSheet Trigger가 접근성 요소로서 이름을 갖고, 안에 둔 ActionButton·Chip은 별도 요소로 노출하지 않습니다. Dialog·AlertDialog Trigger는 `accessibility-label`을 받습니다.
- RadioGroup·SelectBox·QuantityPicker·Chip.RadioRoot·Checkbox.Group·List Root가 기본적으로 접근성 요소가 아니어서 안쪽 항목이 가려지지 않습니다. QuantityPicker의 이름과 현재 수량은 ValueDisplay가 노출합니다.
- 접근성 요소 root에 `flatten={false}`를 기본으로 두어 Android에서 노드가 사라지지 않게 합니다.
- 컨트롤 안의 label 텍스트는 같은 이름이 두 번 읽히지 않도록 접근성 트리에서 숨깁니다.

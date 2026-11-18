---
"@seed-design/lynx-react-time-picker": major
"@seed-design/lynx-react": minor
"@seed-design/lynx-css": minor
---

Lynx에서 휠로 오전·오후, 시, 분을 선택하는 Time Picker를 추가합니다. `npx @seed-design/cli@latest add ui:time-picker`로 설치하는 Registry snippet이 Wheel Picker를 조립합니다.

- `@seed-design/lynx-react`는 시간 값과 컬럼 상태를 만드는 `useTimePicker`와 `TimePickerValue` 등 관련 타입을 공개합니다. 값은 오전·오후를 나누지 않는 24시간 형식 `{ hour, minute }`이고, `minuteStep`, `disabled`, controlled·uncontrolled 사용을 React와 같게 지원합니다.
- Lynx에는 `Intl`이 없어 `locale`은 언어 하위 태그 `ko`, `ja`, `en`만 구분합니다. 오전·오후 표기와 컬럼 순서가 언어에 따라 바뀌고, 그 밖의 locale은 `en`을 씁니다.
- 시 컬럼의 숫자를 오른쪽에 맞추는 `TimePicker.ItemLabel`과 `@seed-design/lynx-css`의 `time-picker` Recipe를 추가합니다.

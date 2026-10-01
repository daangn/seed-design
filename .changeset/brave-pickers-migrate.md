---
"@seed-design/react": major
---

(BREAKING CHANGE: Date Picker와 Time Picker를 snippet으로 설치하고 import 경로를 바꿔야 합니다.) Date Picker와 Time Picker를 애플리케이션에서 수정할 수 있는 snippet으로 전환합니다.

```sh
npx @seed-design/cli@latest add ui:date-picker ui:time-picker
```

```diff
-import { DatePicker, TimePicker } from "@seed-design/react";
+import { DatePicker } from "seed-design/ui/date-picker";
+import { TimePicker } from "seed-design/ui/time-picker";
```

- snippet은 `@seed-design/react`의 Date Picker 구성 요소를 조합해 완성된 UI를 제공하며, 컴포넌트와 컴포넌트 전용 props만 노출합니다.
- `@seed-design/react`의 `DatePicker`는 완성된 컴포넌트가 아니라 `DatePicker.Root`, `DatePicker.Header`, `DatePicker.Calendar`, `DatePicker.Wheel`로 구성된 namespace로 바뀝니다. 일반적인 사용에서는 이 구성 요소 대신 snippet을 사용하세요.
- Time Picker snippet이 사용하는 `useTimePicker`와 관련 타입을 `@seed-design/react`에서 제공합니다.
- 날짜·시간 값 타입(`DatePickerDate`, `TimePickerValue`, `MinuteStep` 등)과 제약 조건 helper(`dateOnOrAfter` 등)는 계속 `@seed-design/react`에서 가져오세요.
- Date Picker와 Time Picker snippet을 설치하면 의존 snippet인 `ui:wheel-picker`도 함께 설치됩니다.
- Week Date Picker에서 제목을 누르면, 달력 자리 대신 제목에 붙은 popover 안에 작은(`small`) Wheel Picker를 표시합니다.
- `WheelPicker.Root`에 포커스는 유지하면서 값 변경을 막는 `readOnly`와, Scroll Fog 크기를 지정하는 `scrollFogSize`를 추가합니다.

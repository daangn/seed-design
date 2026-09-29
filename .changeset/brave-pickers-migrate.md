---
"@seed-design/react": major
"@seed-design/css": major
---

(BREAKING CHANGE: Date Picker와 Time Picker를 CLI 스니펫으로 설치하고 import 경로를 변경하세요.) Date Picker와 Time Picker를 애플리케이션에서 수정할 수 있는 Snippet Registry 형식으로 전환합니다.

```sh
npx @seed-design/cli@latest add ui:date-picker ui:time-picker
```

```diff
-import { DatePicker, TimePicker } from "@seed-design/react";
+import { DatePicker } from "seed-design/ui/date-picker";
+import { TimePicker } from "seed-design/ui/time-picker";
```

Snippet은 `@seed-design/react`의 저수준 Date Picker compound components를 조합해 완성된 UI를 제공하며, 컴포넌트와 컴포넌트 전용 props만 노출합니다. 기존의 닫힌 `DatePicker` component export는 `DatePicker.Root`, `DatePicker.Header`, `DatePicker.Calendar`, `DatePicker.Wheel` compound namespace로 바뀝니다. 일반적인 사용에서는 이 저수준 API 대신 Registry snippet을 사용하세요.

날짜·시간 값 타입과 날짜 제약 helper(`DatePickerDate`, `dateOnOrAfter`, `TimePickerValue` 등)는 계속 `@seed-design/react`에서 가져올 수 있습니다. Time Picker snippet이 사용하는 `useTimePicker`와 관련 타입도 `@seed-design/react`에서 제공합니다. Date Picker와 Time Picker를 설치하면 Registry 의존성인 `ui:wheel-picker`도 함께 설치됩니다.

Wheel Picker의 공개·내부 스타일을 하나로 통합합니다. `@seed-design/css/recipes/wheel-picker-public`을 사용했다면 `@seed-design/css/recipes/wheel-picker`로 바꾸고, `seed-wheel-picker-public` 클래스와 `--seed-wheel-picker-public-*` 사용자 정의 속성에서 `public` 수식어를 제거하세요.

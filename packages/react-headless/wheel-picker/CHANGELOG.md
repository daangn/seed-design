# @seed-design/react-wheel-picker

## 1.1.0

### Minor Changes

- f441552: Wheel Picker 컴포넌트를 추가합니다.

  - `@seed-design/react`에서 `WheelPicker.Root`와 `WheelPicker.Column`을 가져와 여러 선택 열을 직접 구성할 수 있습니다.
  - 항목 높이는 44px, 표시 항목 수는 5개를 기본값으로 사용합니다.
  - 여러 열을 각 항목의 내용 너비에 맞추고, Time Picker와 같은 기준으로 가운데에 모아 배치합니다.
  - `onIndexChange`로 사용자가 지나간 각 항목을 감지해 햅틱 등을 제공할 수 있습니다.
  - 사용자 조작 중에는 외부 `value` 변경이 스크롤 위치를 덮어쓰지 않습니다.

  ```tsx
  import { WheelPicker } from "@seed-design/react";

  <WheelPicker.Root>
    <WheelPicker.Column
      aria-label="연도"
      value={year}
      onValueChange={setYear}
      onIndexChange={(index, value) => {
        // 항목별 햅틱 처리
      }}
      options={yearOptions}
    />
  </WheelPicker.Root>;
  ```

  `npx @seed-design/cli@latest add ui:wheel-picker`로 배열 기반 Registry API를 설치할 수 있습니다.

  ```tsx
  import { WheelPicker } from "seed-design/ui/wheel-picker";

  <WheelPicker aria-label="날짜 선택" columns={columns} />;
  ```

## 1.0.0

### Major Changes

- c9acaa6: Time Picker와 Date Picker에서 재사용할 수 있는 Wheel Picker 기반을 추가합니다.

  - 스크롤과 키보드로 값을 선택할 수 있는 headless Wheel Picker를 제공합니다.
  - React 컴포넌트 내부에서 Scroll Fog와 Selection Indicator를 조합할 수 있는 기반을 추가합니다.

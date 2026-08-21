# @seed-design/react-date-picker

## 1.1.0

### Minor Changes

- ebb4eae: Date Picker에서 시작일을 유지하고 종료일만 변경할 수 있는 기능을 추가합니다.

  - `selectionMode="range"`에서 `rangeStartReadOnly` prop을 사용할 수 있습니다.
  - 시작일보다 늦은 날짜만 새 종료일로 선택할 수 있습니다.
  - 읽기 전용 시작일의 시각적 상태와 접근성 이름을 제공합니다.

  ```tsx
  <DatePicker
    selectionMode="range"
    rangeStartReadOnly
    value={{
      start: { year: 2026, month: 8, day: 7 },
      end: { year: 2026, month: 8, day: 9 },
    }}
  />
  ```

## 1.0.0

### Major Changes

- c9acaa6: `DatePicker` 컴포넌트를 추가합니다.

  - Single, Range, Multiple 선택 모드를 지원합니다.
  - Month, Two Months, Week, Continuous 레이아웃을 각각 `DatePicker`, `TwoMonthDatePicker`, `WeekDatePicker`, `ContinuousDatePicker`로 제공합니다.
  - 날짜 constraints와 예약·가격 표시를 위한 `renderDateCellSupplement`, 내부 콘텐츠 전체를 교체하는 `renderDateCellContent`를 제공합니다.
  - `actionsRef`를 통해 특정 날짜로 이동하거나 날짜 셀에 포커스할 수 있습니다.
  - locale 기반 달력, 키보드·스크린 리더 접근성, Wheel Picker를 이용한 월·연도 이동을 지원합니다.

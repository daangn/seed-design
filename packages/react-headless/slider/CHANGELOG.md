# @seed-design/react-slider

## 1.0.2

### Patch Changes

- fe1cdb3: 마우스/키보드 사용 환경에서 Slider의 사용성을 개선합니다.

  - Slider `valueIndicatorTrigger`에 `"auto"` 옵션을 추가하여 마우스를 사용하는 환경에서 thumb에 hover할 때, 터치 환경에서 thumb을 누를 때 value indicator가 표시되도록 하고 `valueIndicatorTrigger` 기본값을 `"active"`에서 `"auto"`로 변경합니다.
  - Slider thumb에 focus할 때 value indicator가 표시되도록 수정합니다.

## 1.0.1

### Patch Changes

- 1340675: Slider Value Indicator가 표시되는 조건을 설정하는 `valueIndicatorTrigger` prop을 추가합니다. ("active"|"hover", 기본값: "active")
- 1340675: Slider Value Indicator가 Track 양 끝에 있을 때 Track 바깥 영역을 차지하지 않도록 수정합니다.

## 1.0.0

### Major Changes

- a55f584: Slider 컴포넌트를 추가합니다.

# @seed-design/react-slider

## 2.0.1

### Patch Changes

- 270c93d: 라이선스를 Apache-2.0으로 명시했습니다. 기존에는 `license` 필드가 비어 있어 저장소 루트의 Apache License 2.0과 일치하지 않았고, 배포물에 `LICENSE`와 `NOTICE`가 포함되지 않아 이용 조건을 확인할 수 없었습니다.

  당근 로고를 비롯한 브랜드 리소스는 별도 가이드라인을 따르며, 당근을 사칭하거나 당근 서비스와 관련이 있는 것처럼 오인하게 하는 사용은 허용되지 않습니다. 자세한 내용은 `NOTICE` 파일을 참고해주세요.

- Updated dependencies [270c93d]
  - @seed-design/dom-utils@2.0.1
  - @seed-design/react-primitive@2.0.1
  - @seed-design/react-supports@1.0.1

## 2.0.0

### Patch Changes

- Updated dependencies [ec33023]
  - @seed-design/react-primitive@2.0.0

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

# @seed-design/react-navigation-menu

## 2.0.1

### Patch Changes

- 270c93d: 라이선스를 Apache-2.0으로 명시했습니다. 기존에는 `license` 필드가 비어 있어 저장소 루트의 Apache License 2.0과 일치하지 않았고, 배포물에 `LICENSE`와 `NOTICE`가 포함되지 않아 이용 조건을 확인할 수 없었습니다.

  당근 로고를 비롯한 브랜드 리소스는 별도 가이드라인을 따르며, 당근을 사칭하거나 당근 서비스와 관련이 있는 것처럼 오인하게 하는 사용은 허용되지 않습니다. 자세한 내용은 `NOTICE` 파일을 참고해주세요.

- Updated dependencies [270c93d]
  - @seed-design/dom-utils@2.0.1
  - @seed-design/react-primitive@2.0.1
  - @seed-design/react-use-controllable-state@2.0.1

## 2.0.0

### Major Changes

- 34586b6: `NavigationMenuGroupLabel`이 실제로 렌더된 경우에만 `NavigationMenuGroup`이 `aria-labelledby`를 노출하도록 수정합니다.

## 1.0.0

### Major Changes

- 2abd3ed: Side Navigation에서 내부적으로 사용되는 `NavigationMenu` 컴포넌트를 추가합니다.

### Patch Changes

- Updated dependencies [ec33023]
  - @seed-design/react-primitive@2.0.0

# @seed-design/react-image

## 1.1.0

### Minor Changes

- f9456d6: ImageFrame과 Avatar가 로딩 중에 이미지를 숨기지 않습니다.

  - `loading="lazy"` 이미지가 화면에 들어와도 끝내 로드되지 않던 문제를 수정합니다.
  - 이미지가 LCP 요소일 때 측정값이 실제 도착 시각으로 잡힙니다. `loading="eager"`에도 해당됩니다.
  - `src` 없이 `srcSet`만 지정한 반응형 이미지를 지원합니다.

  로딩 중 플레이스홀더가 보이고 완료 시 이미지가 보이는 동작은 그대로입니다. 다만 로딩 중에는 이미지가 화면에 남아 있으므로, 스크린리더가 플레이스홀더와 함께 이미지의 `alt`도 읽습니다.

## 1.0.1

### Patch Changes

- 270c93d: 라이선스를 Apache-2.0으로 명시했습니다. 기존에는 `license` 필드가 비어 있어 저장소 루트의 Apache License 2.0과 일치하지 않았고, 배포물에 `LICENSE`와 `NOTICE`가 포함되지 않아 이용 조건을 확인할 수 없었습니다.

  당근 로고를 비롯한 브랜드 리소스는 별도 가이드라인을 따르며, 당근을 사칭하거나 당근 서비스와 관련이 있는 것처럼 오인하게 하는 사용은 허용되지 않습니다. 자세한 내용은 `NOTICE` 파일을 참고해주세요.

- Updated dependencies [270c93d]
  - @seed-design/dom-utils@2.0.1
  - @seed-design/react-primitive@2.0.1

## 1.0.0

### Patch Changes

- Updated dependencies [ec33023]
  - @seed-design/react-primitive@2.0.0

## 0.1.1

### Patch Changes

- c46d593: `Image.Content` (`ImageFrame` 및 `AvatarImage`)에 `loading="lazy"` 사용 시 이미지 로드가 시작되지 않는 문제를 수정합니다.

## 0.1.0

### Minor Changes

- cfd2df4: react-image headless 릴리즈

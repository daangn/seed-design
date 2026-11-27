# @seed-design/lynx-react-bottom-sheet

## 1.2.0

### Minor Changes

- 1380147: Bottom Sheet에 열림·닫힘 애니메이션이 끝났을 때 호출되는 `onAnimationEnd`를 추가합니다.
  
  - 닫힘(`false`)은 시트 레이어가 화면에서 제거된 뒤에 호출되므로, 시트를 닫은 뒤 띄우는 스낵바 같은 native UI가 닫히는 overlay와 함께 사라지지 않습니다.

## 1.1.1

### Patch Changes

- c1c11e0: `skipAnimation`으로 연 Bottom Sheet·Menu Sheet가 레이어 크기를 측정한 뒤 닫힌 위치로 돌아가 화면에 보이지 않던 문제를 수정합니다. 측정값으로 시트의 인라인 style이 다시 적용되어도 현재 위치를 유지합니다.

## 1.1.0

### Minor Changes

- 6897d40: Bottom Sheet·Menu Sheet·Dialog가 LynxView의 `vh`·`vw` 대신 Positioner 레이어를 측정한 크기로 크기와 snap 위치를 계산합니다. 내용 높이로 삽입된 LynxView에서 `container="window"` 시트가 보이지 않던 문제와, `container` 레이어가 LynxView보다 클 때 시트·Dialog의 최대 높이가 LynxView 높이를 기준으로 계산되던 문제를 수정합니다.
  
  - 백분율 snap point는 `screenHeight`·`screenWidth`를 넘기지 않으면 레이어를 측정한 뒤 열리기 시작합니다. 넘긴 값은 계속 우선합니다.
  - `useBottomSheetContext()`가 측정한 레이어 크기 `layerSize`를 제공합니다.
  - `fit` 시트가 하단 padding만 잡힌 첫 layout 높이에서 멈추던 문제를 수정합니다. 진입 중이거나 열린 `fit` 시트는 내용 높이가 바뀌면 새 높이로 다시 snap합니다. 드래그 중에는 다시 snap하지 않습니다.

## 1.0.2

### Patch Changes

- b7eb437: (사용자 변경사항 없음) 내부 의존성 `@lynx-js/motion`을 0.0.8로 갱신합니다. 이 버전은 Motion 구현을 패키지 안에 포함하므로 `framer-motion`·`motion-dom`·`motion-utils`가 더 이상 함께 설치되지 않습니다.
- 4b1d559: `@lynx-js/react` peer dependency 하한을 `>=0.100.0`에서 `>=0.117.0`으로 올려 Lynx 패키지 전체와 맞춥니다.

## 1.0.1

### Patch Changes

- 7540d3c: BottomSheet의 높이가 바뀔 때 배경이 깜빡이던 문제를 수정합니다. 리사이즈 중 닫거나 드래그해도 현재 배경 농도에서 자연스럽게 이어집니다.

## 1.0.0

### Major Changes

- a684488: (BREAKING CHANGE: `@seed-design/lynx-react`, `@seed-design/lynx-css`, 직접 설치한 모든 `@seed-design/lynx-react-*` 패키지를 함께 `^1.0.0`으로 올리고 [SEED Lynx 1 업그레이드 가이드](https://seed-design.io/lynx/updates/upgrade/v1)에 따라 코드를 수정해야 합니다.)
  
  SEED Lynx 패키지를 `1.0.0`으로 출시하고, 이후 버전부터 semver에 따라 호환성을 안내합니다.
  
  - 기존 코드의 수정이 필요한 변경은 major 버전으로, 기존 사용법을 유지하는 기능 추가는 minor 버전으로, 오류 수정은 patch 버전으로 배포합니다.

### Minor Changes

- 0e01546: SEED 스타일 없이 `BottomSheet`를 조합하는 `@seed-design/lynx-react-bottom-sheet`를 제공합니다.
  
  - `Root`의 `open`·`defaultOpen`·`onOpenChange`로 열림 상태와 변경 사유를 관리합니다.
  - `Trigger`·`Backdrop`·`Positioner`·`Content`·`Handle`·`CloseButton`을 조합하며, `Positioner`는 `container`를 지정한 overlay 레이어를 채웁니다.

# @seed-design/react-pull-to-refresh

## 1.0.2

### Patch Changes

- 7de0aca: PullToRefresh의 제스처 인식과 상태 복구 문제를 수정합니다.

  - iOS에서 스크롤하기 위해 빠르게 스와이프하는 경우 이를 pull로 잘못 인식해, 손을 떼는 순간 콘텐츠가 위로 튕기던 문제를 수정합니다. 이제 제스처가 시작된 지점을 손가락이 닿는 순간 기록하므로, 직전 제스처가 남긴 위치와 비교해 pull이 시작되는 일이 없습니다.
  - `PullToRefreshRoot` 안쪽에 별도의 스크롤 영역이 있는 경우, 그 영역이 한참 아래로 스크롤된 상태에서도 아래로 당기면 새로고침이 실행되던 문제를 수정합니다. 이제 Root가 아니라 실제로 스크롤을 담당하는 요소의 위치를 기준으로 판정합니다.
  - pull 도중 손가락이 시작 지점 위로 올라가면 콘텐츠가 위로 밀렸다가 되돌아오던 문제를 수정합니다. 이제 그 구간에서는 이동량이 `0`으로 유지되고, 다시 아래로 당기면 곧바로 이어집니다.
  - 제스처가 중간에 취소되면 인디케이터가 남아 원래 위치로 돌아오지 않던 문제를 수정합니다.
  - `onPtrRefresh`가 반환한 Promise가 reject되면 로딩 상태에서 빠져나오지 못해, 이후 새로고침이 아예 동작하지 않던 문제를 수정합니다.
  - `onPtrPullEnd`가 pull이 취소될 때도 호출됩니다. 취소된 경우 `displacement`는 `0`으로 전달됩니다.

## 1.0.1

### Patch Changes

- 687b261: `PullToRefresh.preventPull`을 활용하여 `PullToRefreshContent` 내부에서 당겨서 새로고침(PTR) 동작을 비활성화할 수 있습니다.

## 1.0.0

### Major Changes

- 34f92f2: 🌱 SEED Design 패키지의 첫 메이저 버전을 출시합니다.

### Patch Changes

- Updated dependencies [34f92f2]
  - @seed-design/react-primitive@1.0.0
  - @seed-design/dom-utils@1.0.0

## 0.0.6

### Patch Changes

- 4610b5b: PullToRefresh에 disabled prop을 추가합니다.

## 0.0.5

### Patch Changes

- Updated dependencies [29ec9f0]
  - @seed-design/react-primitive@0.0.3

## 0.0.4

### Patch Changes

- 7851a31: RSC 지원을 위한 "use client" directive를 추가합니다.

## 0.0.3

### Patch Changes

- e368c69: 패키지 의존성을 최신화합니다.
- Updated dependencies [e368c69]
  - @seed-design/react-primitive@0.0.2
  - @seed-design/dom-utils@0.0.2

## 0.0.2

### Patch Changes

- c0c0b7e: 여러 PTR 인스턴스가 동일한 상태를 공유하는 문제를 수정합니다.

## 0.0.1

### Patch Changes

- b64023c: Initial release of the next version of Seed Design.
- Updated dependencies [b64023c]
  - @seed-design/react-primitive@0.0.1
  - @seed-design/dom-utils@0.0.1

## 0.0.1-rc.0

### Patch Changes

- Seed Design V3 release candidate
- Updated dependencies
  - @seed-design/react-primitive@0.0.1-rc.0
  - @seed-design/dom-utils@0.0.1-rc.0

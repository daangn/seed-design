---
id: storybook-drawer-viewport-capture
description: BottomSheet·SwipeableMenuSheet·Dialog를 표 안에 배치한 정적 Storybook의 전체 페이지 캡처가 흔들릴 때 읽는다. 캡처 중 뷰포트 변경에 따른 키보드 위치 보정과 flex 본문의 높이 변화를 이미지·실제 레이아웃·같은 빌드 self-diff로 구분하는 절차를 다룬다.
scope: ["docs/stories/**"]
status: active
related: ["storybook-first-load-readiness"]
---

# 정적 overlay story는 캡처 중 본문 길이로 높이를 결정한다

## 교훈과 다음 행동

- Kapture의 `unstable`은 같은 코드의 반복 캡처 차이다. base와 head 중 어느 쪽에서 발생했는지 원본·반복 이미지와 실제 bounding rect를 함께 확인한다.
- 입력창이 없는 정적 BottomSheet 조합 표에서는 `repositionInputs={false}`를 지정한다. ResponsiveDialog·ResponsiveSidePanel은 `bottomSheetRootProps`로 전달한다. 키보드 동작을 검증하는 예제와 제품 기본값에는 적용하지 않는다.
- 같은 Drawer 기반이어도 wrapper의 공개 prop을 확인한다. SwipeableMenuSheet.Root는 allowlist에 `repositionInputs`가 없어 직접 전달하면 타입 검사가 실패한다. 정적 표에서만 content의 `height: auto !important`·`bottom: 0 !important`로 캡처 중 입력 보정값을 억제하며, 이를 위해 공개 API를 넓히거나 타입 검사를 우회하지 않는다.
- Dialog 조합 표에서는 overflow 예제에만 `maxHeight`를 지정하고 짧은 본문은 자연 높이로 배치한다. `flex: none`만 추가한 수정은 로컬 반복 캡처를 통과했지만 Linux CI에서 같은 48px/120px 높이 차이가 다시 발생했다. flex 제약 하나를 근본 원인으로 단정하지 않는다.
- animation을 꺼 두었다는 이유만으로 레이아웃이 고정됐다고 가정하지 않는다. 전체 페이지 screenshot 전후의 visual viewport, 시트 높이·위치, 인라인 스타일을 비교하고, 수정한 동일 빌드끼리 기존 임계값을 유지한 self-diff를 실행한다.
- base에도 같은 문제가 있으면 head 수정만으로 `unstable`이 없어지지 않는다. 공통 수정의 기준 브랜치 반영 범위를 확인한다.

## 발생 근거와 적용 조건

- #1894에서 BottomSheet와 반응형 컴포넌트의 작은 뷰포트 캡처가 불안정했다. 입력창 없는 story인데 전체 페이지 캡처 도중 Drawer의 키보드 위치 보정이 동작해 시트 높이와 위치를 바꿨다.
- Kapture 0.11.1로 세 story의 10개 스냅샷을 같은 빌드끼리 비교했을 때 수정 전 5개가 불안정했고, 정적 story의 입력 위치 보정만 끈 뒤 10개 모두 일치했다. 임계값이나 비교 영역은 바꾸지 않았다.
- 전체 CI를 다시 실행하자 기존 세 컴포넌트는 통과했고 다른 SwipeableMenuSheet 글자 크기 변형과 Dialog Dark가 불안정했다. SwipeableMenuSheet는 로컬 self-diff에서도 3개가 불안정했다. Dialog의 CI 원본·반복 이미지는 짧은 Body가 48px 또는 120px로 그려져 이후 행이 밀리는 차이를 보였다. 정적 표의 높이 보정과 Body flex만 수정하며 제품 동작과 시각 비교 임계값은 유지했다.
- 후속 수정의 로컬 Kapture self-diff는 관련 18개 스냅샷을 세 번 비교해 54개 모두 일치했으나, 원격 전체 401개 캡처에서는 Dialog 2개가 여전히 불안정했다. Actions capture job의 성공만 확인하지 말고 report의 `unstable`·`errors`와 Kapture Visual Review 상태를 함께 확인한다. 로컬 결과와 원격 결과를 구분한다.

## 변경 이력

- 2026-09-29: #1894 CI 로그·반복 캡처 이미지와 로컬 동일 빌드 비교에서 확인한 원인과 검증 절차를 기록했다.
- 2026-09-29: 후속 전체 캡처에서 확인한 SwipeableMenuSheet의 공개 prop 제한과 Dialog Body 높이 변화를 반영했다.
- 2026-09-29: flex 고정 후에도 Linux CI에서 Dialog 높이 차이가 재발한 증거를 추가하고, 짧은 본문에 불필요한 높이 상한을 두지 않도록 검증 기준을 보강했다.

---
id: storybook-drawer-viewport-capture
description: BottomSheet를 표 안에 배치한 정적 Storybook의 전체 페이지 캡처가 흔들릴 때 읽는다. 캡처 중 뷰포트 변경과 키보드 위치 보정의 상호작용을 실제 레이아웃과 같은 빌드 self-diff로 구분하는 절차를 다룬다.
scope: ["docs/stories/**"]
status: active
related: ["storybook-first-load-readiness"]
---

# 정적 Drawer story는 캡처의 뷰포트 변경을 키보드 입력으로 처리하지 않는다

## 교훈과 다음 행동

- Kapture의 `unstable`은 같은 코드의 반복 캡처 차이다. base와 head 중 어느 쪽에서 발생했는지 원본·반복 이미지와 실제 bounding rect를 함께 확인한다.
- 입력창이 없는 정적 BottomSheet 조합 표에서는 `repositionInputs={false}`를 지정한다. ResponsiveDialog·ResponsiveSidePanel은 `bottomSheetRootProps`로 전달한다. 키보드 동작을 검증하는 예제와 제품 기본값에는 적용하지 않는다.
- animation을 꺼 두었다는 이유만으로 레이아웃이 고정됐다고 가정하지 않는다. 전체 페이지 screenshot 전후의 visual viewport, 시트 높이·위치, 인라인 스타일을 비교하고, 수정한 동일 빌드끼리 기존 임계값을 유지한 self-diff를 실행한다.
- base에도 같은 문제가 있으면 head 수정만으로 `unstable`이 없어지지 않는다. 공통 수정의 기준 브랜치 반영 범위를 확인한다.

## 발생 근거와 적용 조건

- #1894에서 BottomSheet와 반응형 컴포넌트의 작은 뷰포트 캡처가 불안정했다. 입력창 없는 story인데 전체 페이지 캡처 도중 Drawer의 키보드 위치 보정이 동작해 시트 높이와 위치를 바꿨다.
- Kapture 0.11.1로 세 story의 10개 스냅샷을 같은 빌드끼리 비교했을 때 수정 전 5개가 불안정했고, 정적 story의 입력 위치 보정만 끈 뒤 10개 모두 일치했다. 임계값이나 비교 영역은 바꾸지 않았다.

## 변경 이력

- 2026-09-29: #1894 CI 로그·반복 캡처 이미지와 로컬 동일 빌드 비교에서 확인한 원인과 검증 절차를 기록했다.

---
id: kapture-full-page-viewport-shrink
description: Kapture full-page 캡처에서 ResizeObserver로 부모 폭을 재는 컴포넌트(MiddleTruncate 등)의 story가 `unstable`일 때 읽는다. 뷰포트를 따라 폭이 바뀌는 행만 흔들리고 고정 폭 행은 같다면 이 항목이 해당한다. Drawer 입력 보정·flex 본문 높이로 흔들리는 overlay story는 storybook-drawer-viewport-capture를 본다.
scope: ["docs/stories/**"]
status: active
related: ["storybook-drawer-viewport-capture"]
---

# Kapture full-page 캡처는 뷰포트를 순간적으로 1px로 줄인다

## 교훈과 다음 행동

- Kapture 0.15.3의 full-page 캡처 중 `resize` 이벤트가 폭 1px → 1280px 순서로 발생한다. 부모 폭이 뷰포트를 따르는 요소는 이때 ResizeObserver가 두 번 실행되고, React state 갱신은 다음 프레임 이후에 커밋되므로 캡처가 축소 상태의 결과를 담을 수 있다.
- VariantTable에서 1px 뷰포트의 `Component` 열은 같은 열의 가장 넓은 고정 폭 행(예: 300px)까지 줄어든다. 불안정한 캡처의 유동 폭 행이 고정 폭 행과 같은 결과를 보이면 이 경로를 의심한다.
- story에서는 표를 감싼 요소에 기본 캡처 뷰포트 폭에서 body padding을 뺀 `minWidth`(1280 − 32 = 1248px)를 주어 레이아웃이 축소를 따라가지 않게 한다. 기본 뷰포트의 레이아웃이 그대로라 기준 이미지는 바뀌지 않는다.
- 컴포넌트에서 ResizeObserver 콜백 안에 `flushSync`를 쓰는 방식은 행 높이 변화로 ResizeObserver loop 오류를 낼 수 있고 공개 동작을 바꾸므로 시각 테스트 안정화 목적으로 쓰지 않는다.
- 재현은 같은 빌드끼리 Linux에서 반복한다. macOS 글꼴에서는 텍스트가 잘리지 않아 재현되지 않았다. 빌드 복사본의 `index.json`을 대상 story만 남기도록 줄이면 `kapture test --base-dir <dir> --head-dir <dir>` 한 번이 10초 안팎이다.

## 발생 근거와 적용 조건

- #2756·#2772·#2773·#2774에서 MiddleTruncate의 Light Theme·Font Scaling Extra Small이 MiddleTruncate와 무관한 변경에서 `unstable` 또는 변경으로 보고됐다. 원본·반복 이미지는 `grow` 행만 달랐다.
- Linux 컨테이너에서 같은 빌드 self-diff를 반복해 수정 전 39회(계측 스크립트를 넣은 사본 32회 포함) 중 14회가 불안정했다. 빌드 사본의 `iframe.html`에 계측 스크립트를 넣어 측정용 span의 폭과 `innerWidth`를 기록했고, 불안정한 캡처마다 `resize(1)` → 300px 기준 계산 → `resize(1280)` → 714px 기준 재계산 순서를 확인했다.
- `minWidth` 적용 후 같은 조건 12회(스냅샷 72장)가 모두 한 가지 결과였고, 수정 전 정상 결과와 해시가 같았다. 원격 CI 전체 캡처로는 아직 검증하지 않았다.

## 변경 이력

- 2026-11-25: MiddleTruncate story 불안정의 원인과 Linux 동일 빌드 반복 검증 절차를 기록했다.

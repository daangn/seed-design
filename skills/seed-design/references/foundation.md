# Foundation

SEED Design의 파운데이션 — 색상, 타이포그래피, 스페이싱, 테마 시스템을 활용하는 가이드입니다.

## 파운데이션 문서 참조

디자인 가이드라인의 전체 목록은 llms.txt에서 확인할 수 있습니다:

```text
https://seed-design.io/docs/llms.txt
```

## 주요 토픽별 llms.txt

상세 정보가 필요하면 WebFetch로 해당 URL을 읽어옵니다.

### 색상

| 토픽 | URL |
|------|-----|
| 색상 시스템 개요 | https://seed-design.io/llms/docs/foundation/color/color-system.txt |
| 역할 기반 색상 | https://seed-design.io/llms/docs/foundation/color/color-role.txt |
| 팔레트 | https://seed-design.io/llms/docs/foundation/color/palette.txt |

핵심 원칙: 역할 기반 색상(`--seed-color-fg-*`, `--seed-color-bg-*`, `--seed-color-stroke-*`)을 우선 사용합니다. 팔레트 색상(`--seed-color-palette-*`)은 역할 기반으로 커버되지 않는 예외 상황에만 사용합니다.

### 타이포그래피

| 토픽 | URL |
|------|-----|
| 타이포그래피 개요 | https://seed-design.io/llms/docs/foundation/typography/overview.txt |

핵심 원칙: 스케일은 t1(가장 작음)부터 t10(가장 큼). CSS 변수 `--seed-font-size-t{n}`, `--seed-line-height-t{n}`, `--seed-font-weight-*`로 사용합니다.

### Iconography

| 토픽 | URL |
|------|-----|
| Overview | https://seed-design.io/llms/docs/foundation/iconography/overview.txt |
| Usage | https://seed-design.io/llms/docs/foundation/iconography/usage.txt |
| Library | https://seed-design.io/llms/docs/foundation/iconography/library.txt |

### 스페이싱, 테마, 기타

| 토픽 | URL |
|------|-----|
| 스페이싱 | https://seed-design.io/llms/docs/foundation/spacing.txt |
| 테마 | https://seed-design.io/llms/react/getting-started/styling/theming.txt |
| Tailwind CSS 연동 | https://seed-design.io/llms/react/getting-started/styling/tailwind-css.txt |
| Elevation (그림자) | https://seed-design.io/llms/docs/foundation/elevation.txt |
| Radius (모서리) | https://seed-design.io/llms/docs/foundation/radius.txt |
| Motion (애니메이션) | https://seed-design.io/llms/docs/foundation/motion.txt |
| Gradient | https://seed-design.io/llms/docs/foundation/gradient.txt |

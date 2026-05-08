# packages/rootage

## 디렉토리 개요

SEED Design의 **디자인 토큰과 컴포넌트 스키마를 YAML로 정의**하는 원천(source of truth) 패키지. `bun rootage:generate`로 `css/vars`, `qvism-preset/src/vars`에 코드를 생성한다.

## 파일 작성 컨벤션

- 토큰 정의와 컴포넌트 스키마 정의를 역할별 YAML 계층으로 관리한다.
- 자동 생성 산출물은 직접 수정하지 않고 원천 YAML 변경 후 재생성한다.

## 코드 작성 컨벤션

- 컴포넌트 YAML 첫 줄: `# yaml-language-server: $schema=./schema.json`
- 토큰 네이밍: `$type.category.name` (예: `$color.palette.gray-00`)
- theme 값: `theme-light`와 `theme-dark` 모두 정의 필수
- duration/timingFunction은 하드코딩(`300ms`, `ease-in-out`)하지 않고, 반드시 시스템 토큰을 먼저 찾아 사용한다: `$duration.d1`~`$duration.d6`, `$timing-function.easing`/`enter`/`exit` 등. 시스템 토큰에 맞는 값이 없을 때만 하드코딩한다 (예: select-box의 `400ms`).
- 반걸음 dimension은 언더스코어 구분자 사용: `$dimension.x0_5` (콤마 아님)

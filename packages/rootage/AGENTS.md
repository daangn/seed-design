# packages/rootage

## 디렉토리 개요

SEED Design의 **디자인 토큰과 컴포넌트 스키마를 YAML로 정의**하는 원천(source of truth) 패키지. `bun rootage:generate`로 `css/vars`, `qvism-preset/src/vars`에 코드를 생성한다.

## 파일 작성 컨벤션

- `*.yaml` (루트): 토큰 정의 (color, radius, duration 등)
- `components/*.yaml`: 컴포넌트 스키마 정의 (kebab-case)
- `components/schema.json`: 자동 생성 (직접 수정 금지)

## 코드 작성 컨벤션

- 컴포넌트 YAML 첫 줄: `# yaml-language-server: $schema=./schema.json`
- 토큰 네이밍: `$type.category.name` (예: `$color.palette.gray-00`)
- theme 값: `theme-light`와 `theme-dark` 모두 정의 필수

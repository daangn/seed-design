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
- outline이나 1px frame 성격의 token은 기본적으로 `strokeColor`/`strokeWidth` vocabulary를 먼저 검토한다. 실제 CSS border semantics를 public contract로 드러낼 때만 `border*`를 사용한다.
- slot 이름은 public component contract를 반영한다. generic 앞 슬롯이면 `prefix`, icon-only 슬롯이면 `prefixIcon`처럼 의미를 분리한다.
- item 자체를 설명하는 component spec에서도 최상위 element token slot은 `root`를 우선한다. 부모 recipe에서 그 component를 `item` slot으로 배치하더라도 rootage token schema 안에서는 해당 component의 root element라는 의미를 유지한다.

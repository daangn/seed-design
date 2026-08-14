# packages/rootage

## 디렉토리 개요

SEED Design의 **디자인 토큰과 컴포넌트 스키마를 YAML로 정의**하는 원천(source of truth) 패키지. `bun rootage:generate`로 `css/vars`, `qvism-preset/src/vars`에 코드를 생성한다.

## 파일 작성 컨벤션

- 토큰 정의와 컴포넌트 스키마 정의를 역할별 YAML 계층으로 관리한다.
- 자동 생성 산출물은 직접 수정하지 않고 원천 YAML 변경 후 재생성한다.

## 코드 작성 컨벤션

- 컴포넌트 YAML 첫 줄: `# yaml-language-server: $schema=./schema.json`
- ComponentSpec은 `schema.states`(약한 것부터 나열, 위치가 곧 우선순위)와 평평한 `rules` 배열로 쓴다. `rules` 배열의 순서에는 의미가 없으니, 어떤 규칙이 이겨야 하면 state 순위를 바꾸거나 규칙의 selector를 좁힌다.
- `enabled`는 state가 아니다. 상태와 무관하게 적용되는 값은 `states` 없는 규칙에 쓴다.
- 규칙의 `variants`/`states`는 schema에 선언된 순서대로 적는다. 파서가 어차피 정렬하므로, 다르게 적으면 파일이 말하는 것과 생성되는 변수 이름이 어긋난다.
- 두 규칙이 같은 property를 겹치는 영역에 선언하는데 어느 쪽도 상대를 포함하지 않으면 `bun rootage:validate`가 거부한다. 이긴 쪽에 나머지 축을 마저 적어 포함관계를 만든다.
- 토큰 네이밍: `$type.category.name` (예: `$color.palette.gray-00`)
- theme 값: `theme-light`와 `theme-dark` 모두 정의 필수
- outline이나 1px frame 성격의 token은 기본적으로 `strokeColor`/`strokeWidth` vocabulary를 먼저 검토한다. 실제 CSS border semantics를 public contract로 드러낼 때만 `border*`를 사용한다.
- slot 이름은 public component contract를 반영한다. generic 앞 슬롯이면 `prefix`, icon-only 슬롯이면 `prefixIcon`처럼 의미를 분리한다.
- item 자체를 설명하는 component spec에서도 최상위 element token slot은 `root`를 우선한다. 부모 recipe에서 그 component를 `item` slot으로 배치하더라도 rootage token schema 안에서는 해당 component의 root element라는 의미를 유지한다.
- duration/timingFunction은 하드코딩(`300ms`, `ease-in-out`)하지 않고, 반드시 시스템 토큰을 먼저 찾아 사용한다: `$duration.d1`~`$duration.d6`, `$timing-function.easing`/`enter`/`exit` 등. 시스템 토큰에 맞는 값이 없을 때만 하드코딩한다 (예: select-box의 `400ms`).
- 반걸음 dimension은 언더스코어 구분자 사용: `$dimension.x0_5` (콤마 아님)

# packages/rootage

디자인 토큰(`*.yaml`)과 컴포넌트 스키마(`components/*.yaml`)의 원천 패키지(`@seed-design/rootage-artifacts`)다. 검증·생성 명령과 함정은 루트 `AGENTS.md`「검증」「생성」에 있다.

## 규칙

### YAML 형식

- `components/*.yaml` 첫 줄은 `# yaml-language-server: $schema=./schema.json`이다.
- 토큰 이름은 `$type.category.name`(예: `$color.palette.gray-00`)으로 쓴다. 반걸음 dimension은 `$dimension.x0_5`처럼 언더스코어로 쓴다(콤마 아님).
- theme을 쓰는 토큰은 `theme-light`와 `theme-dark` 값을 모두 정의한다.
- `color.yaml`·`gradient.yaml`·`shadow.yaml`은 `bun figma:sync`가 Figma variables로 통째로 다시 쓴다(`ARCHITECTURE.md`「생성 파이프라인」). Figma에서 온 값을 손으로 고치면 다음 동기화에서 사라진다 → Figma variables 변경이 필요한지 사용자에게 확인한다.

### 값

- duration·timing function → `300ms`, `ease-in-out`을 하드코딩하기 전에 `$duration.d1`–`$duration.d6`, `$timing-function.easing`·`enter`·`exit` 같은 시스템 토큰을 찾는다. 맞는 토큰이 없을 때만 하드코딩한다(예: `components/select-box.yaml`의 `400ms`).
- outline이나 1px frame 성격 토큰 → 먼저 `strokeColor`·`strokeWidth`를 쓴다. 실제 CSS border semantics를 public contract로 드러낼 때만 `border*`를 쓴다.

### Slot 이름

- slot 이름은 public component contract를 반영한다. generic 앞 slot은 `prefix`, icon 전용 slot은 `prefixIcon`처럼 나눈다.
- 컴포넌트 최상위 element slot은 `root`로 쓴다. 부모 Recipe가 그 컴포넌트를 `item` slot으로 배치해도 이 컴포넌트의 스키마 안에서는 `root`다.

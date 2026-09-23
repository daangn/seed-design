# Platform Gate

컴포넌트 구현 경로를 정하기 전에 대상 플랫폼을 `react`, `lynx`, `cross-platform` 중 하나로 확정한다. 같은 이름의 컴포넌트라도 브라우저 React와 Lynx는 런타임, CSS 지원, Registry, 검증 환경이 다르다.

## 1. Target platform 결정

요청, 경로, import, 문서 위치로 고른다.

- `lynx-*` 경로·패키지(`packages/lynx-react`, `packages/lynx-react-headless`, `packages/lynx-css` 등), `@lynx-js/react`, `<view>`·`<text>` 같은 native tag, `docs/content/lynx`, `docs/registry/lynx/ui`, `examples/lynx-spa` → `lynx`
- `@seed-design/react`, `packages/react`, `packages/react-headless`, `docs/content/react`, Storybook, `examples/stackflow-spa` → `react`
- "React와 Lynx 둘 다", 같은 컴포넌트의 Web·Lynx parity, 공유 token·recipe 어휘 → `cross-platform`

기본 구현 표면은 루트 `ARCHITECTURE.md`「패키지 의존 방향」의 웹·Lynx 순서를 따르고 문서·예제까지 이어진다. Lynx에서 `packages/lynx-react-headless`는 필요할 때만 추가한다. 두 플랫폼 모두 Registry snippet은 [Delivery Surface Gate](api-design.md#delivery-surface-gate)가 정할 때만 만든다.

## 2. Cross-platform 기본값

`cross-platform`은 한 파일에서 양쪽 런타임을 흡수한다는 뜻이 아니다. 다음 순서로 나눈다.

1. 공유 의미: 이름, 사용자에게 보이는 API, 상태 모델, token 어휘를 먼저 합의한다.
2. React 구현: [react-patterns.md](react-patterns.md)와 React registry·docs 경로를 따른다.
3. Lynx 구현: [lynx-patterns.md](lynx-patterns.md)와 Lynx registry·docs 경로를 따른다.
4. parity 보고: 웹과 Lynx의 지원·미지원 차이를 문서화한다.

Lynx가 Web API를 그대로 재현할 수 없음 → 타입에 열어두지 않는다. 미지원 prop을 Lynx 타입에서 제거하고 `docs/content/lynx`에 차이와 이유를 남긴다([Unsupported Web API 문서화](lynx-patterns.md#unsupported-web-api-문서화)).

## 3. Platform-specific source of truth

어디를 볼지에 대한 안내다. 각 줄은 React 경로, Lynx 경로 순이다.

- Styled component → `packages/react/src/components/*`, `packages/lynx-react/src/components/*`
- Headless·state → `packages/react-headless/*`, `packages/lynx-react-headless/*`. 기존 외부 Lynx primitive가 상태를 이미 소유할 때만 `packages/lynx-react/src/hooks/*`나 컴포넌트 내부 hook·context에 둔다.
- Recipe 원천 → `packages/qvism-preset/src/recipes/*`, `packages/lynx-qvism-preset/src/recipes/*`
- 생성 CSS → `packages/css/`, `packages/lynx-css/`. 생성물과 손으로 쓰는 소스가 섞여 있다 → 파일별 수정 가능 여부는 루트 `AGENTS.md`「생성」의 `git check-attr` 규칙과 각 패키지 `AGENTS.md`의 수동 예외로 판단한다.
- Docs → `docs/content/react/*`, `docs/content/lynx/*`
- Registry snippet(Delivery Surface Gate가 snippet일 때) → `docs/registry/react/ui/*`, `docs/registry/lynx/ui/*`
- Vendored example copy(snippet이 있을 때) → `examples/stackflow-spa/src/seed-design/ui/*`, `examples/lynx-spa/src/seed-design/ui/*`

동기화 규칙:

- Registry snippet을 제공함 → docs registry가 원천이다. example app의 vendored copy는 registry snippet을 따라 고친다.
- package-only primitive → registry와 vendored copy를 만들지 않는다. docs Usage, package export, example의 direct import를 맞춘다.
- Headless·Styled Primitive·Registry의 책임 → [lynx-patterns.md](lynx-patterns.md#책임-분리)의 `책임 분리`가 단일 기준이다.

## 4. Ask-first boundary

새 패키지·외부 의존성은 루트 `AGENTS.md`「경계」대로 사용자에게 먼저 확인한다. Headless 공개 API 형태는 [책임 분리](lynx-patterns.md#책임-분리)를 따른다.

1. 기존 headless package(`packages/lynx-react-headless/`), `packages/lynx-react` 내부 hook·context, 외부 primitive로 계약을 충족할 수 있는지 먼저 확인한다.
2. 충족할 수 있음 → 그 경로로 구현한다.
3. 충족할 수 없음 → 구현 전에 다음을 사용자에게 보고하고 확인받는다.
   - 기존 package와 `packages/lynx-react` 내부 hook·context만으로 왜 부족한가
   - 새 Headless가 소유할 상태·이벤트·ref·접근성·기능 geometry 계약
   - `package.json`, 루트 workspace, build·test script 변경 필요 여부
4. 확인을 받기 전에는 새 패키지를 만들지 않고, 기존 경로로 가능한 설계·조사만 진행한다.

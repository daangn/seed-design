# Platform Gate

컴포넌트 구현 경로를 정하기 전에 대상 플랫폼을 확정한다. 같은 이름의 컴포넌트라도 브라우저 React와 Lynx는 런타임, CSS 지원, Registry, 검증 환경이 다르다.

## 1. Target platform 결정

사용자의 요청, 경로, import, 문서 위치를 보고 아래 중 하나를 고른다.

| Platform | 신호 | 기본 구현 표면 |
|----------|------|----------------|
| `react` | `packages/react`, `packages/react-headless`, `docs/content/react`, Storybook, stackflow-spa | Rootage → `packages/qvism-preset` → `packages/css` → `packages/react` → docs/example. Registry snippet은 Delivery Surface Gate에서 필요 시 |
| `lynx` | `packages/lynx-react`, `packages/lynx-css`, `docs/content/lynx`, `examples/lynx-spa`, Lynx native tag | Rootage → `packages/lynx-qvism-preset` → `packages/lynx-css` → `packages/lynx-react` → docs/example. Registry snippet은 Delivery Surface Gate에서 필요 시 |
| `cross-platform` | “React와 Lynx 둘 다”, 같은 컴포넌트의 Web/Lynx parity, shared token/recipe vocabulary | shared Rootage/semantic API를 먼저 정하고 React/Lynx 구현과 문서를 각각 분리 |

요청이 `lynx-*`, `@lynx-js/react`, `<view>`/`<text>`, `docs/content/lynx`, `docs/registry/lynx/ui` 중 하나를 포함하면 `lynx`로 본다. 요청이 `@seed-design/react`, `docs/content/react`, Storybook 중심이면 `react`로 본다.

## 2. Cross-platform 기본값

`cross-platform`은 한 파일에서 양쪽 런타임을 흡수하는 뜻이 아니다. 다음 순서로 나눈다.

1. shared semantics: 이름, 사용자-facing API, 상태 모델, token vocabulary를 먼저 합의한다.
2. React implementation: [react-patterns.md](react-patterns.md)와 React registry/docs 경로를 따른다.
3. Lynx implementation: [lynx-patterns.md](lynx-patterns.md)와 Lynx registry/docs 경로를 따른다.
4. parity report: 웹과 Lynx의 지원/미지원 차이를 문서화한다.

Lynx가 Web API를 그대로 재현할 수 없으면 타입에 열어두지 않는다. unsupported prop은 Lynx 타입에서 제거하고 `docs/content/lynx`에 차이와 이유를 남긴다.

## 3. Platform-specific source of truth

| 판단 영역 | React | Lynx |
|-----------|-------|------|
| Styled component | `packages/react/src/components/*` | `packages/lynx-react/src/components/*` |
| Headless/state | `packages/react-headless/*` | `packages/lynx-react/src/hooks/*`, 컴포넌트 내부 hook/context 또는 기존 외부 Lynx primitive |
| Recipe source | `packages/qvism-preset/src/recipes/*` | `packages/lynx-qvism-preset/src/recipes/*` |
| Generated CSS | `packages/css/*` | `packages/lynx-css/*` |
| Docs | `docs/content/react/*` | `docs/content/lynx/*` |
| Registry snippet | `docs/registry/react/ui/*` when Delivery Surface Gate = snippet | `docs/registry/lynx/ui/*` when Delivery Surface Gate = snippet |
| Vendored example copy | `examples/stackflow-spa/src/seed-design/ui/*` when snippet exists | `examples/lynx-spa/src/seed-design/ui/*` when snippet exists |

Registry snippet을 제공하기로 결정한 경우 source of truth는 docs registry다. example app의 vendored copy는 registry snippet을 따라간다. package-only primitive는 registry/vendored copy를 만들지 않고 docs Usage와 package export, example direct import를 동기화한다.

## 4. Ask-first boundary

현재 저장소에는 별도의 Lynx headless 패키지가 없다. 기존 hook/context와 외부 primitive로 책임을 나눌 수 없어 새 패키지가 필요하면 저장소의 “새 패키지 추가” boundary에 해당한다. 구현 전에 사용자에게 다음을 보고하고 확인받는다.

- 왜 `packages/lynx-react` 내부 hook/context만으로 부족한가
- 어떤 상태/이벤트/접근성 계약을 headless 패키지가 소유하는가
- `package.json`, root workspace, build/test script 변경이 필요한가

확인 전에는 새 패키지를 만들지 않는다.

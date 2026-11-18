# SEED Design 아키텍처

Rootage YAML이 토큰과 컴포넌트 스키마의 원천이다. 생성 단계를 거쳐 웹·Lynx CSS가 되고, React·Lynx 컴포넌트와 문서가 이를 소비한다.

## 생성 파이프라인

`bun generate:all`은 2–5단계를 순서대로 실행한다.

1. `bun figma:sync`: `ecosystem/figma-extractor`가 Figma variables를 `scripts/data/variables`로 추출하고, `scripts/figma-to-rootage.ts`가 `packages/rootage/`의 `color.yaml`·`gradient.yaml`·`shadow.yaml`을 다시 쓴다. `FIGMA_FILE_KEY`와 `FIGMA_PERSONAL_ACCESS_TOKEN`이 없으면 경고만 내고 추출을 건너뛰므로 출력의 경고를 확인한다.
2. `bun rootage:generate`: `packages/rootage/*.yaml`·`components/*.yaml`로 `packages/rootage/__generated__/`, `components/schema.json`, CSS·preset 패키지의 `vars/`·`src/vars/`·`token.css`·`tokens.ts`, Tailwind plugin·theme을 만든다.
3. `bun qvism:generate`: `packages/qvism-preset/src/recipes/`와 `packages/lynx-qvism-preset/src/recipes/`로 `packages/css/recipes/`와 `packages/lynx-css/recipes/`를 만든다. Recipe가 2단계의 `src/vars/`를 쓰므로 컴포넌트 스키마를 바꾸면 이 단계도 이어서 실행한다.
4. `bun lynx:generate`: `bun lynx-headless:build` 뒤 `packages/lynx-react`와 `packages/tailwind3-plugin`을 빌드한다.
5. `bun docs:generate`: `docs/registry/`와 `docs/content/`로 `docs/public/__registry__/`, `docs/public/__docs__/` 등 문서 산출물을 만든다.

`ecosystem/rootage/`·`ecosystem/qvism/`의 생성 로직을 고쳤으면 `bun ecosystem:build`를 먼저 실행한다. 생성 패키지 안에도 손으로 쓰는 원천(`packages/css/theming/` 등)과 수동 예외(`packages/lynx-css/recipes/progress-circle.*`)가 있으므로 해당 패키지 `AGENTS.md`를 따른다.

## 패키지 의존 방향

- 웹: `rootage` → `qvism-preset` → `css`. `react`가 `css` Recipe와 `react-headless/*` 로직을 조합하고, 문서·registry·React 예제가 `react`를 소비한다.
- Lynx: `rootage` → `lynx-qvism-preset` → `lynx-css`. `lynx-react`가 `lynx-css`와 `lynx-react-headless/*`를 조합하고, Lynx 문서·예제가 소비한다. Lynx는 웹과 native element·런타임 제약이 다르므로 `packages/lynx-react/AGENTS.md`의 intrinsic tag·children·ref 규칙을 먼저 본다.
- Headless: `react-headless/*`와 `lynx-react-headless/*`는 스타일 없는 상태·접근성·입력 로직을 독립 패키지로 제공한다. 소비 패키지는 이들의 `lib/` 빌드를 import하므로 headless를 먼저 빌드한다.
- 문서: `docs/content/`가 문서 원천, `docs/registry/react/ui/`가 사용자가 복사하는 snippet 원천이다. 생성 registry와 vendored copy(`examples/stackflow-spa/src/seed-design/ui/`)가 따로 있다.
- Figma: REST·Plugin 입력 → `packages/figma/src/normalizer/` → `packages/mcp/`(REST), `tools/figma-codegen/`(Plugin).
- Rootage CDN: `tools/rootage-cdn/`이 npm에 게시된 Rootage JSON을 R2에 불변 저장하고 Worker로 공개한다. 계약과 운영 절차는 `tools/rootage-cdn/TECH.md`에 있다.

## 변경 유형별 시작 경로

각 줄은 `먼저 열 경로 (함께 확인할 소비자)` 형식이다.

- 토큰·Rootage schema → `packages/rootage/`, `ecosystem/rootage/` (영향받는 `vars/`, `packages/rootage/__generated__/`)
- 웹 Recipe·CSS → `packages/qvism-preset/`, `ecosystem/qvism/` (`packages/css/`, 해당 React 컴포넌트)
- Lynx Recipe·CSS → `packages/lynx-qvism-preset/`, `packages/lynx-css/` (`packages/lynx-react/`, `docs/content/lynx/`)
- React 컴포넌트 → `packages/react-headless/*/` 또는 `packages/react/` (`docs/registry/react/ui/`, vendored copy, 관련 문서·예제)
- Lynx 컴포넌트 → `packages/lynx-react/`, `packages/lynx-react-headless/*/` (`packages/lynx-css/`, `docs/content/lynx/`, `docs/examples/lynx/`)
- CLI → `packages/cli/` (`docs/content/react/getting-started/cli/`, registry 경로)
- Figma 변환·codegen → `packages/figma/` (`packages/mcp/`, `tools/figma-codegen/`, `scripts/`)
- MCP 도구 → `packages/mcp/` 또는 `packages/docs-mcp/` (REST·WebSocket 양쪽 경로, docs section 매핑)
- 문서·registry → `docs/`의 대상 하위 경로 (content 영역·section 구조를 바꿀 때만 `packages/docs-mcp/src/config.ts`)
- Rootage CDN·릴리스 → `tools/rootage-cdn/` (`packages/rootage/`, `.github/workflows/`)
- 공개 API 표면 diff → `tools/extract-api-surface/` (`.github/workflows/api-surface-diff*.yml`, `.github/scripts/build-api-surface-diff-comment.ts`, `.github/scripts/list-public-packages.ts`)

## 변경 전 영향도 분석

- 컴포넌트 → `bun skills/seed-component/scripts/component-map.ts <ComponentName>`로 원천·생성물·구현·registry·문서·예제·테스트 경로를 한 번에 조회한다. 결과 해석은 `skills/seed-component/references/component-map.md`를 따른다.
- 색상 토큰 → `bun skills/seed-component/scripts/token-map.ts '<token>'`로 원천·alias·사용처·생성 표면을 조회한다. 대비 검사와 결과 해석은 `skills/seed-component/references/color-token-analysis.md`를 따른다.
- 두 결과로 여러 패키지·플랫폼의 변경 순서나 changeset 범위를 정할 수 없으면 `seed-change` Skill의 읽기 전용 계획을 쓴다.

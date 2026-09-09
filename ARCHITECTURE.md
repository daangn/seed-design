# SEED Design 아키텍처

이 문서는 저장소의 패키지 경계, 생성 파이프라인, 주요 소비 경로를 빠르게 파악하기 위한 지도다. API 상세와 구현 규칙은 `TECH.md`, 작업 규칙은 대상 경로의 `AGENTS.md`, 사용자 대상 사용법은 `README.md`를 참고한다.

## 작업 시작 순서

모든 파일을 먼저 읽지 않는다.

1. 변경 의도를 토큰·Recipe·React·Lynx·문서·CLI·Figma/MCP·릴리스 중 하나로 분류한다.
2. 저장소 루트의 `AGENTS.md`와 변경 대상 경로까지의 가장 가까운 `AGENTS.md`를 읽는다.
3. 아래 작업 경로 표에서 지정한 source와 직접 소비자만 연다.
4. 생성물 변경이 필요하면 source를 수정한 뒤 `TECH.md`와 대상 패키지의 검증 명령을 따른다.

## 시스템 흐름

```text
[Figma variables]
        │
        ▼
[ecosystem/figma-extractor]
        │ scripts/data/variables
        ▼
[scripts/figma-to-rootage.ts]
        │
        ▼
[Rootage YAML: packages/rootage]
        │
        ├── ecosystem/rootage ──► packages/rootage/__generated__/
        │
        └── qvism-preset recipes
             │
             ├── ecosystem/qvism ──► packages/css/
             │                         packages/lynx-css/
             │
             └── generated recipe variables
                       packages/qvism-preset/src/vars/

[packages/css] + [packages/react-headless/*]
        │
        ▼
[packages/react] ──► docs, registry snippets, React examples

[packages/lynx-css] + Lynx runtime patterns
        │
        ▼
[packages/lynx-react] ──► Lynx docs and Lynx examples

[Figma REST / Plugin input]
        │
        ▼
[packages/figma/src/normalizer]
        ├── packages/mcp ──► REST MCP tools
        └── tools/figma-codegen ──► Plugin codegen
```

## Source·생성물·소비자 경계

| 계층 | 주요 경로 | 역할 | 직접 수정 |
|---|---|---|---|
| 정의 | `packages/rootage/*.yaml`, `packages/rootage/components/*.yaml` | 토큰과 컴포넌트 스키마의 source | 가능 |
| Recipe source | `packages/qvism-preset/src/recipes/`, `packages/lynx-qvism-preset/src/recipes/` | 웹·Lynx 스타일 Recipe 정의 | 가능 |
| Rootage 생성물 | `packages/rootage/__generated__/` | Rootage schema·JSON·TypeScript 생성 결과 | 금지 |
| CSS 생성물 | `packages/css/vars/`, `packages/css/recipes/`, `packages/lynx-css/vars/`, `packages/lynx-css/recipes/`, 루트 생성 CSS | 토큰·Recipe CSS와 타입 | 금지. 수동 예외는 해당 AGENTS 참고 |
| Recipe 변수 생성물 | `packages/qvism-preset/src/vars/` | Rootage에서 생성된 Recipe 변수 | 금지 |
| Headless | `packages/react-headless/*/` | React 스타일과 무관한 상태·접근성·이벤트 로직을 독립 패키지로 제공 | 가능 |
| Styled React | `packages/react/` | CSS Recipe와 Headless 로직을 조합한 공개 컴포넌트 | 가능 |
| Styled Lynx | `packages/lynx-react/` | Lynx native element와 Lynx CSS를 사용하는 컴포넌트 | 가능 |
| 문서·snippet | `docs/content/`, `docs/registry/`, `docs/public/__registry__/`, `docs/public/__docs__/` | 문서, 복사 가능한 예제, registry·docs index 생성물 | source만 수정 |
| 통합·도구 | `packages/figma/`, `packages/mcp/`, `packages/docs-mcp/`, `packages/cli/`, `tools/`, `ecosystem/` | Figma·MCP·CLI·생성·배포 실행 경로 | 대상 AGENTS 참고 |

`.gitattributes`가 저장소의 generated 파일 단일 원천이다. 여기에 표시된 `packages/qvism-preset/src/token.css`, `packages/qvism-preset/src/tokens.ts`, Lynx preset의 같은 파일, Tailwind plugin/theme, `packages/rootage/components/schema.json`, `docs/public/__docs__/index.json`, `**/__generated__/**`, `**/__registry__/**`, `lib/`, `dist/`도 직접 수정하지 않는다. 생성 패키지 안의 수동 source와 `packages/lynx-css/recipes/progress-circle.css` 예외는 대상 `AGENTS.md`를 따른다.

## 작업 경로 라우팅

| 변경 유형 | 먼저 읽을 경로 | 함께 확인할 경로 |
|---|---|---|
| 토큰·Rootage schema | `packages/rootage/`, `ecosystem/rootage/` | 영향 받는 `packages/*/vars/`, `packages/rootage/__generated__/` |
| 웹 Recipe·CSS | `packages/qvism-preset/`, `ecosystem/qvism/` | `packages/css/`, 해당 React 컴포넌트 |
| Lynx Recipe·CSS | `packages/lynx-qvism-preset/`, `packages/lynx-css/` | `packages/lynx-react/`, Lynx 문서 |
| React 컴포넌트 | `packages/react-headless/*/` 또는 `packages/react/` | `packages/css/`, `docs/registry/react/ui/`, 관련 docs/example |
| Lynx 컴포넌트 | `packages/lynx-react/` | `packages/lynx-css/`, `docs/content/lynx/`, `docs/examples/lynx/` |
| CLI 동작 | `packages/cli/` | `docs/content/react/getting-started/cli/`, registry 경로 |
| Figma 변환·codegen | `packages/figma/` | `tools/figma-codegen/`, `packages/mcp/`, `scripts/` |
| MCP 도구 | `packages/mcp/` 또는 `packages/docs-mcp/` | REST/WebSocket 또는 게시된 docs 인덱스의 실제 소비 경로 |
| 문서·registry | `docs/`의 대상 하위 경로 | `docs/app/_llms/config.ts`, 생성 registry, vendored consumer |
| Rootage CDN·릴리스 | `tools/rootage-cdn/` | `packages/rootage/`, GitHub workflow, 환경별 AGENTS |

## 변경 전 영향도 분석

### 컴포넌트 영향도

컴포넌트 변경은 먼저 `seed-component-map`을 한 번 실행한다.

```bash
bun skills/seed-component-map/scripts/component-map.ts <ComponentName>
```

결과의 `rootage`, `recipeSources`, `generatedOutputs`, `headless`, `implementations`, `packageExports`, `registry`, `docs`, `examples`, `tests` 경로만 필요한 범위에서 연다. `generatedOutputs`는 실제 배포 표면 확인용이며 직접 수정하지 않는다. 한 번에 한 컴포넌트만 조회하고 `ambiguous`면 결과의 후보 이름으로 다시 조회한다.

### 토큰 영향도

색상 토큰 변경은 먼저 `seed-token-analysis`로 원천·alias·사용처·생성 표면을 확인한다.

```bash
bun skills/seed-token-analysis/scripts/token-map.ts '$color.fg.neutral'
```

결과의 `definition`, `resolvedValues`, `dependentTokens`, `componentUsages`, `generatedSurfaces`를 순서대로 읽는다. 대비가 영향을 받으면 `token-contrast.ts`로 전경·배경·theme 조합을 추가 검사한다. `unresolved`나 `needs-backdrop`을 다른 mode 값으로 대체하지 않는다. 한 번에 한 토큰만 분석하며 생성 결과는 직접 수정하지 않는다.

두 분석 결과로 여러 패키지·플랫폼의 변경 순서와 changeset 범위를 판단할 수 없으면 `seed-change-plan`을 추가로 사용한다.


## 공개 소비 경로

### React

`packages/react-headless/*/`가 상태·접근성·이벤트 로직을 제공하고, `packages/react`가 `packages/css` Recipe와 primitive를 결합한다. 사용자가 복사하는 UI는 `docs/registry/react/ui/`에서 관리하며, 생성 registry와 예제의 vendored copy가 있을 수 있다.

### Lynx

`packages/lynx-qvism-preset`과 `packages/lynx-css`가 Lynx용 스타일을 제공하고 `packages/lynx-react`가 Lynx native element와 런타임 제약을 반영한다. 웹과 동일하다고 가정하지 말고 `packages/lynx-react/AGENTS.md`의 intrinsic tag·children·ref 규칙과 해당 Lynx 문서를 먼저 확인한다.

### 문서와 MCP

`docs/content/`가 문서 source이며 docs 생성 스크립트가 index·registry·LLM용 산출물을 만든다. section 등록은 `docs/app/_llms/config.ts`가 관리하고 그 결과가 `docs/public/__docs__/index.json`으로 게시된다. `@seed-design/cli`와 `@seed-design/docs-mcp`는 이 인덱스를 실행 시점에 읽으므로, content 영역이나 section 구조를 바꿀 때 이 파일을 함께 확인한다.

### Figma와 MCP

`packages/figma/src/normalizer/`가 REST와 Plugin 입력을 공통 normalized 타입으로 맞춘다. `packages/mcp/`는 REST 경로를, `tools/figma-codegen/`은 Plugin 경로를 주로 소비한다. 두 transport에 영향을 주는 MCP 도구 변경은 `packages/mcp/AGENTS.md`와 해당 검증 Skill을 따른다.

### Rootage CDN

`tools/rootage-cdn/`은 Rootage JSON을 `versions/`, `manifests/`, `pointers/stable.json`으로 나누어 R2에 불변 저장하고 Worker로 읽기 전용 공개한다. publish와 stable pointer 갱신은 mutation job이며, PR snapshot은 stable pointer를 변경하지 않는다. 배포·route·rollback은 exact deployment/version과 smoke 결과를 확인하는 guard를 거치며, 최초 bootstrap은 이전 version을 증명할 수 없으면 중단한다. 명령별 인증 환경변수와 운영 절차는 `tools/rootage-cdn/TECH.md`를 따른다.

## 생성과 검증

- Rootage source 변경: `bun rootage:generate` 또는 영향 범위에 맞는 `bun generate:all`
- Recipe source 변경: `bun qvism:generate` 또는 영향 범위에 맞는 `bun generate:all`
- 문서 registry source 변경: docs registry 생성 명령과 vendored consumer를 확인
- 생성물 디렉터리의 파일을 직접 고치지 않는다. 수동 예외는 대상 디렉터리의 `AGENTS.md`에 명시된 경우만 허용한다.
- 검증 명령은 변경 경로에 가장 가까운 `AGENTS.md`와 `TECH.md`의 표를 사용한다. 무관한 전체 빌드·테스트를 기본값으로 삼지 않는다.

## 문서 역할

- `AGENTS.md`: 에이전트 작업 규칙과 경계
- `ARCHITECTURE.md`: 저장소 구조, 의존성 방향, 작업 시작 경로
- `TECH.md`: 기술 스택, 구현 규칙, 생성·검증 명령
- `README.md`: 사람 대상 저장소 소개와 패키지 목록

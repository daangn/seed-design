# SEED Design - 기술 상세

## 기술 스택

- 런타임/패키지 관리: Bun
- UI 라이브러리: React
- 타입 시스템: TypeScript
- 패키지 빌드: bunchee, vite
- 문서 플랫폼: Next.js, Fumadocs, Storybook
- 린트/포맷: Biome

버전 정보는 문서에 중복 기재하지 않는다. 버전 확인은 루트 `package.json`과 각 워크스페이스의 `package.json`을 단일 소스로 사용한다.

## 공통 규칙

### TypeScript

- `any`, `as unknown` 사용 금지 (명시적 승인 없이)
- 타입 import는 항상 `type` 키워드 사용
- 동적 import보다 정적 import 우선

### 패키지 관리

- 항상 `bun` 사용 (`npm`/`yarn` 금지)
- `package.json` 직접 수정 금지 - `bun add 패키지명`으로 설치

### 생성 파일 직접 수정 금지

- `packages/css/vars/`, `packages/css/recipes/` → rootage, qvism-preset에서 생성
- `packages/qvism-preset/src/vars/` → rootage에서 생성
- 수정 필요 시 원천 파일 수정 후 `bun generate:all` 실행

---

## 아키텍처 개요

SEED Design은 **디자인 토큰 → 스타일 → 컴포넌트** 파이프라인을 따른다.

```text
[Figma] → [rootage YAML] → [qvism-preset] → [css] → [react]
           ↓                ↓               ↓
         토큰 정의        Recipe 정의      CSS 생성    React 컴포넌트
```

### 생성 파이프라인

| 단계 | 입력 | 출력 | 명령어 |
|------|------|------|--------|
| 1. Figma 동기화 | Figma 변수 | rootage YAML | `bun figma:sync` |
| 2. Rootage 생성 | rootage YAML | css/vars, qvism-preset/src/vars | `bun rootage:generate` |
| 3. Qvism 생성 | qvism-preset recipes | css/recipes | `bun qvism:generate` |
| 4. 전체 생성 | - | rootage, qvism, docs 산출물 | `bun generate:all` |

---

## 핵심 패키지 관계

```text
rootage (YAML 정의)
    ↓ generate
qvism-preset (Recipe 정의) + css/vars (토큰)
    ↓ generate
css (CSS 파일 + 타입)
    ↓ import
react (스타일드 컴포넌트) ← react-headless (로직)
```

| 패키지 | 역할 | 소스/생성 |
|--------|------|-----------|
| `rootage` | 디자인 토큰/컴포넌트 스키마 (YAML) | **소스** |
| `qvism-preset` | 스타일 Recipe 정의 | **소스** (일부 생성) |
| `css` | CSS/타입 생성물 | **생성** |
| `react-headless` | Headless UI 로직 | **소스** |
| `react` | 스타일드 React 컴포넌트 | **소스** |

---

## 주요 명령어

### 빌드/생성

| 명령어 | 설명 |
|--------|------|
| `bun generate:all` | 전체 코드 생성 (rootage + qvism + docs) |
| `bun rootage:generate` | Rootage에서 타입/변수 생성 |
| `bun qvism:generate` | qvism-preset에서 CSS 생성 |
| `bun packages:build` | 모든 패키지 빌드 |
| `bun headless:build` | react-headless 빌드 |

### 테스트

수정한 경로에 해당하는 테스트만 돌린다. 전체 실행은 커밋 직전 한 번이면 충분하다.

| 수정 경로 | 명령어 |
|-----------|--------|
| `packages/react-headless/` | `bun headless:test` |
| `packages/react/` | `bun react:test` |
| `packages/lynx-react/` | `bun test:lynx-react` |
| `packages/cli/` | `bun test packages/cli` |
| `packages/rootage/`, `ecosystem/rootage/` | `bun rootage:test` |
| `tools/rootage-cdn/` | `bun --filter @seed-design/rootage-cdn test && bun --filter @seed-design/rootage-cdn typecheck && WRANGLER_LOG_PATH=/tmp/wrangler-rootage-dry-run.log bun --filter @seed-design/rootage-cdn wrangler:dry-run` |
| `ecosystem/qvism/` | `bun test ecosystem/qvism` |
| `docs/` | `bun docs:test` |
| 전체 | `bun test:all` |

`bun test:all`은 `test:unit`(루트 `bun test`에서 `packages/lynx-react`만 제외)과 `test:lynx-react`(typecheck + vitest)를 합친 것이다. `bun rootage:test`가 함께 실행하는 `bun rootage:validate`는 여기 포함되지 않으므로, rootage YAML을 수정했으면 `bun rootage:test`를 따로 돌린다. 이 validator는 미사용 schema property를 정리할 수 있으므로 실행 뒤 `git diff`로 의도한 변경만 남았는지 확인한다.

릴리즈 자동화 변경은 먼저 `bun release:doctor`로 로컬 상태를 확인하고 `bun release:verify`로 CI와 같은 credential-free 전체 gate를 실행한다. 사람용 레인 운영 순서와 장애 복구는 [RELEASING.md](./RELEASING.md)를 따른다.

**테스트 환경**: `bunfig.toml`의 `[test].preload`가 `scripts/happydom.ts`(DOM 환경)와 `scripts/testing-library.ts`를 로드한다. 후자가 `@testing-library/jest-dom` 매처를 등록하고 `afterEach(cleanup)`을 전역으로 걸어주므로, 테스트에서 `cleanup()`을 직접 호출하지 않는다.

### 개발

| 명령어 | 설명 |
|--------|------|
| `bun --filter @seed-design/docs dev` | 문서 사이트 개발 서버 |
| `bun --filter @seed-design/docs storybook` | Storybook 실행 |
| `bun figma:sync` | Figma에서 토큰 동기화 |

### 린트/포맷

| 명령어 | 설명 |
|--------|------|
| `bun biome format --fix` | 코드 포맷 정리 |
| `bun lint:knip` | 미사용 코드 검사 |

---

## Rootage 스키마 구조

### 토큰 파일 (*.yaml)

```yaml
kind: Tokens
metadata:
  id: color
  name: Color
data:
  collection: color
  tokens:
    $color.palette.gray-00:
      values:
        theme-light: "#ffffff"
        theme-dark: "#000000"
```

### 컴포넌트 스키마 (components/*.yaml)

```yaml
kind: ComponentSpec
metadata:
  id: component-name
  name: Component Name
data:
  schema:
    slots:           # 컴포넌트 파츠별 속성
      root: { ... }
      label: { ... }
    variants:        # variant, size, layout 등
      variant: { values: { ... } }
      size: { values: { ... } }
  definitions:       # 상태별 실제 값
    base: { ... }
    variant=brandSolid: { ... }
```

---

## Recipe 시스템 (qvism-preset)

### 기본 구조

```typescript
import { componentName as vars } from "../vars/component";
import { defineRecipe } from "../utils/define";
import { active, disabled, focus, pseudo } from "../utils/pseudo";

const recipe = defineRecipe({
  name: "component-name",
  base: { /* 기본 스타일 */ },
  variants: {
    variant: { brandSolid: { ... }, neutralWeak: { ... } },
    size: { small: { ... }, medium: { ... } },
  },
  compoundVariants: [ /* 조합 스타일 */ ],
  defaultVariants: { variant: "brandSolid", size: "medium" },
});
```

### Pseudo 선택자

| 선택자 | 용도 | 비고 |
|--------|------|------|
| `active` | hover/pressed | 모바일 우선이므로 hover보다 권장 |
| `disabled` | 비활성 | |
| `focus` | 포커스 | |
| `focusVisible` | 키보드 포커스 | |
| `loading` | 로딩 중 | |
| `checked` | 체크됨 | Checkbox 등 |
| `selected` | 선택됨 | Tab 등 |

---

## React 컴포넌트 패턴

### 단일 컴포넌트 (ActionButton 등)

```typescript
import { recipe } from "@seed-design/css/recipes/component";
import { Primitive } from "@seed-design/react-primitive";

export const Component = React.forwardRef<HTMLElement, Props>((props, ref) => {
  const className = recipe({ variant, size });
  return <Primitive.element ref={ref} className={className} {...props} />;
});
```

### 복합 컴포넌트 (Checkbox 등)

```typescript
// Headless에서 로직 가져옴
import { CheckboxRoot, CheckboxControl } from "@seed-design/react-checkbox";

// Styled 컴포넌트에서 스타일 적용
export const Checkbox = { Root, Control, HiddenInput, ... };
```

---

## 버전 관리

- **Changesets** 사용: `.changeset/` 디렉토리
- `bun changeset` - 변경사항 기록
- `bun version` - 버전 업데이트
- `bun release:doctor` - credential과 네트워크 없이 로컬 릴리즈 상태 진단
- `bun release:verify` - CI와 같은 build/generate/test/package dry-run 전체 검증

사람이 수행하는 일상 릴리즈와 장애 복구 순서는 [RELEASING.md](./RELEASING.md)를 따른다. 로컬에서 package publish를 실행하는 루트 명령은 제공하지 않는다.

### 릴리즈 레인 자동화

- `dev`는 patch stable, `minor`는 minor beta, `major`는 major beta 레인이다. stable 승격과 prerelease 상태 전환은 초기 운영 범위에 포함하지 않는다.
- 정적 레인 정책은 `.github/release/lanes.json`, 게시 모드와 Rootage 준비 상태는 `.github/release/control.json`에서 관리한다. 두 파일은 같은 디렉토리의 Draft 2020-12 JSON Schema를 참조한다.
- 구현은 private workspace인 `tools/release-automation`에 `core`, `setup`, `lane`, `sync`, `publish`, `validation`, `local` 도메인으로 나눈다. 상세 구조와 신뢰 경계는 [`tools/release-automation/TECH.md`](./tools/release-automation/TECH.md)를 따른다.
- 일상 PR은 `dev`에 merge한다. 동기화 worker가 원본 diff를 target별 FIFO로 전달하고 changeset bump를 레인 정책에 맞춘 뒤, exact source diff·trusted `dev` control plane·target tree가 모두 일치하는 sync PR만 자동 merge한다.
- Version Packages 생성은 credential 없는 lane planner와 trusted `dev` writer로 분리한다. writer는 exact base/control/tree/patch와 package version, workspace dependency, `bun.lock`, Rootage generated version을 다시 검증하고 lane source lifecycle은 실행하지 않는다.
- 사람이 merge한 trusted Version Packages PR만 게시 후보가 된다. npm OIDC 게시, Git tag write, Rootage 게시, durable receipt, Slack 알림은 각자 필요한 최소 권한의 job 또는 workflow로 분리한다.
- generated PR 검증은 candidate branch의 검증 코드를 신뢰하지 않는다. `dev` workflow가 exact ref/SHA, bot·same-repository identity, current control SHA와 허용 파일을 확인하고 commit status를 기록한다.
- 최초 설치는 `mode=dry-run`, `rootageContractReady=false`, `sync.activation=null`인 initial baseline에서 시작한다. `enable-rootage-contract` 뒤 `Release lane bootstrap`으로 exact `dev` baseline의 `minor`·`major`를 만들고, 두 bootstrap PR을 merge한 다음에만 `enable-sync`를 적용한다. 이후 dry-run canary를 완료하고 별도 go 결정 후 `enable-production`을 적용한다. Bootstrap readiness는 `bun tools/release-automation/bin/control.ts bootstrap-readiness`로도 확인할 수 있다.
- 세 레인은 최신 base 반영, `Validate release lane` 필수 검사, 대화 해결을 요구하고 force push와 삭제를 차단한다. 구체적인 사람용 운영 및 복구 절차는 [RELEASING.md](./RELEASING.md)를 따른다.

---

## 환경 변수

| 변수 | 설명 | 필수 |
|------|------|------|
| `FIGMA_ACCESS_TOKEN` | Figma API 토큰 | `figma:sync` 시 |

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
| `ecosystem/qvism/` | `bun test ecosystem/qvism` |
| `docs/` | `bun docs:test` |
| 전체 | `bun test:all` |

`bun test:all`은 `test:unit`(루트 `bun test`에서 `packages/lynx-react`만 제외)과 `test:lynx-react`(typecheck + vitest)를 합친 것이다. `bun rootage:test`가 함께 실행하는 `bun rootage:validate`는 여기 포함되지 않으므로, rootage YAML을 수정했으면 `bun rootage:test`를 따로 돌린다.

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
- `bun release` - 배포

### 릴리즈 레인 자동화

- `dev`는 patch stable, `minor`는 minor pre-release, `major`는 major pre-release 레인이다.
- 레인 정책은 `.github/release/lanes.json`, 운영 모드와 승격 freeze는 `.github/release/control.json`에서 관리한다. 각 파일은 같은 디렉토리의 Draft 2020-12 JSON Schema를 `$schema`로 참조한다.
- 일반 PR은 read-only 검증만 수행하고 Version Packages PR의 사람 merge만 게시 승인이 된다.
- `minor`·`major`의 `enter`·`retag`·`exit`와 stable 승격은 보호 브랜치를 직접 수정하지 않고 PR로 수행한다.
- 레인 동기화는 원본 일반 PR의 최종 diff만 target별 FIFO로 전달하며, 충돌이나 사람 수정이 있으면 자동 merge를 중단한다.
- `control.json`의 기본값은 `dry-run`이다. DES-2201의 불변 Rootage 게시 계약과 bootstrap E2E가 완료되기 전에는 production으로 전환하지 않는다.
- 레인 bootstrap은 Daangn Bud 도입 전까지 `Contents: write`만 가진 임시 fine-grained PAT를 `RELEASE_BOOTSTRAP_TOKEN` 저장소 시크릿으로 받아 `minor`·`major` 브랜치만 생성한다.
- `dev`·`minor`·`major`의 branch protection은 bootstrap 실행 후 저장소 관리자가 수동으로 설정한다. 세 레인 모두 최신 base 반영, `Validate release lane` 필수 검사, 대화 해결을 요구하고 force push와 삭제를 차단한다.

---

## 환경 변수

| 변수 | 설명 | 필수 |
|------|------|------|
| `FIGMA_ACCESS_TOKEN` | Figma API 토큰 | `figma:sync` 시 |

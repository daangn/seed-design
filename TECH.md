# SEED Design - 기술 상세

## 기술 스택

- 런타임/패키지 관리: Bun
- UI 라이브러리: React
- 타입 시스템: TypeScript
- 패키지 빌드: bunchee, vite
- 문서 플랫폼: Next.js, Fumadocs, Storybook
- 린트/포맷: Biome

버전 정보는 문서에 중복 기재하지 않는다. 버전 확인은 루트 `package.json`과 각 워크스페이스의 `package.json`을 단일 소스로 사용한다.

## 서브 시스템 기술 상세

- 문서 사이트 AI Agent 런타임(오케스트레이션/툴 승인/MCP 폴백): `docs/TECH.md`

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

| 명령어 | 설명 |
|--------|------|
| `bun headless:test` | react-headless 테스트 |
| `bun react:test` | react 패키지 테스트 |
| `bun test:all` | 전체 테스트 |

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

---

## 환경 변수

| 변수 | 설명 | 필수 |
|------|------|------|
| `FIGMA_ACCESS_TOKEN` | Figma API 토큰 | `figma:sync` 시 |

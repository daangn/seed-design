# SEED Design - 기술 상세

## 기술 스택

- 런타임/패키지 관리: Bun
- UI 라이브러리: React
- 타입 시스템: TypeScript
- 패키지 빌드: bunchee, vite
- 문서 플랫폼: Next.js, Fumadocs, Storybook
- 린트/포맷: Biome

버전 정보는 문서에 중복 기재하지 않는다. 버전 확인은 루트 `package.json`과 각 워크스페이스의 `package.json`을 단일 소스로 사용한다.
이 문서는 기술 스택·코드 규칙·생성·검증 명령을 다룬다. 패키지 의존성과 작업 시작 경로는 [`ARCHITECTURE.md`](ARCHITECTURE.md)를 먼저 참고한다.

## 공통 규칙

### TypeScript

- 새 코드에서는 `any`와 `as unknown`을 사용하지 않는다. 기존 예외를 unrelated 변경에서 일괄 정리하지 않는다.
- 타입 import에는 `type` 키워드를 사용한다.
- 정적 import를 기본으로 하되 lazy loading, plugin 경계, 런타임 선택이 필요한 경우 동적 import를 허용한다.

### 테스트 작성

- 생성기·변환기가 만든 문자열은 조각(`toContain`)이 아니라 전체 일치로 검증한다. 조각 단언은 헤더가 빠지거나 행이 누락돼도 통과한다.
- 배열 멤버십(`expect(ids).toContain(id)`)은 `toContain`이 올바른 매처다. 위 규칙은 문자열 부분 일치에만 적용된다.
- 생성물이나 외부 패키지 데이터를 유닛 테스트의 입력으로 쓰지 않는다. 그 데이터가 바뀌면 검증 대상이 멀쩡해도 테스트가 깨진다. 순수 함수를 export해 합성 입력으로 검증하고, 실데이터를 지나는 테스트는 데이터에 묶이지 않는 파생값(섹션 목록 등)만 전체 일치로 본다.
- 유닛 테스트에서 네트워크를 타지 않는다. 모듈 스코프에서 비동기 초기화를 발사하면 그 모듈을 import하는 모든 테스트가 함께 요청을 보낸다.

### 패키지 관리

- 패키지 매니저는 항상 `bun`을 사용한다. 의존성 추가·변경은 `bun add`로 수행하고 lockfile을 수동 편집하지 않는다.
- `package.json`의 script·metadata 변경은 해당 패키지의 기존 구조와 release 규칙을 먼저 확인한다.

### 생성물 경계

- 생성물 경계와 원천·출력 관계는 [`ARCHITECTURE.md`](ARCHITECTURE.md)와 `.gitattributes`를 기준으로 한다.
- 대표 생성물은 `packages/css/vars/`, `packages/css/recipes/`, `packages/lynx-css/`, `packages/qvism-preset/src/vars/`다.
- 위 생성물에 영향을 주는 원천을 수정했을 때만 원천 파일을 수정하고 필요한 생성 명령을 실행한다.

---


## 주요 명령어

### 빌드/생성

| 명령어 | 설명 |
|--------|------|
| `bun generate:all` | rootage → qvism → Lynx → docs 전체 생성 |
| `bun rootage:generate` | Rootage schema·JSON·타입 생성 |
| `bun qvism:generate` | 웹·Lynx Recipe CSS 생성 |
| `bun lynx:generate` | Lynx React와 Tailwind plugin 빌드 |
| `bun packages:build` | 모든 패키지 빌드 |
| `bun headless:build` | react-headless family 빌드 |

### 테스트

수정한 경로에 해당하는 테스트만 돌린다. 전체 실행은 커밋 직전 한 번이면 충분하다.

| 수정 경로 | 명령어 |
|-----------|--------|
| `packages/react-headless/*/` | `bun headless:test` |
| `packages/react/` | `bun react:test` |
| `packages/lynx-react/` | `bun test:lynx-react` |
| `packages/cli/` | `bun test packages/cli` |
| `packages/rootage/`, `ecosystem/rootage/` | `bun rootage:test` |
| `tools/rootage-cdn/` | `bun --filter @seed-design/rootage-cdn test && bun --filter @seed-design/rootage-cdn typecheck && WRANGLER_LOG_PATH=/tmp/wrangler-rootage-dry-run.log bun --filter @seed-design/rootage-cdn wrangler:dry-run` |
| `ecosystem/qvism/` | `bun test ecosystem/qvism` |
| `docs/` | `bun docs:test` |
| 전체 | `bun test:all` |

`bun test:all`은 `test:unit`(루트 `bun test`에서 `packages/lynx-react`만 제외)과 `test:lynx-react`(typecheck + vitest)를 합친다. Rootage YAML을 수정하면 `bun rootage:test`가 validation과 Rootage 테스트를 함께 실행한다.

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

### 단일 컴포넌트 (ActionChip 등)

```typescript
import { actionChip, type ActionChipVariantProps } from "@seed-design/css/recipes/action-chip";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import type * as React from "react";
import { createRecipeContext } from "../../utils/createRecipeContext";

const { withContext } = createRecipeContext(actionChip);

interface ActionChipProps
  extends ActionChipVariantProps,
    PrimitiveProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const ActionChip = withContext<HTMLButtonElement, ActionChipProps>(Primitive.button);
ActionChip.displayName = "ActionChip";
```

### 복합 컴포넌트 (Accordion 등)

```typescript
import { accordion } from "@seed-design/css/recipes/accordion";
import { Accordion as AccordionPrimitive } from "@seed-design/react-accordion";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";

const { withProvider, withContext } = createSlotRecipeContext(accordion);

export const AccordionRoot = withProvider(AccordionPrimitive.Root, "root");
export const AccordionItem = withContext(AccordionPrimitive.Item, "item");
```

---

## 버전 관리

- **Changesets** 사용: `.changeset/` 디렉토리
- `bun changeset` - 변경사항 기록
- `bun version` - 버전·잠금파일을 업데이트하고 같은 Version Packages commit에 Rootage JSON 생성. Rootage package 범위만 생성하며 각 패키지의 `package.json`·`CHANGELOG.md`, changeset, lockfile, `packages/rootage/__generated__/**` 밖의 변경은 거부
- `bun release` - 패키지 빌드 및 npm 배포
- PR에서 `/snapshot` - `pkg.pr.new` 패키지 snapshot을 게시하고 `packages/rootage/**` 변경이 있으면 exact PR head용 Rootage CDN URL도 생성. snapshot은 stable 포인터를 변경하지 않으며 PR 종료 30일 뒤 정리

### 릴리스 브랜치 Fast-forward

- `minor → dev`, `major → dev` PR에서 저장소 쓰기 권한이 있는 사용자가 `/ff-merge` 댓글을 남기면 `dev`를 PR head로 fast-forward한다.
- GitHub의 rebase merge를 사용하지 않는다. 기존 커밋과 SHA를 유지한 채 `dev` ref만 `force: false`로 갱신한다.
- PR이 열려 있고 초안이 아니며 두 브랜치가 갈라지지 않은 경우에만 실행한다. 실행 중 SHA가 바뀌면 병합하지 않고 최신 상태에서 다시 실행하도록 안내한다.
- 실행 결과와 이전·이후 SHA는 GitHub Actions Summary에서 확인한다. 실패한 경우 명령 댓글의 👎 반응과 PR 댓글에서도 원인을 확인할 수 있다.

---

## 환경 변수

| 변수 | 설명 | 필수 |
|------|------|------|
| `FIGMA_FILE_KEY` | Figma 파일 식별자 | `figma:sync` 시 |
| `FIGMA_PERSONAL_ACCESS_TOKEN` | Figma API 토큰 | `figma:sync` 시 |

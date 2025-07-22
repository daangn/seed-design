# SEED Design

## Project Overview

- [Deepwiki SEED Design](https://deepwiki.com/daangn/seed-design)

## Rootage

- [About Rootage](https://deepwiki.com/search/rootage_9d36bf39-1737-4d41-9e92-07fa3134aad0)

## Component Creation Process

새로운 컴포넌트를 제작할 때 다음 단계를 따라주세요:

### (선택) 0. Headless 작성
- **Path**: `@packages/react-headless/[component]`
- **Description**: 컴포넌트의 데이터 로직 구현
- **Note**: 컴포넌트의 데이터 로직 구현이 필요하지 않고, 단순 UI 컴포넌트인 경우 headless 작성 필요 없음

### 1. Rootage 컴포넌트 정의
- **Path**: `@packages/rootage/components/[component].yaml`
- **Description**: 컴포넌트의 스키마, 슬롯, variants 정의
- **Schema**: JSON schema를 따라 slots, properties, definitions 작성

### 2. 타입 및 스타일 생성
- **Command**: `bun generate:all`
- **Description**: rootage 정의를 바탕으로 TypeScript 타입과 CSS 생성

### 3. Qvism Preset Recipe 작성
- **Path**: `@packages/qvism-preset/src/recipes/[component].ts`
- **Description**: 컴포넌트 스타일 recipe 정의
- **Note**: recipes.ts에 새 recipe 추가 필요

### 4. React 컴포넌트 구현
- **Path**: `@packages/react/src/components/[Component]/`
- **Files**:
  - `[Component].tsx`: 메인 컴포넌트
  - `index.ts`: 익스포트 설정
- **Export**: `components/index.ts`에 추가
- **Architecture**: 
  - **단일 컴포넌트**: `createRecipeContext` 사용 (Button, Badge 등)
  - **복합 컴포넌트**: `createSlotRecipeContext` 사용 (TextField, Chip 등)
  - **다중 슬롯**: Root, Label, PrefixIcon 등 개별 컴포넌트로 분리
  - **Children 파싱**: 복합 컴포넌트는 자동으로 children을 적절한 슬롯으로 분배

### 5. Registry UI 컴포넌트
- **Path**: `@docs/registry/ui/[component].tsx`
- **Description**: 문서 사이트에서 사용할 컴포넌트 snippet
- **Pattern**: 복합 컴포넌트의 경우 사용자 친화적 API 제공 (Button, Toggle 등)
- **Implementation**: 내부적으로 Root + Label 조합 사용, children 자동 파싱

### (선택) 5-1. docs/registry/registry-ui.ts 업데이트
- **Path**: `@docs/registry/registry-ui.ts`
- **Description**: snippet 업데이트 시 필요, CLI에서 사용하는 파일

### 6. 예시 컴포넌트들
- **Path**: `@docs/components/example/[component]-*.tsx`
- **Examples**: preview, size variations, variants, usage patterns

### 7. React 문서 작성
- **Path**: `@docs/content/react/components/[component].mdx`
- **Content**: installation, props, examples, migration guide

### 8. Design 문서 작성
- **Path**: `@docs/content/design/components/[component].mdx`
- **Content**: 컴포넌트 Spec 작성

### 9. Storybook 컴포넌트 추가
- **Path**: `@docs/components/storybook/[component].stories.tsx`
- **Description**: 스토리북에서 사용할 컴포넌트 스토리 정의

### 10. Figma 통합 핸들러 업데이트
- **Path**: `@packages/figma/src/codegen/targets/react/component/handlers/[component].ts`
- **Description**: Figma Codegen 컴포넌트 핸들러 업데이트
- **Note**: 컴포넌트 세트 업데이트 시 필요

## Important Instruction Reminders

- Do what has been asked; nothing more, nothing less.
- NEVER create files unless they're absolutely necessary for achieving your goal.
- ALWAYS prefer editing an existing file to creating a new one.
- NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.

### 🚫 NEVER DIRECTLY EDIT GENERATED FILES

The following files are auto-generated from source definitions and should NEVER be manually edited:

**Generated from Rootage definitions (`bun generate:all`):**
- `@packages/qvism-preset/src/vars/component/*.d.ts` - Generated TypeScript definitions
- `@packages/qvism-preset/src/vars/component/*.mjs` - Generated JavaScript modules  
- `@packages/css/recipes/*.d.ts` - Generated CSS recipe TypeScript definitions
- `@packages/css/recipes/*.mjs` - Generated CSS recipe JavaScript modules
- `@packages/css/recipes/*.css` - Generated CSS styles
- `@packages/css/vars/component/*.d.ts` - Generated component variable definitions
- `@packages/css/vars/component/*.mjs` - Generated component variable modules
- `@packages/rootage/components/schema.json` - Generated JSON schema

**Instead, edit the source files:**
- Edit `@packages/rootage/components/[component].yaml` to change component definitions
- Edit `@packages/qvism-preset/src/recipes/[component].ts` to change styling recipes
- Run `bun generate:all` to regenerate the files

**Why this matters:**
- Generated files will be overwritten on next generation
- Changes will be lost and can cause inconsistencies
- Source of truth should always be the rootage YAML definitions

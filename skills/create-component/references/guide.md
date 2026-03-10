# Create Component

컴포넌트 개발의 전체 흐름을 단계별로 안내합니다.

## Quick Start

1. Rootage 스펙을 정의/수정하고 `bun generate:all`을 실행합니다.
2. Recipe, React UI, Storybook, 문서를 순서대로 반영합니다.
3. `bun packages:build`, `bun typecheck`, Visual Test 체크리스트를 완료합니다.
4. 상세 구현은 `references/implementation-steps.md`와 `references/verification-checklist.md`를 사용합니다.

## 핵심 흐름

```text
Headless (선택) → Rootage YAML → bun generate:all → Recipe → React → Storybook → Docs → Visual Test
```

## 수정 진입점

| 수정 대상 | 시작 위치 | 명령어 |
|----------|----------|--------|
| 토큰/스타일 변수 | `packages/rootage/` | `bun generate:all` |
| CSS Recipe | `packages/qvism-preset/src/recipes/` | `bun qvism:generate` |
| 컴포넌트 로직 | `packages/react-headless/` | 직접 수정 |
| 컴포넌트 UI | `packages/react/` | `bun packages:build` |
| 문서 | `docs/content/` | 직접 수정 |

## 컴포넌트 개발 필수 규칙

컴포넌트를 제작하거나 수정할 때 반드시 아래 규칙을 따른다.

- **snippet 레이어 최소 변경**: `docs/registry/ui/`의 snippet 레이어 변경은 최소한으로 한다. snippet은 사용자가 직접 커스터마이징하는 레이어이므로, 불필요한 변경은 사용자 코드에 영향을 줄 수 있다.
- **`@seed-design/react-utils` 적극 활용**: `packages/react` 레이어에서 구현할 때는 `@seed-design/react-utils`의 유틸리티를 적극 사용한다. 중복 구현을 피하고 일관성을 유지하기 위함이다.

## 생성 파일 (수정 금지)

- `packages/css/**` ← rootage에서 생성
- `packages/qvism-preset/src/vars/**` ← rootage에서 생성
- `docs/registry/*.json` ← registry-*.ts에서 생성

## 전체 파이프라인

```text
┌─────────────────────────────────────────────────────────────┐
│  1. HEADLESS (Optional) - packages/react-headless/          │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  2. DEFINITION - packages/rootage/components/[name].yaml    │
└─────────────────────────────────────────────────────────────┘
                           │ bun generate:all
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  3. RECIPE - packages/qvism-preset/src/recipes/             │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  4. UI - packages/react/src/components/[ComponentName]/     │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  5. STORYBOOK - docs/stories/[ComponentName].stories.tsx    │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  6. DOCUMENTATION - docs/content/                           │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  7. VISUAL TESTING - Agent Browser                          │
└─────────────────────────────────────────────────────────────┘
```

## Quick Reference

### 새 컴포넌트 추가 시

1. `packages/rootage/components/[name].yaml` 작성
2. `bun generate:all` 실행
3. `packages/qvism-preset/src/recipes/[name].ts` 작성
4. `packages/qvism-preset/src/recipes/index.ts`에 export 추가
5. `packages/react/src/components/[Name]/` 구현
6. `docs/stories/[Name].stories.tsx` 작성
7. `docs/content/react/components/[name].mdx` 작성
8. Visual Test 실행

### 스타일 수정 시

1. `packages/rootage/` 또는 `packages/qvism-preset/src/recipes/` 수정
2. `bun generate:all` 실행
3. Visual Test로 확인

## 상세 가이드

각 단계의 상세 내용은 `references/` 폴더 참조:
- `references/implementation-steps.md` - 각 단계별 구현 상세
- `references/visual-testing.md` - Visual Test 방법
- `references/verification-checklist.md` - 완료 전 체크리스트

## 필수 체크리스트

작업 완료 전:
- [ ] `bun generate:all` 실행
- [ ] `bun packages:build` 성공
- [ ] `bun typecheck` 에러 없음
- [ ] Storybook 테마별 확인 (Light, Dark, Font Scaling)

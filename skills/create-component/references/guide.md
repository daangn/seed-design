# Create Component

컴포넌트 개발의 전체 흐름을 단계별로 안내합니다.

## Quick Start

1. **Platform Gate**: `references/platform-gate.md`로 target platform을 `react` / `lynx` / `cross-platform` 중 하나로 확정합니다.
2. **Phase 0**: `references/architecture-decisions.md`를 완성하여 카테고리와 플랫폼별 패턴을 확정합니다.
3. **Phase 1**: Rootage → platform recipe → styled UI → snippet/docs/example 순서로 구현합니다.
4. **Phase 2**: `bun generate:all`, `bun test:all`, `bun docs:test`와 필요한 개별 build를 완료합니다.
5. 상세 구현은 `references/implementation-steps.md`와 `references/verification-checklist.md`를 사용합니다.

## 핵심 흐름

```text
Platform Gate → Architecture Analysis → Headless (선택) → Rootage YAML → bun generate:all → Recipe → Styled UI → Snippet → Docs/Examples → Visual Test
```

## 카테고리별 Quick Reference

| 카테고리 | Recipe | Styled UI 패턴 | Namespace | React 참조 | Lynx 참조 |
|----------|--------|----------------|-----------|-----------|-----------|
| A. Simple | defineRecipe | splitVariantProps | 없음 | Badge | ActionButton/Text |
| B. Compound (Stateless) | defineSlotRecipe | slot context | 있음 | Avatar | TagGroup |
| C. Compound (Stateful) | defineSlotRecipe | headless + styled wrapper | 있음 | TextField | BottomSheet |
| D. Multi-Recipe | defineSlotRecipe ×2 | splitMultipleVariantsProps | 있음 | Checkbox | Checkbox/Switch |
| E. Layout | 없음 | Box 확장 | 없음 | Flex | Box/Stack |

카테고리 결정 방법은 `references/architecture-decisions.md`를 참조합니다.

## 수정 진입점

| 수정 대상 | React 시작 위치 | Lynx 시작 위치 | 명령어 |
|----------|----------------|---------------|--------|
| 토큰/스타일 변수 | `packages/rootage/` | `packages/rootage/` | `bun generate:all` |
| Recipe source | `packages/qvism-preset/src/recipes/` | `packages/lynx-qvism-preset/src/recipes/` | `bun qvism:generate` |
| Headless/state | `packages/react-headless/` | `packages/lynx-headless/` 또는 styled-local | package build/test |
| Styled UI | `packages/react/src/components/` | `packages/lynx-react/src/components/` | `bun packages:build` |
| Snippet | `docs/registry/react/ui/` | `docs/registry/lynx/ui/` | docs registry generate |
| 문서 | `docs/content/react/` | `docs/content/lynx/` | `bun docs:test` |

## 생성 파일 (수정 금지)

- `packages/css/**` ← rootage에서 생성
- `packages/qvism-preset/src/vars/**` ← rootage에서 생성
- `packages/lynx-css/**` ← rootage/lynx-qvism에서 생성
- `packages/lynx-qvism-preset/src/vars/**` ← rootage에서 생성
- `docs/public/__registry__/**` ← docs registry script에서 생성

## 전체 파이프라인

```text
┌─────────────────────────────────────────────────────────────┐
│  1. HEADLESS (Optional) - react-headless or lynx-headless   │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  2. DEFINITION - packages/rootage/components/[name].yaml    │
└─────────────────────────────────────────────────────────────┘
                           │ bun generate:all
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  3. RECIPE - qvism-preset or lynx-qvism-preset              │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  4. UI - packages/react or packages/lynx-react              │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  5. EXAMPLE - Storybook or examples/lynx-spa                │
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

1. target platform 확정 (`react` / `lynx` / `cross-platform`)
2. `packages/rootage/components/[name].yaml` 작성
3. `bun generate:all` 실행
4. React는 `packages/qvism-preset/src/recipes/[name].ts`, Lynx는 `packages/lynx-qvism-preset/src/recipes/[name].ts` 작성
5. target preset entry에 recipe export 추가
6. React는 `packages/react/src/components/[Name]/`, Lynx는 `packages/lynx-react/src/components/[Name]/` 구현
7. stateful Lynx에서 필요하면 `packages/lynx-headless/[name]/`를 먼저 설계하고 사용자 확인 후 추가
8. platform snippet/docs/example 작성
9. Visual Test 실행

### 스타일 수정 시

1. `packages/rootage/`, React `packages/qvism-preset/src/recipes/`, Lynx `packages/lynx-qvism-preset/src/recipes/` 중 source 수정
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
- [ ] `bun test:all` 성공
- [ ] `bun docs:test` 성공
- [ ] 변경 범위에 해당하는 build 성공
  - React 패키지 변경: `bun --filter @seed-design/react build` 또는 여러 패키지 변경 시 `bun packages:build`
  - Lynx 패키지 변경: `bun --filter @seed-design/lynx-react typecheck`와 `bun --filter @seed-design/lynx-react test`가 있으면 실행
  - React snippet/example 변경: vendored consumer build (예: `bun --cwd examples/stackflow-spa build`)
  - Lynx snippet/example 변경: `bun --filter lynx-spa build`
- [ ] React: Storybook 테마별 확인 (Light, Dark, Font Scaling)
- [ ] Lynx: `examples/lynx-spa` page/catalog 확인

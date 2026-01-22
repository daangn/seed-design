---
name: component-flow-guide
description: 컴포넌트 개발 흐름 가이드. rootage 정의부터 문서, 테스트까지 전체 파이프라인을 안내합니다.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Component Flow Guide

컴포넌트 개발의 전체 흐름을 단계별로 안내합니다.

## 핵심 흐름

```
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

## 생성 파일 (수정 금지)

- `packages/css/**` ← rootage에서 생성
- `packages/qvism-preset/src/vars/**` ← rootage에서 생성
- `docs/registry/*.json` ← registry-*.ts에서 생성

## 전체 파이프라인

```
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

각 단계의 상세 내용은 `details/` 폴더 참조:
- `details/implementation-steps.md` - 각 단계별 구현 상세
- `details/visual-testing.md` - Visual Test 방법
- `details/verification-checklist.md` - 완료 전 체크리스트

## 필수 체크리스트

작업 완료 전:
- [ ] `bun generate:all` 실행
- [ ] `bun packages:build` 성공
- [ ] `bun typecheck` 에러 없음
- [ ] Storybook 테마별 확인 (Light, Dark, Font Scaling)

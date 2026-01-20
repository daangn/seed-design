---
name: generated-files-guard
description: 자동 생성 파일 보호 가이드. 수정 금지 파일 목록과 올바른 수정 방법을 안내합니다.
allowed-tools: Read, Glob, Grep
---

# Generated Files Guard

자동 생성되는 파일들을 보호하고 올바른 수정 방법을 안내합니다.

## Purpose

SEED Design은 DRY 원칙을 따라 많은 파일이 자동 생성됩니다. 이 스킬은 생성 파일을 식별하고, 잘못된 수정을 방지하며, 올바른 수정 경로를 안내합니다.

## When to Use

다음 상황에서 이 스킬을 사용하세요:

1. **파일 수정 전**: 해당 파일이 생성 파일인지 확인
2. **빌드 에러**: 생성 파일 관련 오류 해결
3. **코드 리뷰**: PR에 생성 파일 수정이 포함되었는지 확인
4. **워크플로우 학습**: 올바른 수정 순서 파악

**트리거 키워드**: "생성 파일", "generated", "수정 금지", "vars.ts", "자동 생성"

## Generated Files List

### 절대 수정 금지 (Critical)

| 패턴 | 소스 위치 | 재생성 명령어 |
|------|----------|--------------|
| `packages/css/**/*.ts` | `packages/rootage/` | `bun generate` |
| `packages/css/**/*.css` | `packages/rootage/` | `bun generate` |
| `packages/css/**/vars.ts` | `packages/rootage/` | `bun generate` |
| `**/dist/**` | 해당 패키지 소스 | `bun build` |
| `**/__generated__/**` | 다양한 소스 | 해당 스크립트 |

### 주의 필요 (Warning)

| 패턴 | 설명 |
|------|------|
| `docs/registry/*.json` | `bun generate:registry`로 생성, 수동 수정 가능하나 비권장 |
| `*.d.ts` | 타입 선언 파일, 빌드로 생성되는 경우 많음 |
| `pnpm-lock.yaml` | 자동 생성, 직접 수정 금지 |

## Source → Generated Mapping

### CSS 생성 흐름

```
[소스]                              [생성물]
packages/rootage/                   packages/css/
├── components/button/              ├── components/button/
│   ├── metadata.yaml       →       │   ├── vars.ts ⚠️
│   ├── ui-spec.yaml        →       │   └── style.css ⚠️
│   └── props.yaml                  │
└── tokens/                         └── tokens/
    └── color.yaml          →           └── vars.ts ⚠️
```

### 빌드 생성 흐름

```
[소스]                              [생성물]
packages/react/button/              packages/react/button/
└── src/                            └── dist/ ⚠️
    └── Button.tsx          →           ├── Button.js
                                        ├── Button.d.ts
                                        └── index.js
```

## Correct Modification Flow

### CSS 변수 수정하고 싶을 때

```
❌ 잘못된 방법:
packages/css/components/button/vars.ts 직접 수정

✅ 올바른 방법:
1. packages/rootage/components/button/ui-spec.yaml 수정
2. bun generate 실행
3. packages/css/components/button/vars.ts 자동 업데이트됨
```

### 토큰 값 수정하고 싶을 때

```
❌ 잘못된 방법:
packages/css/tokens/vars.ts 직접 수정

✅ 올바른 방법:
1. packages/rootage/tokens/*.yaml 수정
2. bun generate 실행
3. 토큰 파일 자동 업데이트됨
```

### dist 파일 문제 해결

```
❌ 잘못된 방법:
dist/ 폴더 내 파일 직접 수정

✅ 올바른 방법:
1. src/ 내 소스 파일 수정
2. bun build 실행
3. dist/ 자동 업데이트됨
```

## Detection Patterns

### 생성 파일 식별 방법

1. **파일 헤더 확인**
```typescript
// This file is auto-generated. Do not edit manually.
// Generated from: packages/rootage/...
```

2. **경로 패턴 확인**
```
packages/css/     → 대부분 생성 파일
**/dist/          → 빌드 생성물
**/__generated__/ → 명시적 생성 폴더
```

3. **git blame 확인**
```bash
# 최근 커밋이 "generate" 관련이면 생성 파일
git log --oneline -1 packages/css/components/button/vars.ts
```

## Pre-commit Checklist

PR 제출 전 확인:

- [ ] `packages/css/` 파일 직접 수정 없음
- [ ] `**/vars.ts` 파일 직접 수정 없음 (rootage 제외)
- [ ] `**/dist/` 파일 포함 없음
- [ ] rootage 수정 시 `bun generate` 실행됨
- [ ] 생성 파일과 소스 파일이 동기화됨

## Error Recovery

### 실수로 생성 파일을 수정했을 때

```bash
# 1. 변경 사항 확인
git status

# 2. 생성 파일 변경 되돌리기
git checkout -- packages/css/

# 3. 소스에서 재생성
bun generate
```

### 생성 파일과 소스가 불일치할 때

```bash
# 1. 소스 기준으로 재생성
bun generate

# 2. 변경 사항 확인
git diff packages/css/

# 3. 필요시 커밋
git add packages/css/
git commit -m "chore: regenerate css from rootage"
```

## Quick Reference

| 수정하고 싶은 것 | 수정할 파일 | 실행할 명령어 |
|-----------------|------------|--------------|
| CSS 변수 | `rootage/components/*/ui-spec.yaml` | `bun generate` |
| 토큰 값 | `rootage/tokens/*.yaml` | `bun generate` |
| 컴포넌트 Props | `rootage/components/*/props.yaml` | `bun generate` |
| React 로직 | `react-headless/*/src/` | 직접 수정 |
| React UI | `react/*/src/` | 직접 수정 |
| 문서 | `docs/content/` | 직접 수정 |
| 레지스트리 | `docs/registry/*.ts` | `bun generate:registry` |

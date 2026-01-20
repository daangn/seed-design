---
name: monorepo-context-guide
description: SEED Design 모노레포 컨텍스트 가이드. 현재 작업 폴더 기준으로 연관 패키지와 파일을 빠르게 파악합니다.
allowed-tools: Read, Glob, Grep
---

# Monorepo Context Guide

현재 작업 위치에서 연관된 패키지와 파일들을 빠르게 파악하는 가이드입니다.

## Purpose

SEED Design은 여러 패키지가 상호 의존하는 모노레포입니다. 이 스킬은 현재 작업 중인 파일/폴더 기준으로 연관된 모든 패키지와 파일을 파악하여 컨텍스트를 제공합니다.

## When to Use

다음 상황에서 이 스킬을 사용하세요:

1. **새 작업 시작**: 어떤 컴포넌트/패키지를 수정하기 전 관련 파일 파악
2. **디버깅**: 문제가 어느 레이어에서 발생했는지 추적
3. **의존성 이해**: 특정 변경이 어디에 영향을 미치는지 파악
4. **코드 리뷰**: PR의 변경 범위가 적절한지 확인

**트리거 키워드**: "모노레포", "패키지 구조", "연관 파일", "의존성", "컨텍스트"

## Package Hierarchy

```
[1. Definitions - 진실의 원천]
packages/rootage/          # 컴포넌트 정의 (YAML)
packages/qvism-preset/     # 토큰 변환 프리셋

[2. Generated - 자동 생성]
packages/css/              # rootage에서 생성된 스타일 ⚠️ 수정금지

[3. Libraries - 구현]
packages/react-headless/   # 스타일 없는 로직
packages/react/            # 스타일 포함 UI
packages/stackflow/        # stackflow 통합

[4. Integrations - 외부 연동]
packages/figma/            # Figma 라이브러리
packages/mcp/              # MCP 서버
packages/docs-mcp/         # 문서 MCP

[5. Ecosystem - CLI 도구]
ecosystem/rootage/         # rootage CLI
ecosystem/qvism/           # qvism CLI
ecosystem/figma-extractor/ # Figma 추출기
```

## Component File Mapping

특정 컴포넌트(예: `action-button`)의 관련 파일들:

```
action-button 관련 파일

[정의 - 소스]
packages/rootage/components/action-button/
├── metadata.yaml          # 메타데이터
├── ui-spec.yaml           # UI 스펙
└── props.yaml             # Props 정의

[스타일 - 생성물] ⚠️ 직접 수정 금지
packages/css/components/action-button/
├── vars.ts                # CSS 변수
└── style.css              # 스타일

[로직]
packages/react-headless/action-button/
└── src/
    ├── ActionButton.tsx   # 컴포넌트
    └── useActionButton.ts # 훅

[UI]
packages/react/action-button/
└── src/
    ├── ActionButton.tsx   # 스타일 적용된 컴포넌트
    └── ActionButton.css   # 추가 스타일

[문서]
docs/content/docs/components/action-button.mdx  # 가이드라인
docs/content/react/components/action-button.mdx # React 문서
docs/components/example/react/action-button/    # 예제
```

## Quick Reference Commands

### 컴포넌트 관련 파일 찾기

```bash
# 특정 컴포넌트의 모든 파일
find . -path "**/[component-name]/**" -type f | grep -v node_modules

# Rootage 정의 확인
ls packages/rootage/components/[component-name]/

# CSS 생성물 확인
ls packages/css/components/[component-name]/
```

### 패키지 의존성 확인

```bash
# 특정 패키지를 사용하는 곳
grep -r "@seed-design/[package]" --include="package.json"

# 특정 컴포넌트 import 추적
grep -r "from.*[component-name]" packages/*/src/
```

## Context Checklist

작업 시작 전 확인 사항:

- [ ] 현재 작업 파일이 어느 레이어인지 확인
- [ ] 생성 파일 여부 확인 (packages/css/ 등)
- [ ] 상위 정의 파일 위치 확인 (rootage)
- [ ] 하위 의존 패키지 확인 (react, docs)
- [ ] 관련 문서 위치 확인

## Layer-specific Rules

### packages/rootage/ 수정 시

```
변경 후 필수 작업:
1. bun generate (CSS 재생성)
2. 관련 react 컴포넌트 확인
3. 문서 업데이트 필요 여부 확인
```

### packages/react-headless/ 수정 시

```
확인 사항:
1. @seed-design/react에서 사용 중인지
2. data-* 속성 변경 시 CSS 영향
3. API 변경 시 문서 업데이트
```

### packages/react/ 수정 시

```
확인 사항:
1. headless 레이어 API 변경 필요 여부
2. CSS 변수 사용 확인
3. 예제 코드 업데이트
```

### docs/ 수정 시

```
확인 사항:
1. 실제 컴포넌트 API와 일치 여부
2. 예제 코드 동작 확인
3. bun generate:registry 실행 필요 여부
```

## Anti-patterns

### 잘못된 접근

```
❌ packages/css/ 파일 직접 수정
   → rootage 수정 후 generate

❌ 여러 레이어 동시 변경 (rootage + react)
   → 순서대로: rootage → generate → react

❌ 문서만 수정하고 코드는 그대로
   → 코드와 문서 동기화 필수
```

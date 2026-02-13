---
name: deprecation
description: Manage deprecation lifecycle for components, interfaces, and tokens with versioned notices, replacement guidance, migration docs, and removal tracking. Use when deprecating, migrating, or removing API/spec options.
---

# Deprecation Flow

SEED Design의 deprecated 라이프사이클을 표준화합니다. 대상 추가, 문서화, 추적, 제거까지의 흐름을 한 번에 관리합니다.

## Quick Start

1. 입력 5개(Target, Deprecated In, Remove In, Replacement, Reason)를 먼저 확정합니다.
2. 코드/JSDoc/문서/마이그레이션 문서(`deprecations.mdx`)를 같은 버전 정보로 맞춥니다.
3. Rootage가 바뀌면 생성 명령을 실행하고 제거 버전 도달 시 실제 삭제까지 마무리합니다.

## Purpose

이 스킬은 컴포넌트/인터페이스/파운데이션을 deprecated 처리할 때 필요한 JSDoc, 문서, 추적 파일을 일관되게 업데이트하도록 돕습니다.

## When to Use

다음 상황에서 이 스킬을 사용하세요:

1. **Deprecated 선언**: 옵션/prop/토큰을 제거 예정으로 표기해야 할 때
2. **제거 일정 수립**: 제거 버전을 명확히 지정해야 할 때
3. **마이그레이션 가이드 작성**: 대체안과 이동 방법을 문서화할 때
4. **제거 작업 실행**: 제거 버전이 도달하여 실제 삭제가 필요할 때

**트리거 키워드**: "deprecated", "deprecate", "removal", "migration", "사용 중단", "제거 예정"

## Deprecation Policy

- 기본 정책: **1.2.x 패치에서 deprecated → 다음 마이너(1.3.0)에서 제거**
- 호환성 영향이 큰 경우: 다음 메이저 릴리스로 미룸

## Required Inputs

- **Target**: deprecated 대상 (컴포넌트/옵션/토큰)
- **Deprecated In**: 적용 버전 (예: 1.2.x)
- **Remove In**: 제거 예정 버전 (예: 1.3.0)
- **Replacement**: 대체안 (예: `borderRadius="r2"`)
- **Reason**: deprecated 이유

입력이 누락된 경우 다음 순서로 사용자에게 질문합니다: Target → Deprecated In → Remove In → Replacement → Reason.

## Workflow

### Step 1: 대상 탐색

- Rootage 스펙: `packages/rootage/components/*.yaml`
- React 구현: `packages/react/src/components/**`
- Design Guidelines: `docs/content/docs/components/**`
- React 문서: `docs/content/react/components/**`
- 예시 코드: `docs/examples/**`, `examples/**`

### Step 2: JSDoc/메타데이터 추가

**TypeScript/TSX 예시**:

```ts
/**
 * @deprecated Deprecated in @seed-design/react@1.2.x; will be removed in 1.3.0.
 * Use borderRadius="r2" instead.
 * Reason: Rounded 옵션을 borderRadius로 통일합니다.
 */
```

**Rootage YAML 예시**:

```yaml
description: |
  모서리를 둥글게 처리합니다.
  @deprecated `rounded` 옵션은 @seed-design/react@1.3.0에서 제거될 예정입니다. `borderRadius="r2"`를 사용하세요.
  Reason: 모서리 스타일은 `borderRadius` prop으로 통일합니다.
```

### Step 3: 문서 업데이트

- Design Guidelines 및 React Docs에 deprecated 안내 추가
- 대체안과 제거 버전을 명확히 표기

### Step 4: Deprecated 원천 파일 갱신

- `docs/content/docs/migration/deprecations.mdx`에 항목 추가
- 제거 버전 도달 시 히스토리 섹션으로 이동

### Step 5: 생성물 업데이트

Rootage 변경이 있는 경우:

```bash
bun run rootage:generate
```

### Step 6: 제거 버전 도달 시

- deprecated 대상 삭제
- 문서/예시/테스트 정리
- `deprecations.mdx` 히스토리 섹션으로 이동

## Files to Touch (Checklist)

- `packages/rootage/components/{component}.yaml`
- `packages/react/src/components/**`
- `docs/content/docs/components/**`
- `docs/content/react/components/**`
- `docs/content/docs/migration/deprecations.mdx`
- 생성물: `docs/public/rootage/**`, `packages/css/vars/**`, `packages/qvism-preset/src/vars/**`

## Output Expectations

1. 모든 JSDoc에 이유, 제거 버전, 대체안이 명확히 포함됨
2. 문서와 Rootage 스펙이 동일한 내용을 반영
3. 원천 파일(deprecations.mdx) 최신화

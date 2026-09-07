# Deprecation Flow

SEED Design의 deprecated 라이프사이클을 표준화합니다. 대상 추가, 문서화, 추적, 제거까지의 흐름을 한 번에 관리합니다.

## Quick Start

1. Target, Deprecated In, Remove In, Replacement, Reason은 현재 변경과 릴리스 계획에서 확인한다. 근거로 확정할 수 없는 값만 한 번에 질문한다.
2. 대상이 공개되는 코드, JSDoc, 문서, 마이그레이션 추적에 같은 버전·대체안을 반영한다.
3. Rootage가 바뀐 경우에만 생성 명령을 실행하고, 제거 버전에 도달한 요청이면 실제 삭제까지 마무리한다.

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

- 기본 정책: **마이너/패치 릴리스에서 deprecated 선언 → 다음 메이저 릴리스에서 제거**
- 2.0.0부터 breaking change(deprecated 항목 제거 포함)는 메이저 릴리스에서만 수행합니다.
- (레거시) 1.x에서는 마이너 릴리스에서 제거했습니다.

## Required Inputs

- **Target**: deprecated 대상 (컴포넌트/옵션/토큰)
- **Deprecated In**: 적용 버전 (deprecated를 선언하는 현재 버전)
- **Remove In**: 제거 예정 버전 (다음 메이저 릴리스)
- **Replacement**: 대체안 (예: `borderRadius="r2"`)
- **Reason**: deprecated 이유

현재 코드·릴리스 계획·문서에서 확정할 수 없는 입력만 한 번에 질문한다. Target, 버전, 대체안, 제거 여부처럼 계약을 바꾸는 추측은 하지 않는다.

## Workflow

### Step 1: 대상 확인

대상 종류에 맞는 원천과 공개 표면만 찾는다.

- Rootage 대상: `packages/rootage/components/*.yaml`
- React 공개 API: `packages/react/src/components/**`
- React Headless 공개 API: `packages/react-headless/*/src/**`와 각 패키지의 `package.json` 공개 진입점
- Lynx 공개 API: `packages/lynx-react/src/components/**`, `packages/lynx-react/src/hooks/**`, `packages/lynx-react/src/index.ts`와 패키지의 `package.json` 공개 진입점
- 공개 안내: 해당 Design Guidelines·React 문서·예시와 Lynx의 `docs/content/lynx/**`, `docs/examples/lynx/**`, `examples/lynx-spa/**`

### Step 2: JSDoc/메타데이터 추가

대상 플랫폼의 공개 선언과 재수출 경로를 확인하고 JSDoc에 실제 소유 패키지의 버전·대체안을 기록한다. React Headless 개별 패키지와 Lynx API를 `@seed-design/react` 소속으로 표기하지 않는다.

**TypeScript/TSX 예시**:

```ts
/**
 * @deprecated Deprecated in @seed-design/react@<current-version>; will be removed in <next-major>.
 * Use borderRadius="r2" instead.
 * Reason: Rounded 옵션을 borderRadius로 통일합니다.
 */
```

**Rootage YAML 예시**:

```yaml
description: |
  모서리를 둥글게 처리합니다.
  @deprecated `rounded` 옵션은 @seed-design/react@<next-major>에서 제거될 예정입니다. `borderRadius="r2"`를 사용하세요.
  Reason: 모서리 스타일은 `borderRadius` prop으로 통일합니다.
```

### Step 3: 공개 안내와 추적 갱신

- 영향을 받는 Design Guidelines·React 문서·예시와 Lynx의 `docs/content/lynx/**`, `docs/examples/lynx/**`, `examples/lynx-spa/**`에 대체안과 제거 버전을 일관되게 반영한다.
- `docs/content/docs/migration/deprecations.mdx`에 항목을 추가하고, 제거 버전에 도달한 요청이면 히스토리 섹션으로 옮긴다.

### Step 4: 생성물 업데이트

Rootage 변경이 있는 경우:

```bash
bun run rootage:generate
```

### Step 5: 제거 버전 도달 시

- 대상 React·React Headless·Lynx의 구현, 공개 export·재수출과 더는 유효하지 않은 문서·예시·테스트를 함께 제거한다. Lynx는 `docs/content/lynx/**`, `docs/examples/lynx/**`, `examples/lynx-spa/**`의 잔여 참조도 확인한다.
- `deprecations.mdx`의 항목을 히스토리 섹션으로 옮긴다.

## 완료 조건

- 대상 React·React Headless·Lynx의 코드/JSDoc, 공개 안내, 추적 파일이 같은 deprecated 버전·제거 버전·대체안을 말한다. Lynx 문서·예시는 `docs/content/lynx/**`, `docs/examples/lynx/**`, `examples/lynx-spa/**`까지 확인한다.
- Rootage를 변경했다면 생성물은 생성 절차로 갱신한다.
- 제거 작업이면 더는 지원하지 않는 공개 진입점·export·재수출, 문서·예시·테스트의 잔여 참조가 남지 않는다.

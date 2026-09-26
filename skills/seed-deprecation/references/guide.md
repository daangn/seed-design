# Deprecation Flow

SEED 컴포넌트·옵션·prop·토큰을 deprecated로 선언하고, 문서화·추적하고, 제거 버전에 도달하면 삭제하는 절차다.

## 정책

- 마이너·패치 릴리스에서 deprecated를 선언하고 다음 메이저 릴리스에서 제거한다.
- 2.0.0부터 deprecated 항목 제거를 포함한 breaking change는 메이저 릴리스에서만 한다. 1.x에서는 마이너 릴리스에서 제거했다.
- changeset bump는 `seed-change`의 [version-matrix.md](../../seed-change/references/version-matrix.md)를 따른다. deprecation 안내만 추가하면 `minor`, 제거는 `major`(Lynx `0.x`는 그 문서의 예외)다.

## 입력

- Target: deprecated 대상(컴포넌트·옵션·prop·토큰)
- Deprecated In: deprecated를 선언하는 현재 버전
- Remove In: 제거 예정 버전(다음 메이저)
- Replacement: 대체안(예: `borderRadius="r2"`)
- Reason: deprecated 이유

현재 변경·릴리스 계획·문서에서 확인한다. 근거로 확정할 수 없는 값만 한 번에 질문한다. Target, 버전, 대체안, 제거 여부처럼 계약을 바꾸는 값은 추측하지 않는다.

## 절차

### 1. 대상 확인

대상 종류에 맞는 원천과 공개 표면만 찾는다.

- Rootage 컴포넌트: `packages/rootage/components/*.yaml`
- Rootage 토큰: `packages/rootage/*.yaml`(예: `packages/rootage/color.yaml`)
- React 공개 API: `packages/react/src/components/**`
- React Headless 공개 API: `packages/react-headless/*/src/**`와 각 패키지 `package.json`의 공개 진입점
- Lynx 공개 API: `packages/lynx-react/src/components/**`, `packages/lynx-react/src/hooks/**`, `packages/lynx-react/src/index.ts`와 패키지 `package.json`의 공개 진입점
- 공개 안내: 해당 Design Guidelines·React 문서·예시, 그리고 아래 Lynx 안내 경로

Lynx 안내 경로는 `docs/content/lynx/**`, `docs/examples/lynx/**`, `examples/lynx-spa/**`다. 이 문서에서 "Lynx 안내 경로"는 이 세 곳을 뜻한다.

### 2. JSDoc·메타데이터 추가

대상 플랫폼의 공개 선언과 재수출 경로를 확인하고, JSDoc `@deprecated`에 실제 소유 패키지의 제거 버전·대체안·이유를 적는다. React Headless 개별 패키지(`@seed-design/react-*`)와 Lynx API를 `@seed-design/react` 소속으로 표기하지 않는다 → 해당 패키지 이름을 쓴다. 기존 예: `packages/react/src/components/SidePanel/SidePanel.tsx`의 `height` prop.

Rootage YAML은 대상에 따라 두 형식을 쓴다.

- 컴포넌트 전체: `metadata.deprecated`에 대체 안내 문자열을 넣는다. 예: `packages/rootage/components/action-chip.yaml`의 `deprecated: Use Chip.Button with variant="solid" instead.`
- 토큰·variant 값: `description`에 `@deprecated`를 쓴다. 예: `packages/rootage/color.yaml`의 `$color.bg.layer-fill`. variant 값의 `description`은 생성된 타입의 JSDoc으로 나간다.

```yaml
description: |
  모서리를 둥글게 처리합니다.
  @deprecated `rounded` 옵션은 @seed-design/react@<next-major>에서 제거될 예정입니다. `borderRadius="r2"`를 사용하세요.
  Reason: 모서리 스타일은 `borderRadius` prop으로 통일합니다.
```

### 3. 공개 안내와 추적 갱신

- 영향을 받는 Design Guidelines·React 문서·예시와 Lynx 안내 경로에 대체안과 제거 버전을 같게 반영한다.
- 컴포넌트 전체를 deprecated하면 기존 선례를 따른다. 문서를 `docs/content/components/(deprecated)/`·`docs/content/react/components/(deprecated)/`로 옮기고 frontmatter `deprecated: true`와 `<Callout type="warn">` 대체 안내를 둔다. 문서 인덱스와 카탈로그가 이 frontmatter를 읽는다. Registry 항목이 있으면 `docs/registry/react/registry-ui.ts`의 항목에 `deprecated: true`를 넣는다.
- `docs/content/docs/migration/deprecations.mdx`가 deprecated 현황의 원천이다. 「Deprecated 현황」에 항목·종류·Deprecated 버전·제거 예정 버전·대체안·비고를 추가한다.

### 4. 생성물 갱신

Rootage YAML이나 `docs/registry/`를 바꿨을 때만 루트 `AGENTS.md`「생성」의 해당 단계를 실행한다. 생성물을 직접 고치지 않는다 → 원천을 고치고 생성 명령으로 갱신한다.

### 5. 제거 버전 도달 시

- 대상 React·React Headless·Lynx의 구현, 공개 export·재수출, 더는 유효하지 않은 문서·예시·테스트를 함께 제거한다. Lynx 안내 경로의 잔여 참조도 확인한다.
- `deprecations.mdx`의 항목을 「제거 완료 히스토리」로 옮기고 제거 버전을 적는다.

## 완료 조건

- 대상 React·React Headless·Lynx의 코드·JSDoc, 공개 안내(Lynx 안내 경로 포함), `deprecations.mdx`가 같은 deprecated 버전·제거 버전·대체안을 말한다.
- Rootage YAML이나 registry를 바꿨으면 생성물은 생성 절차로 갱신했다.
- 제거 작업이면 더는 지원하지 않는 공개 진입점·export·재수출과 문서·예시·테스트의 잔여 참조가 없다.

# 컴포넌트 구현 흐름

신규·포팅, 기존 구현 변경, React 문서·Storybook·생성물 전용 작업의 절차다. reference를 모두 순서대로 읽지 않는다 → 현재 작업에 필요한 것만 [구현 reference 라우팅](#구현-reference-라우팅)에서 고른다.

## 공통 시작

1. [컴포넌트 경로 조회](component-map.md)로 현재 구현, 공개 export, Recipe, Registry, 문서, 예제를 찾는다. 신규 구현은 대상 플랫폼의 구현 유무를 확인하고, 전체 `not-found`와 한 플랫폼만 없는 경우를 구분한다.
2. 결과에 나온 실제 파일을 직접 읽는다. 맵 결과만으로 API나 책임을 추정하지 않는다.
3. React와 Lynx 차이는 [React·Lynx API 비교](api-parity.md)로 확인한다. 차이를 곧바로 누락으로 보지 않고, 브라우저와 Lynx의 런타임·접근성·입력 방식 때문에 의도적으로 다른 항목인지 먼저 분류한다.

참조가 있는 신규 구현·플랫폼 포팅·동작 변경은 파일을 쓰기 전에 [참조 동작 추적과 기본 장면](implementation-steps.md#참조-동작-추적과-기본-장면)을 적용한다.

- 공개 JSX를 넘어 hook·측정·스타일 적용까지 행동을 만드는 원천을 추적한다.
- 기본 장면을 각 플랫폼의 실제 공개 소비 경로에서 먼저 검증한다. Lynx native 기본 장면은 `examples/lynx-spa` 문서 예제로 확인하고, 실행 방법은 [`검증 런북`](../../seed-verify-lynx-component/references/verification.md)을 따른다.
- 단독 작업에도 적용한다. 문구 수정이나 동작을 보존하는 정리 → 전체 절차를 생략한다.

## 기존 구현 변경

1. 경로 조회 결과에서 이번 요청과 직접 연결된 파일을 읽는다.
2. React와 Lynx를 함께 바꾸거나 한쪽 차이가 문제인지 판단해야 하면 [API 비교](api-parity.md)를 실행한다.
3. 바꾸려는 사용자 결과를 한 문장으로 적고 대상 플랫폼과 배포 방식을 확정한다.
4. 구조를 바꿀 때만 [아키텍처 결정](architecture-decisions.md)과 [API 설계](api-design.md)를 읽는다. 스타일·문서만 바꾸면 설계 절차를 건너뛴다.
5. 가장 가까운 기존 파일을 기준으로 필요한 원천만 고친다. 생성물은 루트 `AGENTS.md`「생성」 절차로 갱신한다.
6. [검증 체크리스트](verification-checklist.md)에서 실제 변경과 관련된 항목을 실행한다.
7. [변경 연결](#변경-연결)을 따른다.

## 신규·포팅

1. 경로 조회로 대상 플랫폼의 구현 유무와 가까운 기존 컴포넌트의 경로를 확인한다. 한 플랫폼만 없는 포팅은 전체 맵의 `not-found`를 요구하지 않고, 있는 플랫폼을 동작 참조로 삼는다.
2. 대상 플랫폼을 `react`, `lynx`, `cross-platform` 중 하나로 정한다. 기준은 [플랫폼 선택](platform-gate.md)에 있다.
3. [API 설계](api-design.md)에 따라 배포 방식을 `package-only`, `snippet-only`, `package+snippet`, `docs-only` 중 하나로 정한다.
4. 요구사항에 구현을 바꿀 빈칸이 있을 때만 [요구사항 탐색](brainstorming.md)을 쓴다. 이미 구체적인 요청을 다시 인터뷰하지 않는다.
5. [아키텍처 결정](architecture-decisions.md)에서 Headless 책임, Recipe 종류, 접근성, 레이어별 참조 컴포넌트를 정한다.
6. 확정한 결정을 파일 계획으로 바꾼다. 아래 [파일 계획 읽기](#파일-계획-읽기)를 따른다.
7. 다른 플랫폼의 문서 예제가 있으면 파일을 만들기 전에 `referenceScenarios`의 모든 ID를 `동일 지원`, `Lynx식 변환`, `미지원`으로 분류한 대응 목록을 쓴다. `preview.tsx` 하나가 계획에 있다는 이유로 다른 예제를 범위 밖으로 두지 않는다. Lynx 문서·예제를 포함하면 [Lynx 문서·예제 작업](lynx-docs.md#react-문서와-맞추기)의 asset·frame·초기 상태·입력·전이·화면 셸 대응을 완료 조건으로 삼는다.
8. [구현 순서](implementation-steps.md)에 따라 Headless, Rootage, Recipe, Styled UI, Registry, 문서, 예제 중 필요한 레이어만 구현한다.
9. [검증 체크리스트](verification-checklist.md)를 실행하고 [변경 연결](#변경-연결)을 따른다.

### 파일 계획 읽기

```bash
bun skills/seed-component/scripts/scaffold-plan.ts <component> \
  --platform <react|lynx|cross-platform> \
  --surface <package-only|snippet-only|package+snippet|docs-only>
```

- 스크립트는 아키텍처나 Registry 필요성을 대신 정하지 않는다. `items`는 파일 경계만 제안하며 시나리오 완전성을 보장하지 않는다.
- 이름이 `ambiguous`면 스크립트가 후보를 담은 오류로 끝난다 → 정확한 후보 이름으로 다시 실행한다.
- `items[]`의 `boundary`(`source`·`reference`·`generated`)와 `action`(`create`·`update`·`generate`·`existing`)을 본다. `source`·`reference` 중 이번 작업에 필요한 원천만 계획에 남긴다. `generated`(`editable: false`)는 원천을 고친 뒤 생성 명령으로 갱신한다.
- `conflicts`의 기존 파일은 덮어쓰지 않고 현재 구현을 검토한다.
- 기존 컴포넌트는 `currentSurface`가 실제 구현과 공개 경로를 포함하는지, 신규 컴포넌트는 `component.state`가 `not-found`인지 확인한다.
- `referenceScenarios`(다른 플랫폼의 `docs/examples/<platform>/<name>/` 예제 ID)와 `warnings`를 확인한다.
- 앞선 결정을 바꿔야 하면 결과에 경로를 덧붙이지 않는다 → [아키텍처 결정](architecture-decisions.md)의 판단 근거부터 다시 확인한다.

## 짧은 경로

세 경로 모두 작업 중 컴포넌트 API·동작·Recipe 변경이 필요해지면 [기존 구현 변경](#기존-구현-변경)으로 전환한다.

### React 문서·예제만 변경

구현 표면이 이미 있고 공개 API와 동작을 바꾸지 않는 `docs-only` 작업이다. 설계·scaffold 절차를 건너뛴다.

1. 경로 조회의 `docs`, `examples`, `registry`, `packageExports`로 Registry snippet 유무와 공개 import 경로를 정한다.
2. `docs/content/react/components/<name>.mdx`와 `docs/examples/react/<name>/`만 만들거나 고친다. 위치와 import 규칙은 [구현 순서의 Examples](implementation-steps.md#step-6-examples)를 따른다.
3. Snippet 있음 → Installation·Usage·Props를 [Snippet 문서 업데이트](implementation-steps.md#문서-업데이트) 형태로 맞춘다. 없음 → `@seed-design/react` 공개 export를 직접 쓰고 설치 단계를 만들지 않는다.
4. Usage와 Examples가 실제 예제 파일을 정확히 참조하는지 읽어 확인한다.
5. [검증 체크리스트](verification-checklist.md)의 문서 관련 항목과 [시각 검증](visual-testing.md)의 docs 페이지 확인을 실행한다.

### Storybook만 변경

`docs/stories/*.stories.tsx`나 `docs/.storybook/*`만 바꾸고 공개 API와 동작을 유지하면 [Storybook 규칙](storybook.md)과 [시각 검증](visual-testing.md)만 쓴다.

### 생성물만 어긋난 경우

생성물을 직접 고치지 않는다 → 원천과 생성 명령을 찾아 루트 `AGENTS.md`「생성」 절차를 따른다. 원천이 이미 맞으면 생성 명령만 다시 실행하고 예상한 생성물만 바뀌었는지 확인한다.

## 여러 에이전트로 나누는 작업

사용자가 협업을 요청했거나, 조사 결과 조정 비용보다 이득이 큰 독립 구현·검증 범위가 확인되면 [`seed-orchestrate-component`](../../seed-orchestrate-component/SKILL.md)를 쓴다. 상태·모션·성능·플랫폼 차이를 모두 포함해야 한다는 조건이나 역할 수에 맞춘 위임은 요구하지 않는다.

- 역할은 Rootage·Recipe·플랫폼 구현·소비 경로 통합·문서·검증 중 필요한 것만 고른다.
- 같은 파일, 공유 빌드 출력, 호스트, 전역 overlay처럼 실제로 충돌하는 자원마다 조작 소유자를 한 명 둔다. 검증 전체의 실행자를 한 명으로 제한하지 않는다.
- 안정된 변경본에서는 [검증 분담과 자원](../../seed-orchestrate-component/references/collaboration.md#검증-분담과-자원)에 따라 독립적인 패키지·소비 연결·런타임 검사를 병렬로 배정한다. 검증자는 구현하지 않고 원래 참조와 기대 결과로 판정하며, 조율자가 결과 통합과 최종 승인을 맡는다.
- Lynx 런타임 검사는 `examples/lynx-spa` 문서 예제를 기본으로 하고, 인계에 SPA 예제 ID, query를 포함한 bundle URL, 변경본과 환경 근거를 남긴다.
- 담당별 작업 종료를 전체 완료로 보지 않는다. changeset·제출 규칙은 단독 작업과 같다.

## 변경 연결

공개 패키지의 bump·changeset, commit·PR의 영향과 base, rebase·commit·push·PR 제출은 [`seed-change`](../../seed-change/SKILL.md)가 맡는다.

- 공개 패키지가 바뀜 → changeset 분기를 쓴다.
- commit·PR을 준비함 → 변경 종류와 관계없이 계획 분기로 `origin/dev`, `origin/minor`, `origin/major` 중 base를 정한다.
- 사용자가 제출을 요청함 → 제출 분기를 쓰고, 계획에서 정한 base를 rebase와 PR에 그대로 쓴다. 요청이 없으면 제출 분기를 쓰지 않는다.

## 구현 reference 라우팅

- 플랫폼이 모호하거나 교차 플랫폼 → [platform-gate.md](platform-gate.md)
- 참조가 있는 신규 구현·포팅·동작 변경 → [참조 동작 추적과 기본 장면](implementation-steps.md#참조-동작-추적과-기본-장면)
- 공개 API나 Registry 여부 결정 → [api-design.md](api-design.md)
- 요구사항에 중요한 빈칸이 있음 → [brainstorming.md](brainstorming.md)
- 새 컴포넌트 또는 레이어 구조 변경 → [architecture-decisions.md](architecture-decisions.md), [pattern-catalog.md](pattern-catalog.md)

### 레이어별 구현

- React Styled UI → [react-patterns.md](react-patterns.md)
- Lynx 구현, native 텍스트 배치나 상태 전환 → [lynx-patterns.md](lynx-patterns.md)
- Lynx CSS-free Headless 구현·추출, Styled 어댑터의 소비 계약 변경 → [lynx-headless.md](lynx-headless.md)
- Recipe → [recipe-patterns.md](recipe-patterns.md)
- Registry·문서·예제를 포함한 구현 순서 → [implementation-steps.md](implementation-steps.md)

### 조회·검증·기타

- 레이어별 시작 경로만 확인 → [guide.md](guide.md)
- 외부 인터페이스·접근성 패턴 조사 → [external-references.md](external-references.md)
- 검증과 시각 확인 → [verification-checklist.md](verification-checklist.md), [visual-testing.md](visual-testing.md)
- 막힘이 생김 → [sticking-policy.md](sticking-policy.md)
- 이 Skill의 라우팅을 고친 뒤 검토 → [review-prompts.md](review-prompts.md)

## 완료 조건

- 요청한 사용자 결과와 대상 플랫폼이 구현·타입·문서에서 일치한다.
- package와 Registry 중 선택한 배포 방식이 문서와 예제에도 그대로 적용됐다.
- 원천 파일을 고쳤고 생성 파일을 직접 고치지 않았다.
- 변경과 관련된 기존 테스트와 저장소 필수 검증을 통과했다.
- 렌더링·상호작용 변경은 [관찰 가능한 결과 판정](verification-checklist.md#관찰-가능한-결과-판정)의 시나리오별 기대·실제 결과와 실행 증거가 있다.
  - Lynx native 결과는 `examples/lynx-spa` 문서 예제에서 확인한다. MDX 페이지·host·코드 탭·QR·Web preview·docs pipeline을 바꾼 경우에만 해당 문서 변경 부분을 추가로 확인한다.
  - 기본 장면 하나의 통과로 나머지 범위를 생략하지 않는다.
- 필수 항목에 실패·환경 차단·미확인이 남으면 완료로 보고하지 않고 남은 항목을 보고한다. API 대응이나 빌드 성공은 실행 증거를 대신하지 않는다.
- 공개 패키지 변경에는 확정한 changeset이 있고, commit·PR을 준비한다면 changeset 유무와 관계없이 확정한 base를 쓰는 변경 계획이 있다.

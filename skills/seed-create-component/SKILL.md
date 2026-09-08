---
name: seed-create-component
description: SEED 컴포넌트의 플랫폼·공개 표면을 정하고 구현·문서·검증을 연결할 때 사용한다.
---

# SEED 컴포넌트 작업

이 스킬은 컴포넌트 작업의 진입점을 정하는 라우터다. 모든 참고 문서를 순서대로 읽지 않는다. 현재 작업에 필요한 스킬과 reference만 선택한다. 여러 레이어의 담당·병렬 작업·에이전트 간 협의가 요청됐거나 필요한 경우에는 [`seed-orchestrate-component`](../seed-orchestrate-component/SKILL.md)를 먼저 사용한다. 단순 작업은 기존 단독 흐름을 유지한다.

## 먼저 확인할 것

1. 저장소 루트부터 수정 경로까지 적용되는 `AGENTS.md`를 읽는다.
2. [`seed-component-map`](../seed-component-map/SKILL.md)으로 현재 구현, 공개 export, Recipe, Registry, 문서, 예제를 찾는다. 신규 구현은 대상 플랫폼의 구현 유무를 확인한다. 전체 `not-found`와 한 플랫폼만 없는 경우를 구분한다.
3. 결과에 나온 실제 파일을 직접 읽는다. 맵 결과만으로 API나 책임을 추정하지 않는다.
4. 요청을 기존 컴포넌트 변경, 새 컴포넌트, 문서·Storybook 전용 중 하나로 분류한다.

참조가 있는 신규 구현·플랫폼 포팅·동작 변경은 파일 작성 전에 [참조 동작 추적과 기본 장면](references/implementation-steps.md#참조-동작-추적과-기본-장면)을 적용한다. 공개 JSX를 넘어 hook·측정·스타일 적용까지 필요한 원천을 추적하고, 기본 장면을 실제 공개 소비 경로에서 먼저 검증한다. 이 기준은 단독 작업에도 적용하며, 문구 수정이나 동작을 보존하는 정리에 전체 절차를 요구하지 않는다.

## 함께 쓰는 `seed-*` 스킬

| 필요한 판단 | 사용할 스킬 |
| --- | --- |
| 현재 레이어와 공개 경로 찾기 | [`seed-component-map`](../seed-component-map/SKILL.md) |
| React와 Lynx의 API·상태·접근성 차이 비교 | [`seed-api-parity`](../seed-api-parity/SKILL.md) |
| Lynx 문서와 실행 예제 작성 | [`seed-write-lynx-component-docs`](../seed-write-lynx-component-docs/SKILL.md) |
| 공개 패키지 변경의 버전과 changeset 작성 | [`seed-changeset`](../seed-changeset/SKILL.md) |
| 현재 변경의 영향, 검증 순서, PR base 결정 | [`seed-change-plan`](../seed-change-plan/SKILL.md) |
| 확정한 base로 rebase·commit·push·PR 준비 | [`seed-submit-change`](../seed-submit-change/SKILL.md) |

`seed-api-parity`의 차이는 곧바로 누락으로 보지 않는다. 브라우저와 Lynx의 런타임·접근성·입력 방식 때문에 의도적으로 다른 항목인지 먼저 분류한다.

`seed-submit-change`는 사용자가 제출 작업을 요청한 경우에만 사용한다. `seed-change-plan`이 정한 `origin/dev`, `origin/minor`, `origin/major` 중 하나를 rebase와 PR base에 그대로 사용한다.

## 여러 에이전트로 나누는 작업

사용자가 협업을 요청했거나, 조사 결과 조정 비용보다 이득이 큰 독립적인 구현·검증 범위가 확인되면 [`seed-orchestrate-component`](../seed-orchestrate-component/SKILL.md)를 사용한다. 상태·모션·성능·플랫폼 차이를 모두 포함해야 한다는 조건이나 역할 수에 맞춘 위임을 요구하지 않는다.

협업 스킬은 Rootage·Recipe·플랫폼 구현·소비 경로 통합·문서·검증 중 필요한 역할만 선택한다. 역할별 기술 지침과 완료 조건은 이 스킬의 해당 단계 및 협업 스킬 reference를 따른다. 같은 파일은 한 담당자만 수정하고, 통합 빌드·서버·기기 session도 각각 한 소유자만 둔다.

협업을 사용하면 각 담당의 작업 종료를 전체 완료로 보지 않는다. 기본 장면과 최종 통합의 안정된 변경본마다 독립 검증 담당이 [`검증 체크리스트`](references/verification-checklist.md)를 적용한다. 검증 담당은 구현하지 않으며, 원래 참조와 기대 결과를 받아 환경별 통과·실패·환경 차단·미확인을 분리한다. changeset·제출 규칙은 단독 작업과 같다.

## 기존 컴포넌트 변경

1. `seed-component-map` 결과에서 이번 요청과 직접 연결된 파일을 읽는다.
2. React와 Lynx를 함께 바꾸거나 한쪽 차이가 문제인지 판단해야 하면 `seed-api-parity`를 사용한다.
3. 바꾸려는 사용자 결과를 한 문장으로 적고 대상 플랫폼과 배포 방식을 확정한다.
4. 구조를 바꾸는 경우에만 [아키텍처 결정](references/architecture-decisions.md)과 [API 설계](references/api-design.md)를 읽는다. 스타일이나 문서만 바꾸는 작업에 전체 설계 절차를 적용하지 않는다.
5. 기존 구현에서 가장 가까운 파일을 기준으로 필요한 원천 파일만 수정한다. 생성 파일은 직접 수정하지 않는다.
6. [검증 체크리스트](references/verification-checklist.md)에서 실제 변경과 관련된 항목을 실행한다.
7. 공개 패키지가 바뀌면 `seed-changeset`을 사용한다. commit·PR을 준비할 때는 변경 종류와 관계없이 `seed-change-plan`으로 base를 정한다. rebase·commit·push·PR 제출을 요청받았다면 마지막에 `seed-submit-change`를 사용한다.

## 새 컴포넌트

1. `seed-component-map`으로 대상 플랫폼의 구현 유무와 가까운 기존 컴포넌트의 경로를 확인한다. 한 플랫폼만 없는 포팅은 전체 맵의 `not-found`를 요구하지 않고, 존재하는 플랫폼을 동작 참조로 삼는다.
2. 대상 플랫폼을 `react`, `lynx`, `cross-platform` 중 하나로 정한다. 판단 기준은 [플랫폼 선택](references/platform-gate.md)에 있다.
3. [API 설계](references/api-design.md)에 따라 제공 방식을 `package-only`, `snippet-only`, `package+snippet`, `docs-only` 중 하나로 정한다.
4. 요구사항에 구현을 바꿀 빈칸이 있을 때만 [요구사항 탐색](references/brainstorming.md)을 사용한다. 이미 구체적인 요청을 다시 인터뷰하지 않는다.
5. [아키텍처 결정](references/architecture-decisions.md)에서 Headless 책임, Recipe 종류, 접근성, 레이어별 참조 컴포넌트를 정한다.
6. 다음 명령으로 확정한 결정을 파일 계획으로 바꾼다.

```bash
bun skills/seed-create-component/scripts/scaffold-plan.ts <component> \
  --platform <react|lynx|cross-platform> \
  --surface <package-only|snippet-only|package+snippet|docs-only>
```

스크립트는 아키텍처나 Registry 필요성을 대신 결정하지 않는다. `items`는 파일 경계만 제안하며 시나리오 완전성을 보장하지 않는다. `source`, `reference`, `generated`, `conflicts`, `referenceScenarios`, `warnings`를 검토하고 이번 작업에 필요한 원천 파일만 계획에 남긴다.

다른 플랫폼의 문서 예제가 있으면 `referenceScenarios`의 모든 ID를 `동일 지원`, `Lynx식 변환`, `미지원`으로 분류한 대응표를 파일 생성 전에 작성한다. `preview.tsx` 하나가 계획에 있다는 이유로 다른 예제를 범위 밖으로 두지 않는다. Lynx 문서·예제를 포함하면 [Lynx 문서 작성 스킬](../seed-write-lynx-component-docs/SKILL.md)의 asset, frame, 초기 상태, 입력, 전이, 화면 셸 대응표를 완료 조건으로 삼는다.

7. [구현 순서](references/implementation-steps.md)에 따라 Headless, Rootage, Recipe, Styled UI, Registry, 문서, 예제 중 필요한 레이어만 구현한다.
8. [검증 체크리스트](references/verification-checklist.md)를 실행한다. 공개 패키지가 바뀌면 `seed-changeset`을 사용한다. commit·PR을 준비할 때는 `seed-change-plan`으로 base를 정하고, 제출을 요청받은 경우에만 `seed-submit-change`로 이어간다.

새 패키지, 외부 의존성, CI 설정이 필요하면 구현 전에 사용자 확인을 받는다.

## 짧은 경로

### Lynx 문서·예제만 변경

컴포넌트와 런타임 동작을 바꾸지 않으면 `seed-component-map`으로 배포 방식을 확인한 뒤 `seed-write-lynx-component-docs`를 사용한다. 실제 호스트 앱에서도 재현되는 문제를 발견하면 문서용 우회를 만들지 않고 컴포넌트 변경 흐름으로 돌아온다.

### Storybook만 변경

`docs/stories/*.stories.tsx`나 `docs/.storybook/*`만 바꾸고 공개 API와 동작은 유지한다면 [Storybook 규칙](references/storybook.md)과 [시각 검증](references/visual-testing.md)만 사용한다. 작업 중 컴포넌트 API나 Recipe 변경이 필요해지면 기존 컴포넌트 변경 흐름으로 전환한다.

### 생성물만 어긋난 경우

원천 파일과 생성 명령을 먼저 찾는다. 생성 파일을 직접 고치지 않는다. 원천이 맞다면 저장소 지침의 생성 명령을 실행하고 예상한 생성물만 바뀌었는지 확인한다.

## 구현 reference 라우팅

| 상황 | 읽을 문서 |
| --- | --- |
| 플랫폼이 모호하거나 교차 플랫폼 | [platform-gate.md](references/platform-gate.md) |
| 참조가 있는 신규 구현·포팅·동작 변경 | [참조 동작 추적과 기본 장면](references/implementation-steps.md#참조-동작-추적과-기본-장면) |
| 공개 API나 Registry 여부 결정 | [api-design.md](references/api-design.md) |
| 요구사항에 중요한 빈칸이 있음 | [brainstorming.md](references/brainstorming.md) |
| 새 컴포넌트 또는 레이어 구조 변경 | [architecture-decisions.md](references/architecture-decisions.md), [pattern-catalog.md](references/pattern-catalog.md) |
| React Styled UI 구현 | [react-patterns.md](references/react-patterns.md) |
| Lynx 구현, native 텍스트 배치나 상태 전환 | [lynx-patterns.md](references/lynx-patterns.md) |
| Recipe 구현 | [recipe-patterns.md](references/recipe-patterns.md) |
| 레이어별 경로와 생성 관계만 확인 | [guide.md](references/guide.md) |
| Registry·문서·예제를 포함한 구현 순서 | [implementation-steps.md](references/implementation-steps.md) |
| 외부 인터페이스·접근성 패턴 조사 | [external-references.md](references/external-references.md) |
| 검증과 시각 확인 | [verification-checklist.md](references/verification-checklist.md), [visual-testing.md](references/visual-testing.md) |
| 막힘이 생김 | [sticking-policy.md](references/sticking-policy.md) |
| 이 스킬의 라우팅을 수정한 뒤 검토 | [review-prompts.md](references/review-prompts.md) |

## 완료 조건

- 요청한 사용자 결과와 대상 플랫폼이 구현·타입·문서에서 일치한다.
- package와 Registry 중 선택한 배포 방식이 문서와 예제에도 그대로 적용된다.
- 원천 파일을 수정하고 생성 파일을 직접 고치지 않았다.
- 변경과 관련된 기존 테스트와 저장소 필수 검증을 통과했다.
- 렌더링·상호작용 변경은 [관찰 가능한 결과 판정](references/verification-checklist.md#관찰-가능한-결과-판정)의 시나리오별 기대·실제 결과와 실행 증거가 있다. 기본 장면 하나의 통과로 나머지 범위를 생략하지 않는다.
- 필수 항목에 실패·환경 차단·미확인이 남으면 전체 완료로 보고하지 않는다. API 대응이나 빌드 성공은 실행 증거를 대체하지 않는다.
- 공개 패키지 변경에는 확정한 changeset이 있다.
- commit·PR을 준비한다면 changeset 유무와 관계없이 확정한 base를 쓰는 변경 계획이 있다.
